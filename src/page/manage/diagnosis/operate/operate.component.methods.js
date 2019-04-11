import {mapState} from 'vuex';

import {areaArrToString} from '../../../../config/utils';
import {collectService} from '../../desk/collect/collect.service';
import {dNormalService} from '../normal/normal.service';
import {reportService} from '../../dictionary/report/report.service';
import {roleService} from '../../system/role/role.service';

export default {
  computed: mapState({
    doctorList: state => state.userList.map((user) => ({
      label: user.realname,
      value: user.name,
    })),
  }),
  methods: {
    processConfigList() {
      dNormalService.processConfigList({settings_key: ['technicalAdvice', 'specialMedicalAdvice', 'clinicalProcess']})
        .then(({body}) => {
          const {technicalAdvice, specialMedicalAdvice} = body.data;
          this.tecProcess = this.columnTecList.filter((column) => !!technicalAdvice[column.name]).map((column) => column.label);
          this.specProcess = this.columnSpecList.filter((column) => !!specialMedicalAdvice[column.name]);
          this.specProcess.forEach((process) => {
            if (process.name === 'specificStain') process.name = 'dye';
            if (process.name === 'molecularPathology') process.name = 'molecular';
          });
        });
    },
    backList() {
      this.$router.back();
    },
    registerInfo() {
      this.loading = true;
      return dNormalService.caseInfo(this.id)
        .then((res) => {
          if (res.body.data?.origin) {
            res.body.data.origin = areaArrToString(res.body.data.origin, this.area);
          }
          this.isCollect = res.body.data.has_collection;
          this.followed = res.body.data.has_followup;
          this.caseInfoForm = res.body.data;
          this.caseInfoForm.age = this.caseInfoForm.age + this.caseInfoForm.age_unit;
          this.caseInfoForm.ext = this.caseInfoForm.ext.data;
          this.caseType = this.caseInfoForm.case_type;
          this.caseInfoForm.specimenTotalName = '';
          this.caseInfoForm.imgs = this.caseInfoForm.img.data;
          this.caseInfoForm.hasImg = !!this.caseInfoForm.img.data.length;
          this.caseInfoForm.drawMaterial = this.caseInfoForm.draw_material?.data || {};
          this.caseInfoForm.specimen.data.forEach((specimen) => {
            this.caseInfoForm.specimenTotalName += specimen.specimen_name + ',';
          });
          this.specialInspectionAdvice = this.caseType === '常规' ? this.caseInfoForm?.specialProductionRoutine?.data :
            this.caseInfoForm?.specialProductionCell?.data;
        }).finally(() => {
          this.loading = false;
        });
    },
    writeDiagnosis() {
      this.writeVisible = true;
    },
    exportAdvice(diagnosis) {
      this.writeDiagnosisForm = diagnosis;
      if (this.specialInspectionAdvice.length === 0) {
        this.$message.warning('暂无医嘱');
        return;
      }
      if (this.caseInfoForm?.special_advice_status === '特检未完成') {
        this.$message.warning('特检医嘱未完成');
        return;
      }
      let content = '';
      this.specialInspectionAdvice.forEach((item) => {
        if (item.result) {
          content = `${content}${item.advice}(${item.result})，`;
        }
      });
      /*if (this.caseInfoForm.technicalAdvice.data.length > 0) {
        this.caseInfoForm.technicalAdvice.data.forEach((item) => {
          content = `${content}${item.specimen_id}:${item.advice}\n`;
        });
      }*/
      let obj = Object.assign({}, this.writeDiagnosisForm);
      obj.advice = (obj.advice || '') + content;
      this.writeDiagnosisForm = obj;
    },
    diagnosisInfo() {
      if (this.caseType === '细胞' && this.caseInfoForm?.specimen_type === '宫颈细胞') {
        dNormalService.tctDiagnosisInfo(this.id)
          .then((res) => {
            this.writeDiagnosisForm = {
              specimen_satisfaction: res.body.data?.specimen_satisfaction,
              imgList: res.body.data?.tct_imgList ? res.body.data.tct_imgList.map((item, index) => ({
                url: item,
                name: index + 1,
              })) : [],
              epithelium_count: res.body.data?.epithelium_count,
              neck_canal_cell_count: res.body.data?.neck_canal_cell_count,
              metaplastic_cell_count: res.body.data?.metaplastic_cell_count,
              inflammation: res.body.data?.inflammation,
              tct_diagnostic: res.body.data?.tct_diagnostic,
              tct_content: res.body.data?.tct_content || [],
              microbial: res.body.data?.tct_content?.[0] || {},
              squamous_cell: res.body.data?.tct_content?.[1] || {},
              glandular_cell: res.body.data?.tct_content?.[2] || {},
            };
          }).catch(() => {
          this.writeDiagnosisForm = {};
        });
      } else {
        dNormalService.diagnosisInfo(this.id)
          .then((res) => {
            this.writeDiagnosisForm = {
              mirror: res.body.data?.see_under_microscope,
              imgList: res.body.data?.appended_drawings ? res.body.data?.appended_drawings.map((item, index) => ({
                url: item,
                name: index + 1,
              })) : [],
              advice: res.body.data?.diagnostic_opinion,
              remark: res.body.data?.note_suggestion,
            };
          }).catch(() => {
          this.writeDiagnosisForm = {};
        });
      }

    },
    async saveDiagnosis(diagnosis) {
      this.writeDiagnosisForm = diagnosis;

      if (this.caseType === '细胞' && this.caseInfoForm?.specimen_type === '宫颈细胞') {
        this.writeDiagnosisForm.tct_content =
          [this.writeDiagnosisForm.microbial, this.writeDiagnosisForm.squamous_cell, this.writeDiagnosisForm.glandular_cell];
        return new Promise((resolve, reject) => {
          let data = {
            pathology_id: this.id,
            specimen_satisfaction: this.writeDiagnosisForm.specimen_satisfaction,
            tct_imgList: this.writeDiagnosisForm.imgList ? this.writeDiagnosisForm.imgList.map((item) => item.response ? item.response?.data?.path : item.url) : [],
            epithelium_count: this.writeDiagnosisForm.epithelium_count,
            neck_canal_cell_count: this.writeDiagnosisForm.neck_canal_cell_count,
            metaplastic_cell_count: this.writeDiagnosisForm.metaplastic_cell_count,
            inflammation: this.writeDiagnosisForm.inflammation,
            tct_diagnostic: this.writeDiagnosisForm.tct_diagnostic,
            tct_content: [this.writeDiagnosisForm.microbial, this.writeDiagnosisForm.squamous_cell, this.writeDiagnosisForm.glandular_cell],
          };
          dNormalService.postTCTDiagnosis(data)
            .then((res) => {
              resolve();
              this.$message.success('保存成功');
            }).catch(() => {
            reject();
            this.$message.error('保存失败');
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          let data = {
            pathology_id: this.id,
            see_under_microscope: this.writeDiagnosisForm.mirror,
            appended_drawings: this.writeDiagnosisForm.imgList ? this.writeDiagnosisForm.imgList.map((item) => item.response ? item.response.data.path : item.url) : undefined,
            diagnostic_opinion: this.writeDiagnosisForm.advice,
            note_suggestion: this.writeDiagnosisForm.remark,
          };
          dNormalService.postDiagnosis(data)
            .then((res) => {
              resolve();
              this.$message.success('保存成功');
            }).catch(() => {
            reject();
            this.$message.error('保存失败');
          });
        });
      }

    },
    async viewReport(diagnosis) {
      this.writeDiagnosisForm = diagnosis;
      try {
        await this.saveDiagnosis(diagnosis);
        dNormalService.viewReport(this.id).then((res) => {
          this.pdf = URL.createObjectURL(res.data);
        });
        this.pdfViewVisible = true;
      } catch (e) {
        dNormalService.viewReport(this.id).then((res) => {
          this.pdf = URL.createObjectURL(res.data);
        });
        this.pdfViewVisible = true;
      }
    },
    filedReport() {
      if (this.caseInfoForm?.special_advice_status === '特检未完成') {
        this.$confirm('有特检医嘱未完成，是否签发报告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.postFiledReport();
        });
        return;
      }
      if (this.caseInfoForm?.technical_advice_status === '技术未完成') {
        this.$confirm('有技术医嘱未完成，是否签发报告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.postFiledReport();
        });
        return;
      }
      this.postFiledReport();
    },
    postFiledReport() {
      dNormalService.filedReport(this.id)
        .then((res) => {
          this.pdfViewVisible = false;
          this.registerInfo();
          this.$message.success('签发成功');
        }).catch(() => {
        this.$message.error('签发失败');
      });
    },
    submitAdvice(adviceTags) {
      let data = {
        pathology_id: this.id,
        advice: adviceTags.map((tag) => ({
          type: tag.type,
          advice: tag.advice,
          specimen_id: tag.specimen_id,
          paraffin_block_id: tag.paraffin_block_id ? tag.paraffin_block_id : undefined,
        })),
      };
      dNormalService.doctorOrder(data)
        .then((res) => {
          this.registerInfo();
          this.writeVisible = false;
          this.$message.success('下医嘱成功');
          // this.$router.push('/diagnosis/normal');
        }).catch(() => {
        this.$message.warning('下医嘱失败');
      });
    },
    auditing(diagnosis) {
      this.writeDiagnosisForm = diagnosis;
      this.reviewViewVisible = true;
      this.reviewDoctor = '';
    },
    consultation() {
      this.selectedDoctorList = [];
      this.consultationDoctorDialog = true;
    },
    confirmConsultationDoctor() {
      let params = {
        id: this.id,
        user_id: this.selectedDoctorList,
      };
      dNormalService.consultations(params).then((res) => {
        this.$message.success('科内会诊发起成功');
        this.consultationDoctorDialog = false;
      }).catch((err) => {
        this.$message.error('科内会诊发起失败');
      });
    },
    async confirmDoctor() {
      try {
        await this.saveDiagnosis(this.writeDiagnosisForm);
        dNormalService.auditing({
          id: this.id,
          review_doctor: this.reviewDoctor,
          status: '未审核',
        }).then(() => {
          this.reviewViewVisible = false;
          this.$message.success('提交审核成功');
        }).catch(() => {
          this.$message.error('提交审核失败');
        });
      } catch (e) {
        this.$message.error('诊断内容保存失败');
        this.pdfViewVisible = true;
      }

    },
    doCollect() { // 收藏病例
      let id = this.caseInfoForm.id;
      collectService.addCollect(id).then((res) => {
        this.isCollect = true;
        this.$message.success('收藏成功。');
      });
    },
    cancelCollect() { // 取消收藏
      let id = this.caseInfoForm.id;
      collectService.cancelCollect({case_id: id}).then((res) => {
        this.isCollect = false;
        this.$message({
          type: 'success',
          message: '取消收藏成功!',
        });
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: '取消失败!',
        });
      });
    },
    remoteConsultation() {
      if(this.sectionList?.length === 0) {
        this.$message.warning('暂无切片，无法发送远程会诊');
        return;
      }
      let id = this.caseInfoForm.id;
      dNormalService.remoteConsultation(id).then((res) => {
        this.$message.success('远程会诊发送成功');
        this.registerInfo();
      }).catch((err) => {
        this.$message.error('远程会诊发送失败');
      }).finally((e) => {

      });
    },
    getTemplateList() {
      reportService.getTable({
        page: 1,
        page_size: 100,
      }).then((res) => {
        this.templateList = res.body.data;
      });
    },
    templateChange(val) {
      if (val !== '') {
        let params = {
          pathology_id: this.id,
          template_id: val,
        };
        dNormalService.bindTemplate(params).then((res) => {
          this.viewReport(this.writeDiagnosisForm);
        }).catch((err) => {

        });
      }
    },
    gotoBind() {
      this.$router.push(`/slice/bind?id=${this.caseInfoForm.id}`);
    },
    covertBase64UrlToFile(urlData) {
      let bytes = window.atob(urlData.split(',')[1]); // 对用base64编码过的字符串进行解码
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new File([ab], `${new Date().getTime()}.png`, {
        type: 'image/png',
        lastModified: new Date(),
      });
    },
    screenShot(baseUrl) {
      let imgFile = this.covertBase64UrlToFile(baseUrl);
      this.$refs.doctorAdvice.httpRequest({file: imgFile});
    },
    setFollow() {
      if (this.followed) {
        this.$confirm('确定要取消随访病例吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          dNormalService.cancelFollow({id: [this.id]}).then((res) => {
            this.$message.success('取消随访病例成功');
            this.followed = false;
          }).catch((err) => {

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      } else {
        dNormalService.setFollow({id: this.id}).then((res) => {
          this.$message.success('加入随访病例成功');
          this.followed = true;
        }).catch((err) => {

        });
      }
    },
    confirmConsultation(consultationContent) {
      let params = {
        consultation: [
          {id: this.id, opinion: consultationContent},
        ],
      };
      dNormalService.updateConsultation(params).then((res) => {
        this.$message.success('意见提交成功');
        this.registerInfo();
      });
    },
    getDoctorById() {
      roleService.roleList().then((res) => {
        let role = res.body.data.find((item) => item.name === '科内会诊');
        if (role) {
          dNormalService.getDoctorById({role_id: [role.id]}).then((res) => {
            this.consultationDoctorList = res.body.data;
          });
        }
      });
    },
  },
};
