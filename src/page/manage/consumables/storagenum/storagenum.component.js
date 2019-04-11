import {storagenumService} from "./storagenum.service";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {mapState} from 'vuex';
import {materialsService} from "../materials/materials.service";
import { formatTime, formatDate } from "@/config/utils";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab
  },
  data() {
    return {
      loading: false,
      storagenumDialog: false,
      dialogTableloading: false,
      searchInput:'',
      storageTab:'入库记录',
      action_type:'入库',
      currentId:'',
      dialogTablePagination:{},
      searchFormList: [
        {
          span: 5,
          label: '物料类型',
          labelWidth: '80px',
          type: 'cascader',
          placeholder: '请选择物料类型',
          model: [],
          changeOnSelect: true,
          name: 'consumables_category_id',
          cascaderOptions: [],
        },
      ],
      pagination: {},
      tableData: [],
      storageTableData:[],
      tablePageSize: 10,
      storageinColumnList:[
        {
          label:'入库单号',
          prop:'stock_in_id',
          fixed:true
        },
        {
          label:'入库时间',
          prop:'stock_in_at',
          fixed:true
        },
        {
          label:'经办人',
          prop:'handler',
          fixed:false
        },
        {
          label:'入库数量',
          prop:'number',
          fixed:false
        },
        {
          label:'入库单价',
          prop:'unit_price',
          fixed:false
        },
        {
          label:'入库总价',
          prop:'amount',
          fixed:false
        },
      ],
      storageoutColumnList:[
        {
          label:'出库单号',
          prop:'stock_out_id',
          fixed:true
        },
        {
          label:'出库时间',
          prop:'stock_out_at',
          fixed:true
        },
        {
          label:'经办人',
          prop:'handler',
          fixed:false
        },
        {
          label:'领用人',
          prop:'person',
          fixed:false
        },
        {
          label:'领用部门',
          prop:'department',
          fixed:false
        },
        {
          label:'出库数量',
          prop:'number',
          fixed:false
        },
      ]
    }
  },
  created() {
    this.getTable();
    this.getGroupData();
  },
  watch: {

  },
  computed: {
    ...mapState(['user','userList']),
  },

  methods: {
    handleNodeClick(val) {
      this.currentGroupId = val.id;
      this.getMaterialsTable();
    },
    getGroupData() {
      materialsService.getGroupData().then((res) =>{
        this.searchFormList[0].cascaderOptions = this.resetArray(res.body.data);
        this.materialsData = this.resetArray(res.body.data);
      }).catch((err) =>{
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
    handleSelectionChange(){

    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },

    refreshPage(){
      this.searchInput = '';
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = params;
      params.consumables_category_id = params.consumables_category_id.splice(-1,1);
      this.getTable(params);
    },

    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      materialsService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.searchInput
      },rest,this.searchParams))
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
    exportStoragenumList() {

    },
    viewMaterials(row,id) {
      this.storagenumDialog = true;
      this.currentId = id;
      this.getSingleTable();
    },
    storageTabHandleClick(tab) {
      if(tab.label ==='入库记录'){
        this.action_type = '入库';
      }else{
        this.action_type = '出库';
      }
      this.getSingleTable();
    },

    getSingleTable({page = 1, page_size = 10,...rest} = {  // 获取列表
      page: 1,
      page_size: 10
    }) {
      this.dialogTableloading = true;
      this.tablePageSize = page_size;
      storagenumService.getSingleTable(this.currentId,Object.assign({
        page: page,
        page_size: page_size,
        action_type: this.action_type,
      }, rest))
        .then((res) => {
          this.dialogTablePagination = res.body.meta.pagination;
          if(this.action_type === '入库'){
            this.storageTableData = res.body.data.map((item) => {
              return  {
                number:item.number,
                unit_price:item.unit_price,
                amount:item.amount,
                stock_in_id:item.consumablesStockIn.data.stock_in_id,
                stock_in_at:item.consumablesStockIn.data.stock_in_at,
                handler:item.consumablesStockIn.data.handler,
                remark:item.consumablesStockIn.data.remark,
              }
            });
          }else {
            this.storageTableData = res.body.data.map((item) => {
              return  {
                number:item.number,
                stock_out_id:item.consumablesStockOut.data.stock_out_id,
                stock_out_at:item.consumablesStockOut.data.stock_out_at,
                handler:item.consumablesStockOut.data.handler,
                remark:item.consumablesStockOut.data.remark,
                person:item.consumablesStockOut.data.person,
                department:item.consumablesStockOut.data.department,
              }
            });
          }
        }).finally(() => {
        this.dialogTableloading = false;
      });
    },
    dialogTableHandleCurrentChange(val) {
      this.getSingleTable({page:val});
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if(this.action_type === '入库'){
          if(index === 6||index === 5) {
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            let num = sums[index].toFixed(2)+'元';
            sums[index] = num;
          }
          if(index === 4) {
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          }
        }
        if(this.action_type === '出库'){
          if(index === 6) {
            const values = data.map(item => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          }
        }
      });
      return sums;
    }
  },
};
