import {dNormalService} from '../../diagnosis/normal/normal.service';
import materialsInfo
  from '../../diagnosis/operate/content/materials-info.component';
import registerInfo
  from '../../diagnosis/operate/content/register-info.component';
import doctorAdvice
  from '../../diagnosis/operate/content/doctor-advice.component';
import diagnosisContent
  from '../../diagnosis/operate/content/diagnosis-content.component';
import tctContent from '../../diagnosis/operate/content/tct-content.component';
import sectionList
  from '../../diagnosis/operate/content/section-list.component';
import pisSlideView from '../../../../common/components/pisSlideView/pisSlideView';
import {areaArrToString} from '../../../../config/utils';

export default {
  components: {
    materialsInfo,
    registerInfo,
    doctorAdvice,
    diagnosisContent,
    tctContent,
    sectionList,
    pisSlideView,
  },
  data() {
    return {
      loading: false,
      caseType: '',
      diagnosisType: '',
      sectionValue: [],
      immValue: [],
      adviceTags: [],
      tAdviceTags: [],
      reviewDoctor: '',
      activeName: 'register',
      pdfViewVisible: false,
      suggestions: ['1'],
      pdf: '',
      caseInfoForm: {
        ext: {},
        specimen: {},
        drawMaterial: {},
        technicalAdvice: {data: []},
        paraffinSection: {data: []},
      },
      writeDiagnosisForm: {},
      isReadonly: true,
      specialInspectionAdvice: [],
    };
  },
  computed: {
    tabList: function() {
      let tabList = [];
      if ((this.caseType === '常规' || this.caseType === '冰冻')
        && this.caseInfoForm.outside_register_type !== '玻片' && this.caseInfoForm.outside_register_type !== '蜡块') {
        tabList = [{
          id: 1,
          label: '诊断信息',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }, {
          id: 3,
          label: '取材信息',
          name: 'materials',
        }];
      } else if (this.caseInfoForm.outside_register_type === '玻片' || this.caseInfoForm.outside_register_type === '蜡块') {
        tabList = [{
          id: 1,
          label: '诊断信息',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }];
      }
      tabList.push({
        id: 4,
        label: '阅片',
        name: 'film',
      });
      if (this.caseInfoForm?.technicalAdvice?.data?.length > 0) {
        tabList = tabList.concat([{
          id: 6,
          label: '技术医嘱',
          name: 'technical',
        }]);
      }
      if (this.caseInfoForm.hz_status !== '未远程会诊') {
        tabList = tabList.concat([{
          id: 8,
          label: '远程会诊',
          name: 'remote',
        }]);
      }
      if (this.caseInfoForm.is_opinion) {
        tabList = tabList.concat([{
          id: 9,
          label: '科内会诊',
          name: 'consultation',
        }]);
      }
      if (Object.keys(this.writeDiagnosisForm).length === 0) {
        tabList.splice(0, 1);
      }
      return tabList;
      /*if (this.caseType === '常规' || this.caseType === '冰冻') {
        tabList = [{
          id: 2,
          label: '病例信息',
          name: 'register'
        }];
        if(this.caseInfoForm.status !== "未取材") {
          tabList = tabList.concat(
            [{
              id: 3,
              label: '取材信息',
              name: 'materials'
            }]
          )
        }
        if(!!(~['已绑定','已签发', '已打印', '已发放'].indexOf(this.caseInfoForm.status))) {
          tabList = tabList.concat(
            [{
              id: 4,
              label: '数字切片',
              name: 'film'
            }]
          )
        }
        if(!!(~['已签发', '已打印', '已发放'].indexOf(this.caseInfoForm.status))) {
          tabList = tabList.concat(
            [
              {
                id: 1,
                label: '诊断信息',
                name: 'diagnosis'
              }
            ]
          )
        }
      } else if (this.caseType === '细胞') {
        tabList = [{
          id: 5,
          label: '病例信息',
          name: 'register'
        }];
      }
      if (this.caseInfoForm?.technicalAdvice?.data?.length > 0) {
        tabList = tabList.concat([{
          id: 6,
          label: '技术医嘱',
          name: 'technical',
        }]);
      }
      if (this.specialInspectionAdvice.length > 0) {
        tabList = tabList.concat([{
          id: 7,
          label: '特检医嘱',
          name: 'special',
        }]);
      }
      if (this.caseInfoForm.hz_status !== '未远程会诊') {
        tabList = tabList.concat([{
          id: 8,
          label: '远程会诊',
          name: 'remote',
        }]);
      }
      return tabList;*/
    },
    sectionList() {
      return this.caseInfoForm?.sectionPath?.data || [];
    },
  },
  props: ['id'],
  created() {
    this.registerInfo();
    this.diagnosisInfo();
  },
  methods: {
    handleClick() {

    },
    backList() {
      this.$router.go(-1);
    },
    registerInfo() {
      this.loading = true;
      dNormalService.caseInfo(this.id)
        .then((res) => {
          if (res.body.data?.origin) {
            res.body.data.origin = areaArrToString(res.body.data.origin, this.area);
          }
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
        }).catch((err) => {
      }).finally(() => {
        this.loading = false;
      });
    },
    diagnosisInfo() {
      if (this.caseType === '细胞' && this.caseInfoForm?.specimen_type === '宫颈细胞') {
        dNormalService.tctDiagnosisInfo(this.id)
          .then((res) => {
            if (res.body.data) {
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
            } else {
              this.writeDiagnosisForm = {};
            }
          }).catch(() => {
          this.writeDiagnosisForm = {};
        });
      } else {
        dNormalService.diagnosisInfo(this.id)
          .then((res) => {
            if (res.body.data) {
              this.writeDiagnosisForm = {
                mirror: res.body.data?.see_under_microscope,
                imgList: res.body.data?.appended_drawings ? res.body.data?.appended_drawings.map((item, index) => ({
                  url: item,
                  name: index + 1,
                })) : [],
                advice: res.body.data?.diagnostic_opinion,
                remark: res.body.data?.note_suggestion,
              };
            } else {
              this.writeDiagnosisForm = {};
            }
          }).catch(() => {
          this.writeDiagnosisForm = {};
        });
      }
    },
    viewReport(diagnosis) {
      this.writeDiagnosisForm = diagnosis;
      this.pdf = dNormalService.viewReport(this.id);
      this.pdfViewVisible = true;
    },
    gotoBind() {
      this.$router.push(`/slice/bind?id=${this.caseInfoForm.id}`);
    },
    goTakeSpecimen() {
      this.$router.push(`/specimen/takespecimen/${this.caseInfoForm.id}`);
    },
    goOperate() {
      this.$store.commit('setCollapse', true);
      this.$router.push(`/diagnosis/operate/${this.caseInfoForm.id}`);
    },
  },
};
