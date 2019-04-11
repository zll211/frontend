import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisTitle from '../../../../common/components/pisTitle';
import {storageService} from "./storage.service";
import {mapState} from 'vuex';
import { formatDateTime, formatDate } from "@/config/utils";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTitle
  },
  data() {
    return {
      loading: false,
      handleTabelLoading: false,
      addAssetsDialog: false,
      addFormDisabled: false,
      useAssetsDialog: false,
      handleRecord: false,
      footerShow: true,
      dialogTitle:'新增资产单',
      action:'领用',
      assetsConunt:'',
      pagination: {},
      handlePagination:{},
      tablePageSize: 10,
      columnShow: false,
      chooseId:[],
      tableData: [],
      handleTableData: [],
      addAssetsForm: {},
      currentId:'',
      addAssetsFormRules: {
        assets_type:[
          {required: true, message: '请选择资产类别', trigger: 'blur'}
        ],
        assets_name: [
          { required: true, message: '请输入资产名称', trigger: 'blur' },
        ],
      },
      useAssetsForm:{
        handling_at: formatDateTime(new Date())
      },
      useAssetsFormRules:{
        person:[
          {required: true, message: '请选择领用人', trigger: 'blur'}
        ],
        department: [
          { required: true, message: '请选择领用部门', trigger: 'blur' },
        ],
      },
      searchFormList:[
        {
          span: 5,
          label: '资产状态',
          labelWidth: '80px',
          type: 'select',
          placeholder: '请选择资产状态',
          model: '',
          selectOptions: [
            {
              value:'闲置',
              label:'闲置',
            },
            {
              value:'在用',
              label:'在用',
            },
            {
              value:'维修',
              label:'维修',
            },
            {
              value:'报废',
              label:'报废',
            },
          ],
          name: 'assets_status',
        },
        {
          span: 5,
          label: '资产类别',
          labelWidth: '80px',
          type: 'select',
          placeholder: '请选择资产类别',
          model: '',
          selectOptions: [
            {
              value:'脱水机器',
              label:'脱水机器',
            },
            {
              value:'包埋机器',
              label:'包埋机器',
            },
            {
              value:'切片机器',
              label:'切片机器',
            },
            {
              value:'染色机器',
              label:'染色机器',
            },
            {
              value:'封片机器',
              label:'封片机器',
            },
            {
              value:'通用设备',
              label:'通用设备',
            },
            {
              value:'交通运输设备',
              label:'交通运输设备',
            },
            {
              value:'电子产品及通信设备',
              label:'电子产品及通信设备',
            },
            {
              value:'文艺体育设备',
              label:'文艺体育设备',
            },
            {
              value:'图书文物及陈列品',
              label:'图书文物及陈列品',
            },
            {
              value:'家具用品及其他',
              label:'家具用品及其他',
            },
          ],
          name: 'assets_type',
        },
      ]
    }
  },
  computed:{
    ...mapState(['user','departments','doctors','userList'])
  },
  created() {
    this.getTable();
  },
  methods:{
    changeAssetsStatus(id) {
      this.$confirm('确定将此资产变为闲置状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        storageService.changeAssetsStatus(id).then((res)=>{
          this.getTable();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    rowClick(row) {
      this.$refs.assetsTable.toggleRowSelection(row);
    },
    handleSelectionChange() {

    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    handleCurrentPageChange(val){ // dialog列表分页切换
      this.getHandleTable(val);
    },
    exportAssets() {  //导出资产

    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.searchInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.searchInput = searchInput;
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },
    addAssets() { //增加资产
      let params = this.addAssetsForm;
     /* params.organization_id = this.user.organization_id;*/
      storageService.addAssets(params).then((res) => {
        this.$message.success('资产增加成功');
        this.resetForm('addAssetsForm');
        this.addAssetsDialog = false;
        this.getTable();
      }).catch((err) => {
        this.$message.error('资产增加失败');
      })
    },
    submitForm(formName) { //提交增加资产
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addAssetsForm.id){
            this.editAssets();
          }else{
            this.addAssets();
          }
        } else {
          return false;
        }
      });
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      storageService.getAssets(Object.assign({
        page: page,
        page_size: page_size,
        search: this.searchInput
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          //this.tableData = res.body.data;
          this.tableData = res.body.data.map((item) => {
            return {
              id: item.id,
              assets_status: item.assets_status,
              assets_end_at: item.assets_end_at,
              assets_from: item.assets_from,
              assets_id: item.assets_id,
              assets_model: item.assets_model,
              assets_money: item.assets_money,
              assets_name: item.assets_name,
              assets_position: item.assets_position,
              assets_sn: item.assets_sn,
              assets_supplier: item.assets_supplier,
              assets_supplier_name: item.assets_supplier_name,
              assets_supplier_phone: item.assets_supplier_phone,
              assets_type: item.assets_type,
              assets_unit: item.assets_unit,
              assets_principal: item.assets_principal,
              service_remark: item.service_remark,
              buy_at: item.buy_at,
              base_remark: item.base_remark,
              person: item.assetsHandle.data.length > 0&&item.assetsHandle.data[item.assetsHandle.data.length - 1].action === '领用' ? item.assetsHandle.data[item.assetsHandle.data.length - 1].person : '',
              handling_at:item.assetsHandle.data.length > 0&&item.assetsHandle.data[item.assetsHandle.data.length - 1].action === '领用' ? item.assetsHandle.data[item.assetsHandle.data.length - 1].handling_at : '',
            }
          })
        }).finally(() => {
        this.loading = false;
      });
    },
    getHandleTable(page) {
      this.handleTabelLoading = true;
      storageService.handleRecord(this.currentId, {page: page, page_size: 5})
        .then((res) => {
          this.handleTableData = res.body.data;
          this.handlePagination = res.body.meta.pagination;
        }).catch((res) => {

        }).finally(()=>{
        this.handleTabelLoading = false;
        })
    },
    resetForm(formName) {  // 重置表单
      this.$refs[formName].resetFields();
      this[formName] = {};
      this.handleRecord = false;
    },
    closeAddAssetsDialog() { //右上角关闭
      this.addAssetsDialog = false;
      this.resetForm('addAssetsForm');
      this.addFormDisabled = false;
      this.footerShow = true;
    },
    cancelAddAssetsDialog() { //取消按钮
      this.addAssetsDialog = false;
      this.resetForm('addAssetsForm');
      this.addFormDisabled = false;
    },
    viewAssets(row,id) { //查看
      this.currentId = id;
      this.addAssetsDialog = true;
      this.handleRecord = true;
      this.addAssetsForm = row;
      this.addFormDisabled = true;
      this.footerShow = false;
      this.dialogTitle = '资产单详情';
      this.getHandleTable(1);
    },
    editAssetsBtn(row,id) { // 修改
      this.addAssetsDialog = true;
      this.addAssetsForm = {
        id:row.id,
        assets_end_at: row.assets_end_at,
        assets_from: row.assets_from,
        assets_model: row.assets_model,
        assets_money: row.assets_money,
        assets_name: row.assets_name,
        assets_position: row.assets_position,
        assets_sn: row.assets_sn,
        assets_supplier: row.assets_supplier,
        assets_supplier_name: row.assets_supplier_name,
        assets_supplier_phone: row.assets_supplier_phone,
        assets_type: row.assets_type,
        assets_unit: row.assets_unit,
        base_remark: row.base_remark,
        buy_at: row.buy_at,
        service_remark: row.service_remark,
        assets_principal: row.assets_principal
      };
      this.dialogTitle = '修改资产单';
    },
    addAssetsBtn() {
      this.addAssetsDialog = true;
      this.dialogTitle = '新增资产单';
    },
    editAssets() {
      let params = this.addAssetsForm;
      /*params.organization_id = this.user.organization_id;*/
      storageService.editAssets(this.addAssetsForm.id,params).then((res) => {
        this.$message.success('资产修改成功');
        this.resetForm('addAssetsForm');
        this.addAssetsDialog = false;
        this.getTable();
      }).catch((err) => {
        this.$message.error('资产修改失败');
      })
    },
    deleteAssets(row,id) { //报废
      if (row.assets_status === '在用') {
        this.$message.warning('在用中，不可报废在资产，请先退还。');
        return false;
      }
      this.action = '报废';
      this.chooseId.push(id);
      this.assetsConunt = 1;
      this.useAssetsDialog = true;
    },
    // 领用
    useAssetsBtn() {
      if(this.$refs.assetsTable.selection.length === 0){
        this.$message.warning('请选择领用的资产');
        return false;
      }
      if(this.$refs.assetsTable.selection.findIndex((item)=> item.assets_status !== '闲置') !== -1){
        this.$message.warning('请选择闲置的资产');
        return false;
      }
      for(let i=0; i<this.$refs.assetsTable.selection.length; i++){
        this.chooseId.push(this.$refs.assetsTable.selection[i].id);
      }
      this.action = '领用';
      this.assetsConunt = this.$refs.assetsTable.selection.length;
      this.useAssetsDialog = true;
    },
    // 重置表单
    resetUseForm() {
      this.$refs.useAssetsForm.resetFields();
      this.useAssetsForm = { handling_at: formatDateTime(new Date()) };
      this.chooseId = [];
    },
    closeUseAssetsDialog() {
      this.useAssetsDialog = false;
      this.resetUseForm();
    },
    cancelUseAssetsDialog(){
      this.useAssetsDialog = false;
      this.resetUseForm();
    },

    submitUseForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleAssets(this.action);
        } else {
          return false;
        }
      });
    },
    handleAssets(action) {
      let params = {};
      params = this.useAssetsForm;
      params.action = action;
      params.id = this.chooseId;
      params.handler = this.user.name;
      storageService.handleAssets(params).then((res) => {
        this.$message.success(`${action}成功`);
        this.resetUseForm();
        this.useAssetsDialog = false;
        this.getTable();
      }).catch((err) => {
        this.$message.error(`${action}失败`);
      })
    },
    /*退库事件*/
    returnAssetsBtn() {
      if(this.$refs.assetsTable.selection.length === 0){
        this.$message.warning('请选择退库的资产');
        return false;
      }
      if(this.$refs.assetsTable.selection.findIndex((item)=> item.assets_status !== '在用') !== -1){
        this.$message.warning('请选择在用的资产');
        return false;
      }
      for(let i=0; i<this.$refs.assetsTable.selection.length; i++){
        this.chooseId.push(this.$refs.assetsTable.selection[i].id);
      }
      this.action = '退还';
      this.assetsConunt = this.$refs.assetsTable.selection.length;
      this.useAssetsDialog = true;
    },
  }
}
