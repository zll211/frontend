import {registerService} from './register.service';
import {inspectionService} from "../../dictionary/base/inspection.service";
import {specimenTemplateService} from "../../dictionary/specimen/specimen.service";
import {userService} from "../../system/users/users.service";
import {messageBoxService} from '../../../../common/service/message.service';
import pisStar from "../../../../common/components/pisStar";
import {collectService} from "../../desk/collect/collect.service";
import {mapState} from "vuex";
import pisPagination from "../../../../common/components/pisPagination";
import {formatDateTime, formatDate, debounce} from "@/config/utils";
import {timeoutService} from "../../dictionary/timeout/timeout.service";

export default {
  components: {
    pisStar,
    pisPagination
  },
  data() {
    const validatePass = (rule, value, callback) => {  // 表单数字验证规则
      if (/^[0-9]*$/.test(value) || !value) {
        callback();
      } else {
        callback(new Error('电话号码必须是数字值。'));
      }
    }
    return {
      loading: false,
      formLoading: false,
      isCollect: false,
      registerInfoFull: false,
      sendInfoFull: false,
      specimenInfoFull: false,
      pisPagination: {},
      fullRegister: false,
      sameNameDialog: false,
      sameNameTableloading: false,
      receiptDialog: false,
      rejectDialog: false,
      specimenIndex: '',
      rejectReason: '',
      printPdf: '',
      receiptForm: {
        receipt_date: formatDate(new Date()),
        receipt_add: '病理科',
        printer: '',
      },
      timeoutForm: {
        small_specimen_timeout: 0,
        big_specimen_timeout: 0,
        cell_timeout: 0,
        frozen_timeout: 0,
        block_timeout: 0,
        slide_timeout: 0,
        small_specimen_timeout_unit: '',
        big_specimen_timeout_unit: '',
        routine_timeout_unit: '',
        cell_timeout_unit: '',
        frozen_timeout_unit: '',
        block_timeout_unit: '',
        slide_timeout_unit: '',
      },
      multipleSelection: [],
      sameNameId: [],
      sameNameTableData: [],
      fromHis: '',
      treatTypeList: ['门诊', '住院'],
      screenWidth: document.body.clientWidth,
      outside_register_type: '',
      registerFormRadio: '本院',
      registerTypeTab: '常规',
      paraffinBlockList: [{}],
      paraffinSectionList: [{}],
      registerTable: [],
      registerSearchInput: '',
      changeTop: '0px',
      specimenNormalItems: [{dict_specimen_id: []}],
      specimenCellItems: [],
      defaultValueShow: '',
      tabIndex: '',
      pathology_id: '',
      cellSpecimenList: [],
      cellNameBySpecimenList: [],
      pageState: 'add',
      isPrint: false,
      userList: [],
      specimen_name: '',
      registerForm: {
        id: '',
        age_unit: '岁',
        treat_type: '门诊',
        specimen: [],
        ext: {},
        case_type: '常规',
        receive_at: formatDateTime(new Date()),
        and_routine: true
      },
      hospitalList: [],
      departmentList: [],
      doctorList: [],
      normalSpecimenNameList: [],
      specimenName: {},
      rules: {
        id: [
          {required: true, message: '请输入病理号', trigger: 'blur'},
        ],
        patient_name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {type: 'number', message: '年龄必须为数字值', trigger: 'blur'}
        ],
        phone: [
          {required: false, validator: validatePass, trigger: 'blur'},
        ],
        gender: [
          {required: true, message: '请选择性别'},
        ],
        inspection_hospital: [
          {required: true, message: '请选择送检医院'},
        ],
        specimen_type: [
          {required: true, message: '请选择标本类型'},
        ],
        cell_specimen_type: [
          {required: true, message: '请选择标本类型'},
        ],
        inspection_date: [
          {required: true, message: '请选择送检时间', trigger: 'blur'},
        ],
        receive_at: [
          {required: true, message: '请选择标本接收时间', trigger: 'blur'},
        ],
        receive_doctor: [
          {required: true, message: '请选择标本接收员', trigger: 'blur'},
        ],
        case_type: [
          {required: true, message: '请选择病理分类'}
        ]
      },
      nationOptions: ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
        "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
        "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
        "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"],
      watchTime: undefined,
    }
  },
  computed: {
    ...mapState(['user', 'area']),
  },
  watch: {
    dict_specimen_id() {
      this.specimen_name = document.querySelector('.origin-cascader').textContent.replace(/ /g, '')
    },
    registerTypeTab() {
      this.getCaseNumber();
    },
    fullRegister() {
      if (this.fullRegister) {
        this.registerInfoFull = true;
        this.sendInfoFull = true;
        this.specimenInfoFull = true;
      } else {
        this.registerInfoFull = false;
        this.sendInfoFull = false;
        this.specimenInfoFull = false;
      }
    },
    registerForm() {
      if (this.registerForm.id === '') {
        this.getCaseNumber();
      }
      if (this.registerForm.specimen_type !== '' && this.registerTypeTab === '细胞') {
        for (let i = 0; i < this.cellSpecimenList.length; i++) {
          if (this.cellSpecimenList[i].label === this.registerForm.specimen_type) {
            this.cellNameBySpecimenList = this.cellSpecimenList[i].children;
          }
        }
      }
    }
  },
  created() {
    this.getCaseNumber();
    this.getTable();
    this.inspectionList();
    this.cellTemplateList();
    this.specimenTemplateList();
    this.getUsers();
    this.getUserInfo();
  },
  mounted() {
    this.$watch('registerSearchInput', debounce(() => {
      this.getTable();
    }, 1000));
    this.$root.$on('manage-scroll', (e) => {
      this.changeTop = `${e}px`;
    })
    this.$root.$on('size-change', this.resize);
  },
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo() {
      userService.userInfo(window.sessionStorage.getItem('userId')).then((res) => {
        this.registerForm.receive_doctor = res.body.data.realname;
        this.receiptForm.printer = res.body.data.realname;
      });
    },
    /**
     * 病人姓名input框失去焦点时搜索同名病例
     */
    patientNameBlur() {
      console.log(this.registerForm.patient_name);
      if (this.registerForm.patient_name) {
        let params = {
          name: this.registerForm.patient_name
        };
        registerService.getSameNameList(params).then((res) => {
          if (res.body.data.length !== 0) {
            this.$notify({
              title: '同名提示',
              message: '有同名病人，点击同名按钮可查看详情并选择绑定历史病例',
              position: 'top-left'
            });
          } else {
            return false;
          }
        })
      }
    },
    /**
     * 屏幕缩放事件
     */
    resize() {
      this.screenWidth = document.body.clientWidth;
    },
    /**
     * 切换病理类型事件
     * @param tab 标本类型名称
     */
    registerTabClick(tab) {
      this.pathology_id = '';
      this.specimenCellItems = [];
      this.specimenNormalItems = [];
      this.pageState = 'add';
      this.resetForm('registerForm');
      if (tab.name === '常规' || tab.name === '冰冻' || tab.name === '细胞') {
        this.registerForm.case_type = tab.name;
      } else {
        this.registerForm.case_type = '常规';
      }
      if (tab.name === '标本' || tab.name === '玻片' || tab.name === '蜡块') {
        this.outside_register_type = tab.name;
      }
      this.getTable();
    },
    /**
     * 标本input框点击事件
     * @param index
     * @param e
     */
    cascaderClick(index, e) {
      document.querySelectorAll('.specimen-name-cascader')[index].click();
      e.target.focus();
    },
    /**
     * 添加常规标本事件
     */
    addSpecimenNormal() {
      this.specimenNormalItems.push({dict_specimen_id: []});
    },
    /**
     * 常规标本复制功能
     * @param index
     */
    copyNormalSpecimen(index) {
      this.specimenNormalItems.push({
        part: this.specimenNormalItems[index].part,
        remark: this.specimenNormalItems[index].remark,
        dict_specimen_id: this.specimenNormalItems[index].dict_specimen_id,
        specimen_name: this.specimenNormalItems[index].specimen_name
      });
    },
    /**
     * 常规标本删除
     * @param index
     */
    delNormalSpecimen(index) {
      this.specimenNormalItems.splice(index, 1);
    },
    /**
     * 添加细胞标本事件
     */
    addSpecimenCell() {
      this.specimenCellItems.push({specimen_name: "", remark: ""});
    },
    /**
     * 细胞标本删除
     * @param index
     */
    delCellSpecimen(index) {
      this.specimenCellItems.splice(index, 1);
    },
    /**
     * 提交表单
     * @param formName 表单ref名称
     */
    submitForm(formName) {
      if (this.registerTypeTab === '细胞') {
        if (this.specimenCellItems.length === 0) {
          this.$message.warning('请录入至少一条标本信息');
          return false;
        }
      } else if (this.registerTypeTab === '常规' || this.registerTypeTab === '冰冻') {
        if (this.specimenNormalItems.length === 0 || (this.specimenNormalItems[0].dict_specimen_id.length === 0 && !this.specimenNormalItems[0].specimen_name)) {
          this.$message.warning('请录入至少一条标本信息');
          return false;
        }
      } else if (this.registerTypeTab === '标本') {
        if (this.registerForm.case_type === '常规') {
          if (this.specimenNormalItems.length === 0 || (this.specimenNormalItems[0].dict_specimen_id.length === 0 && !this.specimenNormalItems[0].specimen_name)) {
            this.$message.warning('请录入至少一条标本信息');
            return false;
          }
        } else {
          if (this.specimenCellItems.length === 0) {
            this.$message.warning('请录入至少一条标本信息');
            return false;
          }
        }
      } else if (this.registerTypeTab === '玻片') {
        if (this.paraffinSectionList.length === 0) {
          this.$message.warning('请至少录入一条玻片信息');
          return false;
        }
      } else if (this.registerTypeTab === '蜡块') {
        if (this.paraffinBlockList.length === 0) {
          this.$message.warning('请至少录入一条蜡块信息');
          return false;
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pageState === 'add') {
            this.submitRegisterForm();
          } else if (this.pageState === 'edit') {
            this.editRegisterForm();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 重置表单
     * @param formName 表单ref名称
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this[formName] = {
        id: '',
        age_unit: '岁',
        specimen: [],
        ext: {},
        treat_type: this.registerFormRadio === '本院' ? '门诊' : '外院',
        case_type: this.registerFormRadio === '本院' ? this.registerTypeTab : '常规',
        receive_at: formatDateTime(new Date()),
        and_routine: true
      };
      this.specimenNormalItems = [{dict_specimen_id: []}];
      this.specimenCellItems = [];
      this.paraffinSectionList = [{}];
      this.paraffinBlockList = [{}];
      this.registerForm.receive_doctor = this.user.realname;
      this.sameNameId = [];
    },
    /**
     * 获取登记列表
     * @param page 页码
     */
    getTable(page = 1) {
      let params = {
        treat_type: !this.outside_register_type ? [...this.treatTypeList, '默认'] : '外院',
        case_type: !this.outside_register_type ? this.registerTypeTab : undefined,
        page: page,
        page_size: 10,
        search: this.registerSearchInput ? this.registerSearchInput : undefined,
        outside_register_type: this.outside_register_type ? this.outside_register_type : undefined,
      };
      if (this.registerTypeTab === '常规' || this.registerTypeTab === '冰冻') {
        params.status = '未取材';
      } else if (this.registerTypeTab === '细胞') {
        params.status = '未制片';
      } else {
        params.status = undefined;
      }
      this.loading = true;
      registerService.getRegisterTable(params).then((res) => {
        if (params.case_type !== this.registerTypeTab && params.outside_register_type !== this.registerTypeTab) return;
        this.registerTable = res.body.data;
        this.pisPagination = res.body.meta.pagination;
      }).catch((error) => {

      }).finally(() => {
        this.loading = false;
      })
    },
    /**
     * 获取病理信息
     * @param id 病理号
     */
    getInfo(id) {
      this.formLoading = true;
      registerService.registerInfo(id).then((res) => {
        this.isCollect = res.body.data.has_collection;
        if (res.body.data.same_name_id) {
          this.sameNameId = res.body.data.same_name_id;
        }
        delete res.body.data.same_name_id;
        delete res.body.data.has_collection;
        delete res.body.data.draw_material;
        if(res.body.data.origin === null) delete res.body.data?.origin;
        this.registerForm = res.body.data;
        this.registerForm.ext = res.body.data.ext.data;
        this.pathology_id = res.body.data.id;
        if (this.registerTypeTab === '常规' || this.registerTypeTab === '冰冻') {
          this.specimenNormalItems = res.body.data.specimen.data;
        } else {
          this.specimenCellItems = res.body.data.specimen.data;
        }
        if (this.registerTypeTab === '标本') {
          if (res.body.data.case_type === '常规') {
            this.specimenNormalItems = res.body.data.specimen.data;
          } else {
            this.specimenCellItems = res.body.data.specimen.data;
          }
        }
        if (this.registerTypeTab === '蜡块') {
          this.paraffinBlockList = res.body.data.paraffinBlock.data;
        }
        if (this.registerTypeTab === '玻片') {
          this.paraffinSectionList = res.body.data.paraffinSection.data;
        }
        this.pageState = 'edit';
      }).catch((error) => {

      }).finally((e) => {
        this.formLoading = false;
      })
    },
    /**
     * 格式化送检数据
     * @hospital 送检医院
     * @department 送检科室
     * @doctor 送检医生
     */
    inspectionList(array = ['hospital', 'department', 'doctor']) {
      array.forEach((type) => {
        inspectionService.inspectionList(type)
          .then((res) => {
            this[`${type}List`] = res.body.data.map((item) => {
              return {
                id: item.id,
                name: item[`inspection_${type}_name`],
              }
            });
          }).catch(() => {

        });
      });
    },
    /**
     * 格式化表单提交数据
     * @param params
     */
    formatterParams(params = {}) {
      params = Object.assign(params, this.registerForm);
      if (this.registerTypeTab === '常规' || this.registerTypeTab === '冰冻') {
        params.specimen = this.specimenNormalItems;
        params.specimen_num = params.specimen.length;
      } else if (this.registerTypeTab === '细胞') {
        params.specimen = this.specimenCellItems;
        params.specimen_num = params.specimen.length;
      } else if (this.registerTypeTab === '标本') {
        if (this.registerForm.case_type === '常规') {
          params.outside_register_type = '标本';
          params.specimen = this.specimenNormalItems;
          params.specimen_num = params.specimen.length;
        } else {
          params.outside_register_type = '标本';
          params.specimen = this.specimenCellItems;
          params.specimen_num = params.specimen.length;
        }
      } else if (this.registerTypeTab === '玻片') {
        params.outside_register_type = '玻片';
        params.paraffinSection = this.paraffinSectionList;
      } else if (this.registerTypeTab === '蜡块') {
        params.outside_register_type = '蜡块';
        params.paraffinBlock = this.paraffinBlockList;
      }
      if (this.sameNameId.length !== 0) {
        params.same_name_id = this.sameNameId;
      }
      return params;
    },
    /**
     * 提交登记表单
     */
    submitRegisterForm() {
      registerService.submitRegisterForm(this.formatterParams()).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      }).catch((error) => {
        if (error.body.errors.id) {
          this.$message.error(error.body.errors.id[0]);
        } else {
          this.$message.error('未知错误');
        }
      }).finally(() => {
        if (!this.isPrint) {
          this.getTable();
          this.resetForm('registerForm');
        } else {
          this.receiptDialog = true;
        }
      });
    },
    /**
     * 修改登记表单
     */
    editRegisterForm() {
      registerService.editInfo(this.registerForm.id, this.formatterParams()).then((res) => {
        this.pageState = 'add';
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      }).catch((error) => {
      }).finally(() => {

      });
    },
    /**
     * 登记信息删除
     */
    deleteRegister() {
      messageBoxService.delete('是否删除该条记录?', '删除后不可恢复')
        .then(() => {
          registerService.delRegister(this.pathology_id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.resetForm('registerForm');
            this.pageState = 'add';
            this.getTable();
          }).catch((error) => {
          })
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 获取细胞标本类型
     */
    cellTemplateList() {
      specimenTemplateService.cellSpecimenTemplateList().then((res) => {
        this.cellSpecimenList = this.resetArray(res.body.data);
      })
    },
    /**
     * 细胞类型切换
     * @param value 细胞类型名称
     */
    cellSpecimenNameChange(value) {
      this.specimenCellItems = [{}];
      for (let i = 0; i < this.cellSpecimenList.length; i++) {
        if (this.cellSpecimenList[i].label === value) {
          this.cellNameBySpecimenList = this.cellSpecimenList[i].children;
        }
      }
    },
    /**
     * 常规标本名称列表
     */
    specimenTemplateList() {
      specimenTemplateService.specimenTemplateList()
        .then((res) => {
          this.resetArray(res.body.data).forEach((item) => {
            if (item.children) {
              this.normalSpecimenNameList.push({
                value: item.id,
                label: item.label,
                children: item.children ? item.children.map((item) => ({
                  value: item.id,
                  label: item.label,
                  children: item.children ? item.children.map((item) => ({
                    value: item.id,
                    label: item.label,
                  })) : [],
                })) : [],
              });
            }
          });
        })
    },
    /**
     * 数组格式化
     * @param template
     * @param level
     * @returns {*}
     */
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            label: item.dict_specimen_name,
            children: this.resetArray(item.children, level + 1),
            dictGiganticInspection: item.dict_gigantic_inspection,
            level: level,
          }
        } else {
          return {
            id: item.id,
            label: item.dict_specimen_name,
            dictGiganticInspection: item.dict_gigantic_inspection,
            level: level,
          }
        }
      });
    },
    /**
     * 表格搜索按钮事件
     */
    searchRegisterTable() {
      this.getTable();
    },
    /**
     * 获取用户
     */
    getUsers() {
      userService.userList().then((res) => {
        this.userList = res.body.data;
      });
    },
    /**
     * 标本名称级联选择change事件
     * @param index
     * @param e
     */
    cascarderChange(index, e) {
      let cascaderInputStr = '';
      for (let i = 0; i < this.normalSpecimenNameList.length; i++) {
        if (this.normalSpecimenNameList[i].value === e[0]) {
          cascaderInputStr += this.normalSpecimenNameList[i].label;
          for (let j = 0; j < this.normalSpecimenNameList[i].children.length; j++) {
            if (this.normalSpecimenNameList[i].children[j].value === e[1]) {
              cascaderInputStr += '/' + this.normalSpecimenNameList[i].children[j].label;
              for (let k = 0; k < this.normalSpecimenNameList[i].children[j].children.length; k++) {
                if (this.normalSpecimenNameList[i].children[j].children[k].value === e[2]) {
                  cascaderInputStr += '/' + this.normalSpecimenNameList[i].children[j].children[k].label;
                  this.specimenNormalItems[index].specimen_name = cascaderInputStr;
                }
              }
            }
          }
        }
      }
    },
    /**
     * 获取病理号
     * prefix 规定的病理类型
     */
    getCaseNumber() {
      let prefix = '';
      if (this.registerTypeTab === '常规') prefix = 'routine';
      if (this.registerTypeTab === '冰冻') prefix = 'frozen';
      if (this.registerTypeTab === '细胞') prefix = 'cell';
      if (this.registerTypeTab === '标本') prefix = 'specimen';
      if (this.registerTypeTab === '蜡块') prefix = 'block';
      if (this.registerTypeTab === '玻片') prefix = 'slide';
      registerService.getCaseNo(prefix).then((res) => {
        let tab = '';
        if (prefix === 'routine') tab = '常规';
        if (prefix === 'frozen') tab = '冰冻';
        if (prefix === 'cell') tab = '细胞';
        if (prefix === 'specimen') tab = '标本';
        if (prefix === 'block') tab = '蜡块';
        if (prefix === 'slide') tab = '玻片';
        if (tab !== this.registerTypeTab) return;
        this.registerForm.id = res.body.data;
      })
    },
    /**
     * 刷新病理号
     */
    refreshCaseNo() {
      this.getCaseNumber();
    },
    /**
     * 收藏病例
     */
    doCollect() {
      let id = this.pathology_id;
      collectService.addCollect(id).then((res) => {
        this.isCollect = true;
        this.$message.success('收藏成功。');
      })
    },
    /**
     * 取消收藏病例
     */
    cancelCollect() {
      let id = this.pathology_id;
      collectService.cancelCollect({case_id: id}).then((res) => {
        this.isCollect = false;
        this.$message({
          type: 'success',
          message: '取消收藏成功!'
        });
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: '取消失败!'
        });
      })
    },
    /**
     * 本院和外院change事件
     * @param val 本院/外院
     */
    registerFormRadioChange(val) {
      if (val === '外院') {
        this.registerTypeTab = '标本';
        this.outside_register_type = '标本';
      } else {
        this.registerTypeTab = '常规';
        this.outside_register_type = '';
      }
      ;
      this.getTable();
      this.resetForm('registerForm');
    },
    /**
     * 外院增加蜡块
     */
    addParaffinBlock() {
      this.paraffinBlockList.push({});
    },
    /**
     * 外院删除蜡块
     * @param index 数组下角标
     */
    delParaffinBlock(index) {
      this.paraffinBlockList.splice(index, 1);
    },
    /**
     * 外院增加切片
     */
    addParaffinSection() {
      this.paraffinSectionList.push({});
    },
    /**
     * 外院删除切片
     * @param index 数组下角标
     */
    delParaffinSection(index) {
      this.paraffinSectionList.splice(index, 1);
    },
    /**
     * 表格下一页
     * @param val 页码数
     */
    pisNextPage(val) {
      this.getTable(val);
    },
    /**
     * 表格上一页
     * @param val 页码数
     */
    pisPrePage(val) {
      this.getTable(val);
    },
    /**
     * his导入
     */
    infoFromHis() {

    },
    /**
     * 同名搜索
     */
    sameNameSearch() {
      if (this.registerForm.patient_name) {
        let params = {
          name: this.registerForm.patient_name
        };
        registerService.getSameNameList(params).then((res) => {
          if (res.body.data.length !== 0) {
            if (this.pageState === 'add') {
              this.sameNameDialog = true;
              this.sameNameTableData = res.body.data;
            } else {
              this.sameNameTableData = res.body.data.filter((item) => item.id !== this.registerForm.id);
              if (this.sameNameTableData.length === 0) {
                this.$message.info('没有搜索到同名病人。');
                return;
              }
              this.sameNameDialog = true;
              let sameNameId = this.sameNameId;
              let rows = [];
              if (sameNameId.length !== 0) {
                for (let i = 0; i < sameNameId.length; i++) {
                  let row = this.sameNameTableData.find((item) => {
                    return item.id === sameNameId[i];
                  });
                  rows.push(row);
                }
                setTimeout(() => {
                  rows.forEach(row => {
                    this.$refs.sameNameTable.toggleRowSelection(row);
                  });
                }, 0)
              }
            }
          } else {
            this.$message.info('没有搜索到同名病人。')
          }
        }).catch((err) => {

        }).finally((e) => {

        })
      }
    },

    /**
     * 绑定历史检查病例
     */
    bindHistoryPathology() {
      if (this.$refs.sameNameTable.selection.length === 0) {
        this.$message.warning('请选择需要绑定的病例。')
      } else {
        let idArr = [];
        for (let i = 0; i < this.$refs.sameNameTable.selection.length; i++) {
          idArr.push(this.$refs.sameNameTable.selection[i].id);
        }
        this.sameNameId = idArr;
        this.sameNameDialog = false;
      }
    },
    /**
     * 同名病例列表点击事件
     * @param row 选中的行
     */
    sameNameTableRowClick(row) {
      this.$refs.sameNameTable.toggleRowSelection(row);
    },
    /**
     * 打印回执单
     */
    receiptPrint() {
      this.calculateReceiptDate();
      this.isPrint = true;
      if (this.pageState === 'add') {
        this.submitForm('registerForm');
      } else {
        if (!this.isPrint) {
          this.getTable();
          this.resetForm('registerForm');
        } else {
          this.receiptDialog = true;
        }
      }
    },
    /**
     * 同名病例dialog取消按钮
     */
    cancelSameNameDialog() {
      this.sameNameDialog = false;
    },
    /**
     * 打印回执单dialog打印按钮
     */
    receiptPrintBtn() {
      let params = {
        id: this.registerForm.id,
        receiptDate: this.receiptForm.receipt_date,
        receiptAdd: this.receiptForm.receipt_add,
        receiptPrinter: this.receiptForm.printer,
      }
      registerService.receiptPrint(params).then((res) => {
        this.printPdf = URL.createObjectURL(res.data);
      }).catch((err) => {

      }).finally(() => {
        this.$el.getElementsByClassName('printIfr')[0].onload = () => {
          setTimeout(() => {
            this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
          }, 100);
        }
        this.receiptDialog = false;
      })
    },
    /**
     * 打印回执单dialog取消按钮
     */
    cancelReceiptDialog() {
      this.receiptDialog = false;
      this.resetForm('registerForm');
      this.isPrint = false;
    },
    /**
     * 计算取报告时间
     */
    calculateReceiptDate() {
      timeoutService.timeoutList({settings_key: Object.keys(this.timeoutForm)}).then((res) => {
        for (let prop in res.body.data) {
          this.timeoutForm[prop] = parseInt(res.body.data[prop].split(' ')[0]);
          this.timeoutForm[prop + '_unit'] = res.body.data[prop].split(' ')[1];
        }
      }).finally(() => {
        let date = new Date();
        if (this.registerTypeTab === '常规') {
          if (this.registerForm.specimen_type === '小标本') {
            date.setDate(date.getDate() + this.timeoutForm.small_specimen_timeout);

            this.receiptForm.receipt_date = formatDate(date);
          } else {
            date.setDate(date.getDate() + this.timeoutForm.big_specimen_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          }
        } else if (this.registerTypeTab === '细胞') {
          if (this.timeoutForm.cell_timeout_unit === 'hours') {
            if (this.timeoutForm.cell_timeout > 24) {
              date.setDate(date.getDate() + Math.ceil(this.timeoutForm.cell_timeout / 24));
              this.receiptForm.receipt_date = formatDate(date);
            }
          } else if (this.timeoutForm.cell_timeout_unit === 'days') {
            date.setDate(date.getDate() + this.timeoutForm.cell_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          }
        } else if (this.registerTypeTab === '标本') {
          if (this.registerForm.specimen_type === '小标本') {
            date.setDate(date.getDate() + this.timeoutForm.small_specimen_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          } else {
            date.setDate(date.getDate() + this.timeoutForm.big_specimen_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          }
        } else if (this.registerTypeTab === '蜡块') {
          if (this.timeoutForm.block_timeout_unit === 'hours') {
            if (this.timeoutForm.block_timeout > 24) {
              date.setDate(date.getDate() + Math.ceil(this.timeoutForm.block_timeout / 24));
              this.receiptForm.receipt_date = formatDate(date);
            }
          } else if (this.timeoutForm.block_timeout_unit === 'days') {
            date.setDate(date.getDate() + this.timeoutForm.block_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          }
        } else if (this.registerTypeTab === '玻片') {
          if (this.timeoutForm.slide_timeout_unit === 'hours') {
            if (this.timeoutForm.slidetimeout > 24) {
              date.setDate(date.getDate() + Math.ceil(this.timeoutForm.slide_timeout / 24));
              this.receiptForm.receipt_date = formatDate(date);
            }
          } else if (this.timeoutForm.slide_timeout_unit === 'days') {
            date.setDate(date.getDate() + this.timeoutForm.slide_timeout);
            this.receiptForm.receipt_date = formatDate(date);
          }
        }
      })
    },
    /**
     * 拒收标本
     */
    rejectNormalSpecimen(index) {
      this.rejectDialog = true;
      this.specimenIndex = index;
    },
    /**
     * 拒收原因dialog确定按钮
     */
    confirmRejectBtn() {
      if (this.registerTypeTab === '细胞') {
        if (this.rejectReason) {
          this.specimenCellItems[this.specimenIndex].rejection_reason = this.rejectReason;
          this.specimenCellItems[this.specimenIndex].status = '不合格';
        } else {
          this.$message.warning('请输入拒收原因');
          return false;
        }
      } else {
        if (this.rejectReason) {
          this.specimenNormalItems[this.specimenIndex].rejection_reason = this.rejectReason;
          this.specimenNormalItems[this.specimenIndex].status = '不合格';
        } else {
          this.$message.warning('请输入拒收原因');
          return false;
        }
      }
      this.rejectReason = '';
      this.rejectDialog = false;
    },
    /**
     * 拒收原因dialog取消按钮
     */
    cancelRejectBtn() {
      this.rejectReason = '';
      this.rejectDialog = false;
    },
    /**
     * 撤销拒收标本
     */
    cancalRejectNormalSpecimen(index) {
      this.$confirm('确定要撤销拒收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.registerTypeTab === '细胞') {
          this.specimenCellItems[index].rejection_reason = '';
          this.specimenCellItems[index].status = '已取材';
        } else {
          this.specimenNormalItems[index].rejection_reason = '';
          this.specimenNormalItems[index].status = '未取材';
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
  },
  beforeDestroy() {
    this.$root.$off('manage-scroll');
    this.$root.$off('size-change');
  },
};
