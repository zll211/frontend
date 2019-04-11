import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisPageSize from '../../../../common/components/pisPageSize';
import {mapState} from 'vuex';
import {serviceService} from "./service.service";
import {storageService} from "../storage/storage.service";
import { formatDateTime, formatDate } from "@/config/utils";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
  },
  data() {
    return {
      serviceAssetsDialog:false,
      chooseAssetsDialog:false,
      loading:false,
      isView:false,
      chooseId:[],
      printPdf:'',
      chooseTableLoading: false,
      seviceFormAbled: false,
      pagination:{},
      assetsPagination:{},
      searchInput:'',
      tablePageSize:10,
      assetsTablePageSize:10,
      tableData:[],
      assetsTableData:[],
      chooseTableData:[],
      searchFormList:[
        {
          span: 5,
          label: '维修状态',
          labelWidth: '80px',
          type: 'select',
          placeholder: '请选择资产状态',
          model: '',
          selectOptions: [
            {
              value:'维修中',
              label:'维修中',
            },
            {
              value:'已维修',
              label:'已维修',
            },
          ],
          name: 'maintain_status',
        },
        {
          type: 'daterange',
          label: '维修时间',
          labelWidth: '80px',
          name: 'rangeDate',
          form: '',
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          }
        },
      ],
      serviceAssetsForm:{
        maintain_at: formatDateTime(new Date()),
      },
      serviceAssetsFormRules:{},
    }
  },
  computed: {
    ...mapState(['user','departments','doctors','userList']),
  },
  watch: {
    user:function () {
      this.serviceAssetsForm.maintain_name = this.user.name;
    }
  },
  created() {
    this.serviceAssetsForm.maintain_name = this.user.name;
    this.getTable();
    this.chooseTableData =[];
  },
  methods: {
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    rowClick(row) {
      this.$refs.serviceTable.toggleRowSelection(row);
    },
    chooseTableRowClick(row) {
      this.$refs.chooseTable.toggleRowSelection(row);
    },
    assetsRowClick(row) {
      this.$refs.chooseAssets.toggleRowSelection(row);
    },
    handleSelectionChange() {

    },
    assetsHandleCurrentChange() {

    },
    serviceAssets() {

    },
    printAssets() {
      this.chooseId = [];
      if(this.$refs.serviceTable.selection.length === 0){
        this.$message.warning('请选择要打印的维修单');
        return false;
      }
      for(let i=0; i<this.$refs.serviceTable.selection.length; i++){
        this.chooseId.push(this.$refs.serviceTable.selection[i].id);
      }
      serviceService.servicePrint({id: this.chooseId}).then((res) =>{
        this.printPdf = URL.createObjectURL(res.data);
      }).catch((err)=>{

      }).finally(()=>{
        this.$el.getElementsByClassName('printIfr')[0].onload = () => {
          setTimeout(() => {
            this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
          }, 100);
        }
      })
    },
    addService() {
      let params = {};
      params = this.serviceAssetsForm;
      params.assets_id = [];
      for(let i = 0 ;i<this.chooseTableData.length;i++) {
        params.assets_id.push(this.chooseTableData[i].id);
      }
      serviceService.addService(params).then((res) =>{
        this.$message.success('增加成功。');
        this.serviceAssetsDialog = false;
        this.resetServiceForm();
        this.getTable();
      }).catch((err) => {
        this.$message.error('增加失败。');
      })
    },
    editService() {
      let params = {};
      params.maintain_at = this.serviceAssetsForm.maintain_at;
      params.maintain_content = this.serviceAssetsForm.maintain_content;
      params.maintain_expense = this.serviceAssetsForm.maintain_expense;
      params.maintain_name = this.serviceAssetsForm.maintain_name;
      params.maintain_remark = this.serviceAssetsForm.maintain_remark;
      params.assets_id = [];
      for(let i = 0 ;i<this.chooseTableData.length;i++) {
        params.assets_id.push(this.chooseTableData[i].id);
      }
      serviceService.editService(this.serviceAssetsForm.id,params).then((res) =>{
        this.$message.success('修改成功。');
        this.serviceAssetsDialog = false;
        this.resetServiceForm();
        this.getTable();
      }).catch((err) => {
        this.$message.error('修改失败。');
      })
    },
    // 维修单修改
    editServiceBtn(row,id) {
      if(row.maintain_status === '已维修'){
        this.$message.warning('该资产已维修完成，不可修改');
        return false;
      }
      this.serviceAssetsDialog = true;
      this.serviceAssetsForm = JSON.parse(JSON.stringify(row));
      this.chooseTableData = row.assetsMaintainItem.data.map((item) => {
        return item.organizationAsset.data;
      });
    },
    viewService(row,id) {
      this.serviceAssetsDialog = true;
      this.seviceFormAbled = true;
      this.isView = true;
      this.serviceAssetsForm = JSON.parse(JSON.stringify(row));
      this.chooseTableData = row.assetsMaintainItem.data.map((item) => {
        return item.organizationAsset.data;
      });
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
    resetServiceForm() {
      this.$refs.serviceAssetsForm.resetFields();
      this.serviceAssetsForm = { maintain_at: formatDateTime(new Date())};
      this.handleRecord = false;
      this.seviceFormAbled = false;
      this.chooseTableData = [];
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      serviceService.getServiceList(Object.assign({
        page: page,
        page_size: page_size,
        search: this.searchInput
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    getAssetsTable({page = 1, page_size = this.assetsTablePageSize,...rest} = {  // 获取闲置资产列表
      page: 1,
      page_size: this.assetsTablePageSize
    }) {
      this.chooseTableLoading = true;
      this.assetsTablePageSize = page_size;
      storageService.getAssets(Object.assign({
        page: page,
        page_size: page_size,
        assets_status:'闲置'
      },rest))
        .then((res) => {
          this.assetsPagination = res.body.meta.pagination;
          this.assetsTableData = res.body.data;
        }).finally(() => {
        this.chooseTableLoading = false;
      });
    },
    selectChange(params) {
      this.searchParams = {
        maintain_status: params.maintain_status,
        maintain_begin_at: params.rangeDate ? formatDateTime(params.rangeDate[0]) : undefined,
        maintain_end_at: params.rangeDate ? formatDateTime(params.rangeDate[1]) : undefined,
      };
      this.getTable();
    },
    closeServiceAssetsDialog() { //右上角关闭
      this.serviceAssetsDialog = false;
      this.isView = false;
      this.resetServiceForm();
    },
    cancelServiceAssetsDialog() { //取消
      this.serviceAssetsDialog = false;
      this.resetServiceForm();
    },
    submitForm(formName) { //确定提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.serviceAssetsForm.id){
            this.editService();
          }else{
            this.addService();
          }
        } else {
          return false;
        }
      });
    },
    closeChooseAssetsDialog() { //选择资产右上角关闭
      this.chooseAssetsDialog = false;
    },
    cancelChooseAssetsDialog() {  //选择资产取消
      this.chooseAssetsDialog = false;
    },
    confirmChooseAssetsDialog() {  //选择资产确认
      this.chooseTableData=this.$refs.chooseAssets.selection;
      this.chooseAssetsDialog = false;
    },
    serviceFinish(row,id){
      if(row.maintain_status === '已维修') {
        this.$message.warning('维修已完成。');
        return false;
      }
      this.$confirm('确定维修完成了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        serviceService.changeStatus({id:[id],maintain_finish_at:formatDateTime(new Date())}).then((res) => {
          this.$message.success('维修完成。');
          this.getTable();
        }).catch((err) => {
          this.$message.error('维修不能完成。');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    chooseAssetsBtn() {
      this.chooseAssetsDialog = true;
      this.getAssetsTable();
    },
    deleteChooseAssets() {
      for(let i = 0;i<this.$refs.chooseTable.selection.length;i++) {
        let index = this.chooseTableData.findIndex((item)=> item.id === this.$refs.chooseTable.selection[i].id);
        this.chooseTableData.splice(index,1);
      }
    },
  }
}
