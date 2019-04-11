import {storageoutService} from "./storageout.service";
import pisIcon from '../../../../common/components/pisIcon';
import pisTitle from '../../../../common/components/pisTitle';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import {mapState} from 'vuex';
import {materialsService} from "../materials/materials.service";
import { formatDateTime, formatDate } from "@/config/utils";
export default {
  components: {
    pisIcon,
    pisPageSize,
    pisSearchHead,
    pisTitle,
  },
  data() {
    return {
      loading: false,
      treeLoading:false,
      chooseTableLoading: false,
      chooseMaterialsLoading: false,
      chooseMaterialsDialog: false,
      storageoutDialog: false,
      editDisabled:false,
      currentGroupId:'',
      filterText:'',
      searchInput:'',
      groupData:[],
      materialsData:[],
      searchFormList: [
        {
          type: 'daterange',
          label: '出库时间',
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
      pagination: {},
      materialsPagination: {},
      tableData: [],
      chooseTableData: [],
      chooseMaterialsData: [],
      tablePageSize: 10,
      storageoutForm: {
        stock_out_at:formatDateTime(new Date()),
        handler: ''
      },
      storageoutFormAbled: false,
      storageoutFormRules: {
        person:[
          {required: true, message: '请选择领用人', trigger: 'blur'}
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getTable();
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    }
  },
  computed: {
    ...mapState(['user','userList']),
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(val) {
      this.currentGroupId = val.id;
      this.getMaterialsTable();
    },
    getGroupData() {
      this.treeLoading = true;
      materialsService.getGroupData().then((res) =>{
        this.groupData = this.resetArray(res.body.data);
        this.materialsData = this.groupData;
      }).catch((err) =>{
      }).finally(() =>{
        this.treeLoading = false;
      })
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            value: item.id,
            label: item.category_name,
            children: this.resetArray(item.children, level + 1),
            level: level,
          }
        } else {
          return {
            id: item.id,
            value: item.id,
            label: item.category_name,
            level: level,
          }
        }
      });
    },
    getMaterialsTable({page = 1, page_size = 10,...rest} = {  // 获取列表
      page: 1,
      page_size: 10
    }) {
      this.chooseMaterialsLoading = true;
      this.tablePageSize = page_size;
      materialsService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        consumables_category_id:this.currentGroupId
      }, rest))
        .then((res) => {
          this.chooseMaterialsData = res.body.data;
          this.materialsPagination = res.body.meta.pagination;
        }).finally(() => {
        this.chooseMaterialsLoading = false;
      });
    },
    handleSelectionChange(){

    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    materialsHandleCurrentChange(){

    },
    refreshPage(){
      this.searchInput = '';
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = {
        stock_out_begin_at: params.rangeDate ? formatDateTime(params.rangeDate[0]) : undefined,
        stock_out_end_at: params.rangeDate ? formatDateTime(params.rangeDate[1]) : undefined,
      };
      this.getTable();
    },

    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      storageoutService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.searchInput
      }, rest,this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    searchList(searchInput) {
      this.searchInput = searchInput;
      this.getTable();
    },
    exportStorageoutList() {

    },
    storageoutBtn() {
      this.storageoutDialog = true;
      this.storageoutForm.handler = this.user.realname;
    },
    chooseMaterialsBtn() {
      this.chooseMaterialsDialog = true;
      this.getGroupData();
      this.getMaterialsTable();
    },
    resetForm() {
      this.storageoutForm = {
        stock_out_at:formatDateTime(new Date()),
        handler: ''
      };
      this.chooseTableData = [];
      this.storageoutFormAbled = false;
      this.editDisabled = false;
    },
    cancelStorageoutDialog() {
      this.storageoutDialog = false;
      this.resetForm();
    },
    submitStorageoutForm() {
      for(let i=0; i<this.chooseTableData.length;i++) {
        if(!this.chooseTableData[i].number){
          this.$message.warning('请填写耗材出库数量。');
          return false;
        }
      }
      if(this.storageoutForm.id){
          let params = {};
          params.handler = this.storageoutForm.handler;
          params.stock_out_at = this.storageoutForm.stock_out_at;
          params.remark = this.storageoutForm.remark;
          storageoutService.editStorageout(this.storageoutForm.id,params).then((res) => {
            this.$message.success('出库单修改成功。');
            this.storageoutDialog = false;
            this.resetForm();
            this.getTable();
          }).catch((err) => {
            this.$message.error('出库单修改失败。');
          })
      }else {
        this.$confirm('请仔细确认选择物料的数量，提交后不可修改！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params = this.storageoutForm;
          params.stock_list = this.chooseTableData.map((item) => {
            return {
              consumables_id: item.id,
              //unit_price: item.unit_price,
              number: item.number
            }
          })
          storageoutService.addStorageout(params).then((res) => {
            this.$message.success('出库单新增成功。');
            this.storageoutDialog = false;
            this.resetForm();
            this.getTable();
            this.$notify({
              title: '提示',
              message: res.body.join(' '),
              type: 'warning',
            })
          }).catch((err) => {
            this.$message.error(err.body.message);
          })
        });
      }
    },

    closeStorageoutDialog() {
      this.storageoutDialog = false;
      this.resetForm();
    },
    cancelChooseStorageoutDialog() {
      this.chooseMaterialsDialog = false;
    },
    confirmChooseStorageoutDialog() {
      this.chooseTableData = this.$refs.materialsTable.selection;
      this.chooseMaterialsDialog = false;
    },
    deleteChooseMaterials() {
      for(let i = 0;i<this.$refs.chooseTable.selection.length;i++) {
        let index = this.chooseTableData.findIndex((item)=> item.id === this.$refs.chooseTable.selection[i].id);
        this.chooseTableData.splice(index,1);
      }
    },
    viewStorageout(row,id) {
      this.chooseTableLoading = true;
      this.storageoutDialog = true;
      this.storageoutForm = row;
      this.storageoutFormAbled = true;
      storageoutService.getChooseMaterials(id).then((res) =>{
        this.chooseTableData = res.body.data.consumablesStock.data.map((item) =>{
          return {
            consumables_id:item.consumables_id,
            number:item.number,
            //unit_price:item.unit_price,
            consumables_name:item.consumables.data.consumables_name,
            model_specification:item.consumables.data.model_specification,
            supplier:item.consumables.data.supplier,
            brand:item.consumables.data.brand,
          }
        });
        this.chooseTableLoading = false;
      })
    },
    editStorageoutBtn(row,id) {
      this.chooseTableLoading = true;
      this.storageoutDialog = true;
      this.storageoutForm = row;
      this.editDisabled = true;
      storageoutService.getChooseMaterials(id).then((res) =>{
        this.chooseTableData = res.body.data.consumablesStock.data.map((item) =>{
          return {
            consumables_id:item.consumables_id,
            number:item.number,
            //unit_price:item.unit_price,
            consumables_name:item.consumables.data.consumables_name,
            model_specification:item.consumables.data.model_specification,
            supplier:item.consumables.data.supplier,
            brand:item.consumables.data.brand,
          }
        });
        this.chooseTableLoading = false;
      })
    },
  },
};
