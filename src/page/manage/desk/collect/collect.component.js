import {collectService} from "./collect.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';

export default {
  components: {
    pisPageSize,
    pisSearchHead
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {},
      multipleSelection: [],
      moreShow: false,
      specimenSearchInput: '',
      tablePageSize: 10,
    };
  },
  mounted: function () {
    this.getTable();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      collectService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.specimenSearchInput,
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
            }
          });
        }).finally(() => {
        this.loading = false;
      });
    },
    cancelCollect(id) {
      this.$confirm('确定要取消收藏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collectService.cancelCollect({case_id:id}).then((res) => {
          this.$message.success('取消收藏成功');
          this.getTable();
        }).catch((err) => {
          this.$message.error('取消收藏失败');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
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
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    exportListBtn() {
      let params = Object.assign({
        search:this.specimenSearchInput
      },this.searchParams);
      collectService.exportExcel(params).then((res)=>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '表格统计.xls');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
      }).finally((e) =>{

      })
    },
  },
};
