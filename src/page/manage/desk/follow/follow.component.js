import {followService} from "./follow.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {dNormalService} from "../../diagnosis/normal/normal.service";
export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {},
      moreShow: false,
      specimenSearchInput: '',
      tablePageSize: 10,
      recordListDialog: false,
      recordForm: {},
      recordList: [],
      editId: '',
      countList: {},
      activeName: 'following',
      selectId: [],
      recordFormRule: {
        time: [
            {required: true, message: '请选择随访时间', trigger: 'blur'}
        ],
        msg: [
            {required: true, message: '请填写随访结果', trigger: 'blur'}
        ]
      }
    };
  },
  mounted: function () {
    this.getTable();
  },
  methods: {
    handleClick() {
      this.getTable();
    },
    handleCurrentChange(val){  // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val) {  // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      followService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.specimenSearchInput,
        followup: this.activeName === 'following'?0:1,
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data.map((item)=>{
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
              status: item.status,
              specimen_num: item.specimen_num,
              age: item.age + item.age_unit,
              pivot: item.pivot,
            }
          });
        }).finally(() => {
          this.getTableCount();
          this.loading = false;
      });
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.specimenSearchInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.specimenSearchInput = searchInput;
      this.getTable();
    },
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },
    rowClick(row) {
      this.$refs.followTable.toggleRowSelection(row);
    },
    handleSelectionChange(row) {
      this.selectId = row.map((item) => {
        return item.id
      })
    },
    // 记录随访
    editFollow(id,pivot) {
      this.recordList = [];
      this.recordForm = {};
      this.editId= id;
      this.recordListDialog = true;
      if(pivot.result !== null) {
        this.recordList = pivot.result;
      }
    },
    // 结束随访
    finishFollow(id, pivot) {
      this.recordList = pivot.result;
      this.$confirm('确定要结束随访此病例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.recordList.push({time:formatDateTime(new Date()), msg:'结束随访'});
        let params = {
          follow: [
            {
              id: id,
              status: '已随访',
              result: this.recordList,
            }
          ]
        }
        followService.editFollow(params).then((res) => {
          this.$message.success('随访已结束');
        }).catch((err) =>{

        }).finally(() =>{
          this.getTable();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 重新随访
    reStartFollow(id,pivot) {
      this.recordList = pivot.result;
      this.$confirm('确定要再次随访此病例吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.recordList.push({time:formatDateTime(new Date()), msg:'重新随访'});
        let params = {
          follow: [
            {
              id: id,
              status: '随访中',
              result: this.recordList,
            }
          ]
        }
        followService.editFollow(params).then((res) => {
          this.$message.success('再次随访');
        }).catch((err) =>{

        }).finally(() =>{
          this.getTable();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 重置recordForm
    resetRecordForm() {
      this.$refs.recordForm.resetFields();
    },
    // 记录dialog确定按钮
    confirmRecordBtn() {
      this.$refs.recordForm.validate((valid) => {
        if (valid) {
          this.recordList.push(this.recordForm)
          let params = {
            follow: [
              {
                id: this.editId,
                result: this.recordList,
              }
            ]
          }
          followService.editFollow(params).then((res) => {
            this.$message.success('记录成功');
          }).catch((err) =>{

          }).finally(() =>{
            this.recordListDialog = false;
            this.getTable();
          })
        } else {
          return false;
        }
      });
    },
    // 记录dialog取消按钮
    cancelRecordBtn() {
      this.resetRecordForm();
      this.recordListDialog = false;
    },
    // 关闭dialog
    closeRecordForm() {
      this.resetRecordForm();
      this.recordListDialog = false;
    },
    getTableCount() {
      followService.getTableCount().then((res) =>{
        this.countList = res.body;
      })
    },
    deleteFollow() {
      if(this.selectId.length === 0) {
        this.$message.warning('请选择需要删除的随访病例');
      }else{
        this.$confirm('确定要删除所选随访病例吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dNormalService.cancelFollow({id:this.selectId}).then((res) =>{
            this.$message.success('删除随访病例成功');
            this.followed = false;
          }).catch((err)=>{

          }).finally(()=>{
            this.getTable();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    }
  },
};
