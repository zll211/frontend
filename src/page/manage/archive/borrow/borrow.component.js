
import {userService} from "../../system/users/users.service";
import {borrowService} from "./borrow.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisTitle from '../../../../common/components/pisTitle';
import pisSearchHead from '../../../../common/components/pisSearchHead';
export default {
  components: {
    pisPageSize,
    pisTitle,
    pisSearchHead,
  },
  data() {
    return {
      borrowProjectDialog: false,
      returnProjectDialog: false,
      returnProFormAbled: false,
      borrowProForm: {
        borrow_type:'家属借阅',
      },
      returnProForm:{
        isBroken: '否',
        payfor: '0',
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
      printPdf: '',
      userList: [],
      borrowNoTableData: [],
      borrowProTableData: [],
      pagination: {},
      proTotalCount: 0,
      borrowSearchInput: '',
      tablePageSize: 10,
      searchFormList:[
        {
          span: 5,
          label: '借阅单状态',
          labelWidth: '100px',
          type: 'select',
          placeholder: '请选择借阅单状态',
          model: '',
          selectOptions: [
            {
              value:'审核中',
              label:'审核中',
            },
            {
              value:'审核通过',
              label:'审核通过',
            },
            {
              value:'审核未通过',
              label:'审核未通过',
            },
            {
              value:'借用中',
              label:'借用中',
            },
            {
              value:'已归还',
              label:'已归还',
            },
          ],
          name: 'status',
        },
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
      returnProFormRules: {
        true_return_at: [
          { required: true, message: '请选择实际归还日期', trigger: 'blur' },
        ],
        receive_doctor: [
          {required: true, message: '请选择接收人', trigger: 'blur'},
        ]
      },
    };
  },
  mounted: function () {
    this.getTable();
    this.getUsers();
    this.getPathologyList();
  },
  watch:{
    borrowSearchInput: function () {
      if(this.borrowSearchInput ==='') {
        this.getTable();
      }
    },
    borrowNoTableData: function () {
      if(this.borrowNoTableData.length > 0){
        this.borrowProTableData = this.borrowNoTableData[0].borrowItem.data;
        this.proTotalCount = this.borrowNoTableData[0].borrowItem.data.length;
      }else{
        this.borrowProTableData = [];
      }
    }
  },
  methods: {
    submitForm(formName) { // 提交表单
      if(this.borrowProList.length < 1||this.borrowProList[0].borrow_item === ''){
        this.$message.warning('请至少录入一条借阅信息');
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.borrowProForm.id){
            this.editBorrowPro(this.borrowProForm.id);
          }else{
            this.addBorrowPro();
          }
        } else {
          return false;
        }
      });
    },
    borrowProjectBtn() {
      this.borrowProjectDialog = true;
      this.resetForm('borrowProForm');
    },
    cancelDialog() {
      this.borrowProjectDialog = false;
      // this.resetForm('borrowProForm');
    },
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
    resetReturnForm(formName) {
      this.$refs[formName].resetFields();
      this[formName] = {
        isBroken: '否',
        payfor: '0',
      };
    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    addBorrowPro() {
      borrowService.addBorrow(this.params()).then((res) => {
        this.$message.success('借阅单已生成。');
        this.borrowProjectDialog = false;
        this.getTable();
        this.resetForm('borrowProForm');
      }).catch((err) => {
        this.$message.error('借阅单保存失败。');
      })
    },
    editBorrowPro(id) {
      borrowService.editBorrow(id,this.params()).then((res) => {
        this.$message.success('借阅单已修改。');
        this.borrowProjectDialog = false;
        this.getTable();
        this.resetForm('borrowProForm');
      }).catch((err) => {
        this.$message.error('借阅单修改失败。');
      });
    },
    params() {
      let params = {};
      params = this.borrowProForm;
      params.status = '审核中';
      if(params.borrowItem){
        delete params.borrowItem;
      }
      params.item = this.borrowProList;
      return params;
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      borrowService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.borrowSearchInput
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.borrowNoTableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    getUsers() {
      userService.userList().then((res) => {
        this.userList = res.body.data;
      });
    },
    /*formatParams() {
      let params = {
        status:this.searchForm.status?this.searchForm.status:undefined,
        search:this.borrowSearchInput?this.borrowSearchInput:undefined,
      };
      return params;
    },*/
    addBorrowItem() {
      this.borrowProList.push({ borrow_item: '', pathology_id: '', borrow_num: '',borrow_remark: ''});
    },
    deleteBorrowPro(index) {
      this.borrowProList.splice(index,1);
    },
    deleteBorrow(row,id) { // 申请单列表删除操作
      if (row.status === '借用中') {
        this.$message.warning('未归还，不可删除。');
        return false;
      }
      this.$confirm('确定要删除这条借阅申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        borrowService.deleteBorrow(id).then((res) => {
          this.$message.success('删除成功。');
          this.getTable();
        }).catch((err) => {
          this.$message.error('删除失败。');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    borrowNoRowClick(row,event,column) { // 申请单列表点击事件
      this.borrowProTableData = row.borrowItem.data;
      this.proTotalCount = row.borrowItem.data.length;
      this.$refs.borrowTable.toggleRowSelection(row);
    },
    editBorrow(row,id) { //修改操作
      if (row.status === '借用中') {
        this.$message.warning('已借出，不可修改。');
        return false;
      }
      if (row.status === '已归还') {
        this.$message.warning('已归还，不可修改。');
        return false;
      }
      this.borrowProjectDialog = true;
      this.borrowProForm = row;
      this.borrowProList = row.borrowItem.data;
    },
    returnPro(row,id) { // 归还操作
      if (row.status === '审核中' || row.status === '审核通过' || row.status === '审核未通过') {
        this.$message.warning('未借出。');
        return false;
      }
      if (row.status === '已归还') {
        this.$message.warning('已归还。');
        return false;
      }
      this.returnProjectDialog = true;
      this.returnProForm.id = row.id;
      this.returnProForm.borrower = row.borrower;
      this.returnProForm.borrowed_at = row.borrowed_at;
      this.returnProForm.return_at = row.return_at;
      this.returnProForm.phone = row.phone;
    },
    closeDialog() { // borrow-dialog关闭回调
      // this.resetForm('borrowProForm');
    },
    closeReturnDialog() { // return-dialog关闭回调
      this.resetReturnForm('returnProForm');
      this.returnProFormAbled = false;
    },
    cancelReturnDialog() {
      this.returnProjectDialog = false;
      this.resetReturnForm('returnProForm');
      this.returnProFormAbled = false;
    },
    submitReturnForm(formName) { // 归还dialog确认回调
      this.$refs[formName].validate((valid) => {
        if (valid) {
          borrowService.editBorrow(this.returnParams().id,this.returnParams()).then((res) => {
            this.$message.success('借阅单已归还。');
            this.returnProjectDialog = false;
            this.getTable();
            this.resetForm('returnProForm');
          }).catch((err) => {
            this.$message.error('借阅单归还失败。');
          });
        } else {
          return false;
        }
      });
    },
    returnParams() {
      let params = Object.assign({}, this.returnProForm);
      params.remark = {
        isBroken:this.returnProForm.isBroken,
        payfor:this.returnProForm.payfor,
        brokenNote:this.returnProForm.brokenNote,
        receive_doctor:this.returnProForm.receive_doctor,
        true_return_at:this.returnProForm.true_return_at,
      }
      if(params.isBroken){
        delete params.isBroken;
      }
      if(params.payfor){
        delete params.payfor;
      }
      if(params.brokenNote){
        delete params.brokenNote;
      }
      if(params.receive_doctor){
        delete params.receive_doctor;
      }
      if(params.true_return_at){
        delete params.true_return_at;
      }
      params.status = '已归还';
      return params;
    },
    rowSelect(selection) { // 借阅单选中事件
      this.borrowSelection = selection;
    },
    viewReturnReport() { // 查看归还单
      if(this.borrowSelection.length !== 1) {
        this.$message.warning('请选择一条你要查看的借阅归还单。');
        return false;
      }
      if(this.borrowSelection[0].status !== '已归还') {
        this.$message.warning('未归还，不可查看。');
        return false;
      }
      this.returnProjectDialog = true;
      this.returnProForm = this.borrowSelection[0];
      this.returnProForm.isBroken = this.borrowSelection[0].remark.isBroken;
      this.returnProForm.payfor = this.borrowSelection[0].remark.payfor;
      this.returnProForm.brokenNote = this.borrowSelection[0].remark.brokenNote;
      this.returnProForm.receive_doctor = this.borrowSelection[0].remark.receive_doctor;
      this.returnProForm.true_return_at = this.borrowSelection[0].remark.true_return_at;
      this.returnProFormAbled = true;
    },
    outBorrow(row,id) { // 借出事件
      if (row.status === '借用中') {
        this.$message.warning('已借出，不可重复借出。');
        return false;
      }
      if (row.status === '已归还') {
        this.$message.warning('已归还，不可借出。');
        return false;
      }
      if (row.status === '审核中') {
        this.$message.warning('审核中，不可借出。');
        return false;
      }
      if (row.status === '审核未通过') {
        this.$message.warning('审核未通过，不可借出。');
        return false;
      }
      this.$confirm('确定要借出这条借阅申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        borrowService.editBorrow(id,{status:'借用中'}).then((res) => {
          this.$message.success('借出成功。');
          this.getTable();
        }).catch((err) => {
          this.$message.error('借出失败。');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    getPathologyList() {
      borrowService.patholoygIdList().then((res) => {
        this.patholoygIdList = res.body.data;
      }).catch((err) => {

      })
    },
    pathologySearch(queryString, cb) {
      let patholoygIdList = this.patholoygIdList;
      let results = queryString ? patholoygIdList.filter(this.createFilter(queryString)) : patholoygIdList;
      // 调用 callback 返回建议列表的数据
        cb(results);
    },
    createFilter(queryString) {
      return (patholoyg) => {
        return (patholoyg.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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
    printBorrow() {
      if (this.borrowSelection.length ===0) {
        this.$message.warning('请选择要打印的借阅项');
        return;
      }
      borrowService.printBorrow({id: this.borrowSelection.map((item) => item.id)})
        .then(({body}) => {
          this.printPdf = URL.createObjectURL(body);
          URL.revokeObjectURL(body);
          this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
        })
    },
  }
};
