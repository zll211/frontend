
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisTitle from '../../../../common/components/pisTitle';
import {borrowService} from "../borrow/borrow.service";
import {borrowCheckService} from "./borrowcheck.service";
import pisSearchHead from '../../../../common/components/pisSearchHead';
export default {
  components: {
    pisPageSize,
    pisTitle,
    pisSearchHead
  },
  data() {
    return {
      borrowProjectDialog: false,
      borrowProForm: {
        borrow_type:'家属借阅',
      },
      borrowSelection:[],
      patholoygIdList:[],
      loading: false,
      borrowProList:[
        {
          borrow_item: '',
          pathology_id: '',
          borrow_num: '',
          borrow_remark: '',
        },
      ],
      searchFormList:[
        {
          type: 'daterange',
          label: '借阅日期',
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
        {
          span: 5,
          label: '借阅类型',
          labelWidth: '80px',
          type: 'select',
          placeholder: '请选择借阅类型',
          model: '',
          name: 'borrow_type',
          selectOptions: [
            {
              value:'家属借阅',
              label:'家属借阅',
            },
            {
              value:'外院借阅',
              label:'外院借阅',
            },
            {
              value:'科内借阅',
              label:'科内借阅',
            }
          ]
        },
      ],
      userList: [],
      borrowCount:'',
      refusal_reason:'',
      borrowNoTableData: [],
      borrowProTableData: [],
      pagination: {},
      proTotalCount: 0,
      borrowSearchInput: '',
      tablePageSize: 10,
      borrowProFormRules: {
        borrower: [
          { required: true, message: '请输入借阅人', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入借阅人联系电话', trigger: 'blur' },
        ],
        borrowed_at: [
          { required: true, message: '请选择借阅时间', trigger: 'blur' },
          // { type: 'number', message: '必须为数字值', trigger: 'blur' }
        ],
        return_at: [
          {required: true, message: '请选择归还日期', trigger: 'blur' },
        ],
        check_doctor: [
          {required: true, message: '请选择审核医生', trigger: 'change'},
        ]
      },
    };
  },
  mounted: function () {
    this.getTable();
    this.setTimer();
  },
  watch:{
    borrowNoTableData: function () {
      if(this.borrowNoTableData.length > 0) {
        this.borrowProTableData = this.borrowNoTableData[0].borrowItem.data;
        this.proTotalCount = this.borrowNoTableData[0].borrowItem.data.length;
      }
    }
  },
  methods: {
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields();
      this[formName] = {
        borrow_type:'家属借阅',
      };
      this.borrowProList = [{
        borrow_item: '',
        pathology_id: '',
        borrow_num: '',
        borrow_remark: '',
      }]
    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    getTable({page = 1, page_size = this.tablePageSize,status = '审核中',...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize,
      status: '审核中',
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      borrowCheckService.getCheckBorrow(Object.assign({
        page: page,
        page_size: page_size,
        status: '审核中',
        search: this.borrowSearchInput,
      }, rest, this.searchParams))
        .then((res) => {
          this.borrowCount = res.body.meta.pagination.total;
          this.pagination = res.body.meta.pagination;
          this.borrowNoTableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },

    borrowNoRowClick(row,event,column) { // 申请单列表点击事件
      this.borrowProTableData = row.borrowItem.data;
      this.proTotalCount = row.borrowItem.data.length;
      this.$refs.borrowTable.toggleRowSelection(row);
    },
    closeDialog() { // borrow-dialog关闭回调
      this.resetForm('borrowProForm');
      this.getTable();
    },
    rowSelect(selection) { // 借阅单选中事件
      this.borrowSelection = [...selection]
    },
    checkedAndBorrowed() { // 批量审核通过并借出
      let idList = [];
      if(this.borrowSelection.length === 0) {
        this.$message('请选择通过审核并借出的借阅单。');
        return false;
      } else {
        for(let i=0; i<this.borrowSelection.length;i++) {
          idList.push(this.borrowSelection[i].id);
        }
      }
      this.$confirm('确定要通过这些借阅申请并借出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        borrowCheckService.changeStatus({id:idList,status:'借用中'}).then((res) =>{
          this.$message.success('操作完成：审核通过并借出。');
          this.getTable();
        }).catch((err) =>{
          this.$message.error('操作失败。')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    onlyChecked() { // 批量审核通过
      let idList = [];
      if(this.borrowSelection.length === 0) {
        this.$message('请选择通过审核的借阅单。');
        return false;
      } else {
        for(let i=0; i<this.borrowSelection.length;i++) {
          idList.push(this.borrowSelection[i].id);
        }
      }
      this.$confirm('确定要通过这些借阅申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        borrowCheckService.changeStatus({id:idList,status:'审核通过'}).then((res) =>{
          this.$message.success('操作完成：审核通过。');
          this.getTable();
        }).catch((err) =>{
          this.$message.error('操作失败。')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    dialogCheckedBtn() {  //dialog 审核通过
      borrowService.editBorrow(this.borrowProForm.id,{status:'审核通过'}).then((res) =>{
        this.$message.success('操作完成：审核通过。')
        this.borrowProjectDialog = false;
        this.refusal_reason = '';
        this.getTable();
      }).catch((err) =>{
        this.$message.error('操作失败。')
      })
    },
    dialogCheckedAndBorrowed() { //dialog 审核通过并借出
      borrowService.editBorrow(this.borrowProForm.id,{status:'借用中'}).then((res) =>{
        this.$message.success('操作完成：审核通过并借出。')
        this.borrowProjectDialog = false;
        this.refusal_reason = '';
        this.getTable();
      }).catch((err) =>{
        this.$message.error('操作失败。')
      })
    },
    dialogNotAllowed() { //dialog 审核未通过
      if(this.refusal_reason === '') {
        this.$message.warning('请输入审核意见或修改建议。');
        return false;
      } else {
        borrowService.editBorrow(this.borrowProForm.id,{status:'审核未通过',refusal_reason:this.refusal_reason}).then((res) =>{
          this.$message.success('操作完成：审核不予通过。');
          this.borrowProjectDialog = false;
          this.refusal_reason = '';
          this.getTable();
        }).catch((err) =>{
          this.$message.error('操作失败。')
        })
      }
    },
    checkBorrowPro(row,id) { // 审核借阅单
      this.borrowProjectDialog = true;
      this.borrowProForm = row;
      this.borrowProList = row.borrowItem.data;
    },
    getBorrowCount() {
      borrowCheckService.getCheckBorrow(Object.assign({
        status: '审核中',
        search: this.borrowSearchInput,
      }, this.searchParams)).then((res) => {
        if(res.body.meta.pagination.total > this.borrowCount) {
          this.$notify.info({
            title: '消息',
            message: '收到一条新的借阅单审核请求。',
            duration: 5000
          });
          this.getTable();
        }
      })
    },
    setTimer() {
      let timer = setInterval(this.getBorrowCount,15000);
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.borrowSearchInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.borrowSearchInput = searchInput;
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = params;
      this.searchParams.borrowed_begin_at = params.rangeDate ? formatDateTime(params.rangeDate[0]) : undefined;
      this.searchParams.borrowed_end_at = params.rangeDate ? formatDateTime(params.rangeDate[1]) : undefined;
      this.getTable(params);
    },
  },
};
