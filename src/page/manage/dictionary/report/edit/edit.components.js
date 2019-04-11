import draggable from 'vuedraggable';
import {editService} from "../edit/edit.service";

export default {
  components: {
    draggable
  },
  data() {
    return {
      report: {
        hospital_name: '江丰生物病理中心',
        report_name: '病理检查报告',
        sign_at:'签字日期',
        doctor_sign: '医生签名',
        footer_text: '本报告签名后生效，仅供临床医师参考，如有疑问请与本科联系。',
      },
      reportId:'',
      template_name:'',
      headerForm: {},
      footerForm: {},
      saveForm: {
        type:'通用'
      },
      logoImgList:[],
      logoSrc:'',
      limit:1,
      dialogVisible:false,
      saveFormRules: {
        template_name: [
          {required: true, message: '请输入模版名称', trigger: 'blur'},
        ],
      },
      dialogImageUrl:'',
      pageLoading: false,
      saveDialog: false,
      headerDialog: false,
      contentDialog: false,
      footerDialog: false,
      uploadImgHeader: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
      allBaseInfoList: [
        {label: '姓名', value: '姓名', id: 'name'},
        {label: '性别', value: '性别', id: 'gender'},
        {label: '年龄', value: '年龄', id: 'age'},
        {label: '门诊号', value: '门诊号', id: 'anamnesisNo'},
        {label: '住院号', value: '住院号', id: 'admissionNumber'},
        {label: '床号', value: '床号', id: 'bedNumber'},
        {label: '送检时间', value: '送检时间', id: 'inspectionDate'},
        {label: '送检科室', value: '送检科室', id: 'inspectionDepartment'},
        {label: '送检医生', value: '送检医生', id: 'inspectionDoctor'},
        {label: '标本类型', value: '标本类型', id: 'specimenType'},
        {label: '标本名称', value: '标本名称', id: 'specimenName'},
        {label: '报告时间', value: '报告时间', id: 'reportDate'},
        {label: '初诊医生', value: '初诊医生', id: 'firstDoctor'},
        {label: '复诊医生', value: '复诊医生', id: 'checkDoctor'},
      ],
      allContentInfoList: [
        {label: '病理图像名称', value: '病理图像', id: 'pathologyImg'},
        {label: '临床诊断名称', value: '临床诊断', id: 'clinical'},
        {label: '大体所见名称', value: '大体所见', id: 'generally'},
        {label: '镜下所见名称', value: '镜下所见', id: 'microscope'},
        {label: '病理诊断名称', value: '病理诊断', id: 'diagnosis'},
        {label: '附注建议名称', value: '附注建议', id: 'suggestion'},
        {label: '特检结果名称', value: '特检结果', id: 'specialInspect'},
      ],
      baseInfoList: [
        {label: '姓名', value: '姓名', id: 'name'},
        {label: '性别', value: '性别', id: 'gender'},
        {label: '年龄', value: '年龄', id: 'age'},
        {label: '门诊号', value: '门诊号', id: 'anamnesisNo'},
        {label: '住院号', value: '住院号', id: 'admissionNumber'},
        {label: '床号', value: '床号', id: 'bedNumber'},
        {label: '送检时间', value: '送检时间', id: 'inspectionDate'},
        {label: '送检科室', value: '送检科室', id: 'inspectionDepartment'},
        {label: '送检医生', value: '送检医生', id: 'inspectionDoctor'},
        {label: '标本类型', value: '标本类型', id: 'specimenType'},
        {label: '报告时间', value: '报告时间', id: 'reportDate'},
      ],
      diagnosisInfoList: [
        {label: '病理图像名称', value: '病理图像', id: 'pathologyImg'},
        {label: '临床诊断名称', value: '临床诊断', id: 'clinical'},
        {label: '大体所见名称', value: '大体所见', id: 'generally'},
        {label: '镜下所见名称', value: '镜下所见', id: 'microscope'},
        {label: '病理诊断名称', value: '病理诊断', id: 'diagnosis'},
        {label: '附注建议名称', value: '附注建议', id: 'suggestion'},
        {label: '特检结果名称', value: '特检结果', id: 'specialInspect'},
      ],
      pathologothImgList: [{}, {}, {}],
    }
  },
  watch: {

  },
  computed:{
    selectBaseInfoList: function () {
      const selectBaseInfoList = [...this.allBaseInfoList];
      for(let i in this.baseInfoList) {
        let bIndex = selectBaseInfoList.findIndex((item) => item.id === this.baseInfoList[i].id);
        if(~!bIndex) {
          selectBaseInfoList.splice(bIndex,1)
        }
      }
      return selectBaseInfoList;
    },
    selectContentList: function () {
      const selectContentList = [...this.allContentInfoList];
      for(let i in this.diagnosisInfoList) {
        let bIndex = selectContentList.findIndex((item) => item.id === this.diagnosisInfoList[i].id);
        if(~!bIndex) {
          selectContentList.splice(bIndex,1)
        }
      }
      return selectContentList;
    }

  },
  created() {
    if(this.$route.query.id) {
      this.reportId =  this.$route.query.id;
      this.getReport(this.reportId);
    }else{

    }
  },
  mounted() {

  },
  methods:{
    cancelHeaderDialog() {
      this.headerDialog = false;
    },
    submitHeaderSetup() {
      this.headerDialog = false;
    },
    cancelFooterDialog() {
      this.footerDialog = false;
    },
    submitFooterSetup() {
      this.footerDialog = false;
    },
    cancelContentDialog() {
      this.contentDialog = false;
    },
    submitContentSetup() {
      this.contentDialog = false;
    },
    deleteDiagnosis(index) {
      this.$confirm(`确定要删除${this.diagnosisInfoList[index].value}信息吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.diagnosisInfoList.splice(index,1);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    deleteBaseInfo(index) {
      this.$confirm(`确定要删除${this.baseInfoList[index].label}信息吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseInfoList.splice(index,1);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    deleteImg(index) {
      this.pathologothImgList.splice(index,1);
    },
    addImg() {
      this.pathologothImgList.push({});
    },
    getReport(id) {
      this.pageLoading = true;
      editService.getReport(id).then((res)=>{
        if(res.body.data.logo !== '') {
          this.logoImgList.push({name:res.body.data.template_name, url:res.body.data.logo});
        }
        this.saveForm.template_name = res.body.data.template_name;
        this.saveForm.type = res.body.data.type;
        this.report = res.body.data.key_words_list.report;
        this.baseInfoList = res.body.data.key_words_list.baseInfoList;
        this.diagnosisInfoList = res.body.data.key_words_list.diagnosisInfoList;
        this.pathologothImgList = res.body.data.key_words_list.pathologothImgList;
      }).catch((err) => {
      }).finally((e) =>{
        this.pageLoading = false;
      })
    },
    setting() {
      this.saveDialog = true;
    },
    selectTag(index) {
      this.$confirm(`确定要添加${this.selectBaseInfoList[index].label}信息吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseInfoList.push(this.selectBaseInfoList[index]);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    selectContentTag(index) {
      this.$confirm(`确定要添加${this.selectContentList[index].label}信息吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.diagnosisInfoList.push(this.selectContentList[index]);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    reBack() {
      this.$router.push('./../report');
    },
    resetSaveForm() { // 重置表单
      this.$refs.saveForm.resetFields();
      this.saveForm = {
        type:'通用'
      };
    },
    cancelsaveDialog() {
      //this.resetSaveForm();
      this.saveDialog = false;
    },
    submitsaveDialog() {
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          if (this.reportId !== "") {
            let params = {
              logo: this.logoImgList.length === 0?'':this.logoImgList[0].url,
              type: this.saveForm.type,
              template_name: this.saveForm.template_name,
              key_words_list: {
                report: this.report,
                baseInfoList: this.baseInfoList,
                diagnosisInfoList: this.diagnosisInfoList,
                pathologothImgList: this.pathologothImgList,
              },
              template_html: this.$refs.reportModel.innerHTML
            }
            editService.updateReport(this.reportId, params).then((res) => {
              this.$message.success('模版编辑成功');
              this.resetSaveForm();
              this.saveDialog = false;
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });
          } else {
            let params = {
              logo: this.logoImgList.length === 0?'':this.logoImgList[0].url,
              type: this.saveForm.type,
              template_name: this.saveForm.template_name,
              key_words_list: {
                report: this.report,
                baseInfoList: this.baseInfoList,
                diagnosisInfoList: this.diagnosisInfoList,
                pathologothImgList: this.pathologothImgList,
              },
              template_html: this.$refs.reportModel.innerHTML
            }
            editService.setReport(params).then((res) => {
              this.$message.success('模版保存成功');
              //this.resetSaveForm();
              this.saveDialog = false;
            }).catch((err) => {
              this.$message.error('模版保存失败');
            })
          }
        } else {
          return false;
        }
      });
    },
    handleRemove() {
      this.logoImgList = [];
    },
    uploadImgSuccessfunction(response, file, fileList) {
      this.logoImgList = [{name:fileList[0].name, url:response.data.path}];
    },
  }
}
