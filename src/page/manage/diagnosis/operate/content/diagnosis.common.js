
import {dNormalService} from '../../normal/normal.service';
import pisTitle from '../../../../../common/components/pisTitle';
import pisIcon from '../../../../../common/components/pisIcon';

export default {
  components: {
    pisTitle,
    pisIcon,
  },
  data() {
    return {
      haveVideo: false,
      type: '',
      imgSrc: '',
      diagnosisTemplateInfo: '',
      diagnosisViewVisible: false,
      templateLoading: false,
      diagnosisTemplateList: [],
      uploadHeaders: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
    };
  },
  props: {
    caseInfoForm: Object,
    diagnosis: Object,
    readonly: false,
  },
  mounted() {
    if(!this.readonly) {
      this.getVideo();
    }
  },
  methods: {
    previous(id) {
      this.$router.replace(`/diagnosis/operate/${id}`);
    },
    next(id) {
      this.$router.replace(`/diagnosis/operate/${id}`);
    },
    getVideo() {
      navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        this.haveVideo = true;
        this.$refs.gallery.$refs.video.srcObject = stream;
      }).catch((err) => {
        this.haveVideo = false;
        this.$message('暂无视频源，请从本地上传报告附图。');
      });
    },
    covertBase64UrlToFile(urlData) {
      let bytes = window.atob(urlData.split(',')[1]); // 对用base64编码过的字符串进行解码
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new File([ab], `${new Date().getTime()}.png`, {type: 'image/png', lastModified: new Date()});
    },
    viewReport() {
      if (!this.$refs['writeDiagnosisForm']) return;
      this.$refs['writeDiagnosisForm'].validate((valid) => {
        if (valid) {
          this.$emit('view-report', this.writeDiagnosisForm);
        }
      });
    },
    saveDiagnosis() {
      if (!this.$refs['writeDiagnosisForm']) return;
      this.$refs['writeDiagnosisForm'].validate((valid) => {
        if (valid) {
          this.$emit('save-diagnosis', this.writeDiagnosisForm);
        }
      });
    },
    auditing() {
      if (!this.$refs['writeDiagnosisForm']) return;
      this.$refs['writeDiagnosisForm'].validate((valid) => {
        if (valid) {
          this.$emit('auditing', this.writeDiagnosisForm);
        }
      });
    },
    consultation() {
      this.$emit('consultation');
    },
    handleRemove(file, fileList) {
      this.writeDiagnosisForm.imgList = fileList;
    },
    handleSuccess(response, file, fileList) {
      this.writeDiagnosisForm.imgList = fileList;
    },
    exportAdvice() {
      this.$emit('export-advice', this.writeDiagnosisForm);
    },
    exportTemplate(type) {
      this.type = type;
      this.diagnosisTemplateInfo = '';
      this.diagnosisViewVisible = true;
      this.reportTemplateInfo();
    },
    reportTemplateInfo() {
      this.templateLoading = true;
      dNormalService.reportTemplateInfo(this.caseInfoForm.id)
        .then((res) => {
          this.diagnosisTemplateList = this.resetDiagnosisArray(res.body.data);
        }).finally(() => {
        this.templateLoading = false;
      });
    },
    resetDiagnosisArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            dict_specimen_id: item.dict_specimen_id,
            value: item.id,
            label: item.diagnostic_term_name,
            dictPathologicDiagnosis: item.dictPathologicDiagnosis.data,
            children: this.resetDiagnosisArray(item.children, level + 1),
            level: level,
          };
        } else {
          return {
            id: item.id,
            dict_specimen_id: item.dict_specimen_id,
            value: item.id,
            label: item.diagnostic_term_name,
            dictPathologicDiagnosis: item.dictPathologicDiagnosis.data,
            level: level,
          };
        }
      });
    },
    handleDiagnosisNodeClick(item, node) {
      if (this.type === 'mirror') {
        this.diagnosisTemplateInfo = item.dictPathologicDiagnosis.see_under_microscope;
      }
      else if (this.type === 'diagnosis') {
        this.diagnosisTemplateInfo = item.dictPathologicDiagnosis.pathologic_diagnosis_name;
      }
    },
    httpRequest({file}) {
      const formData = new FormData();
      formData.append('draw_material', file);
      dNormalService.uploadImage(formData)
        .then((res) => {
          this.writeDiagnosisForm.imgList.push({
            url: res.body.data.path,
            name: this.writeDiagnosisForm.imgList.length + 1,
          });
        });
    },
    handleCommand(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
  },
};
