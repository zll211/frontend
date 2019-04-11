
import {userService} from "../../system/users/users.service";
import {takeSpecimenService} from "./takespecimen.service";
import {areaArrToString} from "@/config/utils";
import pisTemplate from '../../../../common/components/pisTemplate'
import {mapState} from "vuex";
import pisPagination from "../../../../common/components/pisPagination";
import { formatDateTime, formatDate, debounce } from "@/config/utils";
export default {
  components: {
    pisTemplate,
    pisPagination
  },
  data() {
    return {
      loading: false,
      pageLoading: false,
      frozenResultDialog: false,
      frozenResultFormLoading: false,
      frozenResultForm: {},
      imgSrc: '',
      haveVideo: true,
      infoList: {},
      pisPagination: {},
      templateList: [],
      takeSpecimenTable: [],
      textareaDisabled: false,
      takespecimenForm: {},
      templateForm: {},
      activeTakespecimenName: '标本1',
      screenWidth: document.body.clientWidth,
      changeTop: '0px',
      imgList: [],
      userList: [],
      tableStatus: '未取材',
      caseType: '',
      takespecimenSearchInput: '',
      activeName: '未取材',
      moreInfoShow: false,
      dialogImageUrl: '',
      dialogVisible: false,
      checkModelVisible: false,
      choseModelNum: '',
      modelChecked: [],
      modelList: [],
      idFormQrcode: '',
      uploadImgHeader: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
      takespecimenrules: {
        draw_materialer: [
          {required: true, message: '请选择取材医生', trigger: 'blur'},
        ],
        draw_material_at: [
          {required: true, message: '请选择取材时间'},
        ],
      },
      isPrint: false,
      printPdf: '',
    }
  },
  props: ['id'],
  computed: mapState(['area']),
  watch: {
    id: function (id, oldvalue) {
      this.getInfo(id);
      this.imgList = [];
      if (this.tableStatus !== '重补取') {
        this.$refs.uploadImg.clearFiles();
      }
    },
    tableStatus() {
      if (this.tableStatus === '重补取') {
        this.textareaDisabled = true;
      }
    },
    idFormQrcode: function () {
      if (this.idFormQrcode) {
        setTimeout(this.getInfo(this.idFormQrcode), 200);
      }
    },
  },
  async created() {
    await this.getStatus();
    this.getUsers();
    this.getInfo(this.id);
    this.getVideo();
  },
  mounted() {
    this.$root.$on('manage-scroll', (e) => {
      this.changeTop = `${e}px`;
    })
    this.$root.$on('size-change', this.resize);
    this.$watch('takespecimenSearchInput', debounce(() => {
      this.getTable();
    }, 1000));
  },
  methods: {
    resize() {
      this.screenWidth = document.body.clientWidth;
    },
    async getStatus() {
      this.pageLoading = true;
      return takeSpecimenService.registerInfo(this.id).then((res) => {
        return this.tableStatus = res.body.data.draw_status;
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleClick(tab, event) {
      this.isReset = true;
      if (tab.index === '0') {
        this.tableStatus = "未取材";
        this.textareaDisabled = false;
      }
      if (tab.index === '1') {
        this.tableStatus = "重补取";
        this.textareaDisabled = true;
      }
      if (tab.index === '2') {
        this.tableStatus = "已取材";
        this.textareaDisabled = false;
      }
      if (tab.index === '3') {
        this.tableStatus = ["未取材", "重补取", "已取材"];
        this.textareaDisabled = false;
      }
      await this.getTable();
      if (this.takeSpecimenTable[0]) {
        this.$router.replace({path: `/specimen/takespecimen/${this.takeSpecimenTable[0].id}`});
      }
    },
    handleRemove(file, fileList) {
      this.imgList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    addParaffin(index) { // 增加蜡块
      if (this.templateList[index].specimenNumber === undefined || this.templateList[index].specimenNumber === null || this.templateList[index].specimenNumber === '') {
        this.templateList[index].specimenNumber = 1;
      }
      for (let i = 0; i < this.templateList[index].specimenNumber; i++) {
        this.templateList[index].paraffinList.push(
          {
            specimenName: this.templateList[index].specimen_name,
            specimenPart: this.templateList[index].specimen_part === null ? this.templateList[index].specimen_name.match(/\/(.*)\//)[1] : this.templateList[index].specimen_part + ' - ' + this.templateList[index].specimen_name.match(/\/(.*)\//)[1],
            paraffinNum: '1',
            backup: '',
            specimen_id: this.templateList[index].specimen_id,
          })
      }
    },
    handleClose(done) {  //模板右上角关闭
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },

    confirmCheckModel(info) {  //模板确定按钮事件
      this.templateList[this.choseModelNum].gigantic_inspection = info;
    },

    choseModel(index) { // 点击选择模板
      this.$forceUpdate();
      this.modelChecked = [];
      this.modelList = [];
      this.choseModelNum = index;
      let modelList = [];
      for (let i = 0; i < this.templateList[index].dictGiganticInspection.length; i++) {
        modelList.push(this.templateList[index].dictGiganticInspection[i].gigantic_inspection_info)
      }
      this.modelList = modelList;
      this.checkModelVisible = true;
    },

    delParaffin(index, key) { //删除添加的蜡块
      this.templateList[index].paraffinList.splice(key, 1);
    },
    resetForm() {
      this.$refs.takespecimenForm.resetFields();
      this.takespecimenForm = {
        draw_material_at: formatDateTime(new Date()),
      }
    },
    getInfo(id) {
      this.pageLoading = true;
      takeSpecimenService.registerInfo(id).then((res) => {
        if (res.body.data.draw_status === '重补取') {
          this.caseType = res.body.data.case_type;
          this.tableStatus = res.body.data.draw_status;
          this.activeName = res.body.data.draw_status;
          this.infoList = res.body.data;
          if (this.infoList.origin) {
            this.infoList.origin = areaArrToString(this.infoList.origin, this.area);
          }
          // debugger
          this.templateList = res.body.data.specimen.data.map((item) => {
            if (item.status === '重补取') {
              return {
                specimen_name: item.specimen_name,
                specimen_part: item.part,
                specimen_id: item.id,
                gigantic_inspection: item.gigantic_inspection ? item.gigantic_inspection : '',
                postscript: item.postscript ? item.postscript : '',
                position: item.position ? item.position : '',
                paraffinList: [{
                  specimenName: item.specimen_name,
                  specimenPart: item.part === null ? item.specimen_name.match(/\/(.*)\//)[1] : item.part + ' - ' + item.specimen_name.match(/\/(.*)\//)[1],
                  paraffinNum: '1',
                }],
                dictGiganticInspection: item.dictGiganticInspection.data,
              }
            }else{
              return undefined;
            }
          })
          this.templateList = this.templateList.filter((item) => {
            return item !== undefined;
          })
          this.getTable();
        } else {
          this.caseType = res.body.data.case_type;
          this.tableStatus = res.body.data.draw_status;
          this.activeName = res.body.data.draw_status;
          this.infoList = res.body.data;
          if (this.infoList.origin) {
            this.infoList.origin = areaArrToString(this.infoList.origin, this.area);
          }
          if (!res.body.data.draw_material.draw_material_at) {
            this.resetForm();
          } else {
            this.takespecimenForm = res.body.data.draw_material;
          }
          this.imgList = res.body.data.img.data.map((item) => {
            return {
              name: item.id,
              url: item.image_url,
            }
          });
          if(this.infoList.associate_pathology) {
            if(this.caseType === '常规') {
              this.$notify.info({
                title: '提示',
                message: '该病例做过冰冻病理，可以查看诊断结果。',
                duration: 5000,
              });
            }
          }
          this.templateList = res.body.data.specimen.data.map((item) => {
            return {
              specimen_name: item.specimen_name,
              specimen_part: item.part,
              specimen_id: item.id,
              gigantic_inspection: item.gigantic_inspection ? item.gigantic_inspection : '',
              postscript: item.postscript ? item.postscript : '',
              position: item.position ? item.position : '',
              paraffinList: item.paraffinBlock.data.length === 0 ? [{
                specimenName: item.specimen_name,
                specimenPart: item.part === null ? item.specimen_name.match(/\/(.*)\//)[1] : item.part + ' - ' + item.specimen_name.match(/\/(.*)\//)[1],
                paraffinNum: '1',
              }] : item.paraffinBlock.data.map((parafb) => {
                return {
                  specimenName: parafb.sample_name,
                  specimenPart: parafb.sample_source,
                  paraffinNum: parafb.sample_count,
                  backup: parafb.summary,
                  id: parafb.id,
                }
              }),
              dictGiganticInspection: item.dictGiganticInspection.data,
            }
          })
          this.getTable();
        }
      }).catch((err) => {
      }).finally((e) => {
        this.pageLoading = false;
        this.idFormQrcode = '';
      })
    },
    newInfo(id) {
      this.$router.replace({path: `/specimen/takespecimen/${id}`});
    },
    //获取医生列表
    getUsers() {
      userService.userList().then((res) => {
        this.userList = res.body.data;
      });
    },
    async getTable(page = 1) {
      this.loading = true;
      let params = {
        page: page,
        page_size: 10,
        case_type: this.caseType,
        draw_status: this.tableStatus,
        search: this.takespecimenSearchInput,
        outside_register_type: ['默认', '标本'],
      }
      return takeSpecimenService.getRegisterTable(params).then((res) => {
        this.pisPagination = res.body.meta.pagination;
        return this.takeSpecimenTable = res.body.data.map((item) => {
          return {
            id: item.id,
            case_type: item.case_type,
            treat_type: item.treat_type,
            patient_name: item.patient_name,
            gender: item.gender,
            inspection_hospital: item.inspection_hospital,
            inspection_department: item.inspection_department,
            inspection_doctor: item.inspection_doctor,
            inspection_date: item.inspection_date,
            draw_status: item.draw_status,
            specimen_num: item.specimen_num,
            age: item.age + item.age_unit,
          }
        });
      }).catch((err) => {
      }).finally((e) => {
        this.loading = false;
      })
    },
    uploadImgSuccessfunction(response, file, fileList) {
      this.imgList = fileList;
    },

    params(params = {}) {
      let draw_material = {}, img = [], specimen = [];
      for (let prop in this.takespecimenForm) {
        if (Object.prototype.hasOwnProperty.call(this.takespecimenForm, prop)) {
          draw_material[prop] = this.takespecimenForm[prop];
        }
      }
      let id = this.infoList.id;
      img = this.imgList.map((item) => item.response ? item.response.data.path : item.url);
      specimen = this.templateList.map((item) => {
        return {
          gigantic_inspection: item.gigantic_inspection,
          id: item.specimen_id,
          postscript: item.postscript,
          position: item.position,
          paraffin_block: item.paraffinList.map((para, index) => {
            return {
              serial_number: index + 1,
              sample_name: para.specimenName,
              sample_source: para.specimenPart,
              sample_count: para.paraffinNum,
              specimen_id: item.specimen_id,
              summary: para.backup,
              id: para.id,
            }
          })
        }
      });
      params = {id, draw_material, img, specimen};
      return params;
    },
    async saveInfo(formName) { // 保存并提交取材信息
      for (let i = 0; i < this.templateList.length; i++) {
        if (this.templateList[i].paraffinList.length === 0) {
          this.$message.warning(`每个标本请增加至少一条材块信息`);
          return false;
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pageLoading = true;
          takeSpecimenService.takeSpecimen({draw_status: '未取材', ...this.params()}).then((res) => {
            this.$message.success('保存成功');
            if(!this.isPrint){
              this.getTable().then((res) => {
                if (res.length > 0) {
                  this.$router.replace({path: `/specimen/takespecimen/${res[0].id}`});
                } else {
                  this.$message.success('所有标本都已经取材完成了。');
                  this.getInfo(this.id);
                  return false;
                }
              });
              this.imgList = [];
              this.$refs.uploadImg.clearFiles();
            }
          }).catch((error) => {
          }).finally(()=>{
            if(this.isPrint) {
              takeSpecimenService.orderPrint({id:this.infoList.id}).then((res) =>{
                this.printPdf = URL.createObjectURL(res.data);
                this.$el.getElementsByClassName('printIfr')[0].onload = () => {
                  setTimeout(() => {
                    this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
                  }, 100);
                }
              }).catch((err) =>{
              }).finally(()=>{
                this.getTable().then((res) => {
                  if (res.length > 0) {
                    this.$router.replace({path: `/specimen/takespecimen/${res[0].id}`});
                  } else {
                    this.$message.success('所有标本都已经取材完成了。');
                    this.getInfo(this.id);
                    return false;
                  }
                });
                this.imgList = [];
                this.$refs.uploadImg.clearFiles();
                this.isPrint = false;
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    saveEditInfo() {
      this.pageLoading = true;
      takeSpecimenService.takeSpecimen({draw_status: '已取材', ...this.params()}).then((res) => {
        this.$message.success('修改成功');
      }).catch((error) => {
      }).finally((e) => {
        this.pageLoading = false;
        if(this.isPrint) {
          takeSpecimenService.orderPrint({id:this.infoList.id}).then((res) =>{
            this.printPdf = URL.createObjectURL(res.data);
            this.$el.getElementsByClassName('printIfr')[0].onload = () => {
              setTimeout(() => {
                this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
              }, 100);
            }
          }).catch((err) =>{
          }).finally(()=>{
            this.isPrint = false;
          })
        }
      })
    },
    saveReCharge() { // 重补取
      //debugger
      this.pageLoading = true;
      let params = {};
      params.id = this.id;
      params.draw_status = '重补取';
      params.specimen = this.templateList.map((item) => {
        return {
          id: item.specimen_id,
          postscript: item.postscript,
          position: item.position,
          paraffin_block: item.paraffinList.map((para, index) => {
            return {
              serial_number: index + 1,
              sample_name: para.specimenName,
              sample_source: para.specimenPart,
              sample_count: para.paraffinNum,
              specimen_id: item.specimen_id,
              summary: para.backup,
              id: para.id,
            }
          })
        }
      });
      takeSpecimenService.takeSpecimen(params).then((res) => {
        this.$message.success('重补取成功');
        if(!this.isPrint) {
          this.getTable().then((res) => {
            if (res.length > 0) {
              this.$router.push({path: `/specimen/takespecimen/${res[0].id}`});
            } else {
              this.$message.success('所有标本都已经重补取完成了。');
              this.getInfo(this.id);
              return false;
            }
          });
        }
      }).catch((err) => {
      }).finally(() =>{
        if(this.isPrint) {
          takeSpecimenService.orderPrint({id:this.infoList.id}).then((res) =>{
            this.printPdf = URL.createObjectURL(res.data);
            this.$el.getElementsByClassName('printIfr')[0].onload = () => {
              setTimeout(() => {
                this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
              }, 100);
            }
          }).catch((err) =>{
          }).finally(()=>{
            this.getTable().then((res) => {
              if (res.length > 0) {
                this.$router.replace({path: `/specimen/takespecimen/${res[0].id}`});
              } else {
                this.$message.success('所有标本都已经取材完成了。');
                this.getInfo(this.id);
                return false;
              }
            });
            this.isPrint = false;
          })
        }
      })
    },
    takespecimenTableSearch() {
      this.getTable();
    },
    takespecimenHandleClick() {

    },
    pisNextPage(val) {
      this.getTable(val);
    },
    pisPrePage(val) {
      this.getTable(val);
    },

    getVideo() {
      navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        this.$refs.video.srcObject = stream;
      }).catch((err) => {
        this.haveVideo = false;
        this.$message('暂无视频源，请从本地上传取材照片。')
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
    screenShot() {
      if (this.haveVideo) {
        let canvas = this.$refs.canvas;
        let video = this.$refs.video;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        let imgFile = this.covertBase64UrlToFile(canvas.toDataURL('image/png'));
        this.httpRequest({file: imgFile});
      } else {
        this.$message.warning('暂无视频源，不可截图。')
      }
    },
    httpRequest({file}) {
      const formData = new FormData();
      formData.append('draw_material', file);
      takeSpecimenService.uploadImage(formData)
        .then((res) => {
          this.imgList.push({url: res.body.data.path});
        })
    },
    /**
     * 打印取材工作单
     */
    takeSpecimenPrint() {
      this.isPrint = true;
      if(this.tableStatus === "未取材") {
        this.saveInfo('takespecimenForm');
      }else if(this.tableStatus === "已取材"){
        this.saveEditInfo();
      }else if(this.tableStatus === "重补取"){
        this.saveReCharge();
      }
    },
    frozenResult() {
      this.frozenResultDialog = true;
      this.frozenResultFormLoading = true;
      takeSpecimenService.frozenResult({pathology_id:this.infoList.associate_pathology}).then((res)=>{
        if(res.body.data.report) {
          this.frozenResultForm = res.body.data.report;
        }
      }).finally(() => {
        this.frozenResultFormLoading = false;
      })
    },
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
  },
  beforeDestroy() {
    this.$root.$off('manage-scroll');
    this.$root.$off('size-change');
  },
};
