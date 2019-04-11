
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import {reportService} from "../report/report.service";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
  },
  data() {
    return {
      loading: false,
      imgDialog: false,
      imgDialogSrc: '',
      tableData: [],
      pagination: {},
      multipleSelection: [],
      searchInput: '',
      tablePageSize: 10,
    }
  },
  watch: {

  },
  computed:{

  },
  created() {
    this.getTable();
  },
  mounted() {

  },
  methods:{
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
      reportService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.searchInput,
      }, rest))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.searchInput = searchInput;
      this.getTable();
    },
    editReport(id) {
      this.$router.push(`./report/edit?id=${id}`)
    },
    deleteReport(id) {
      this.$confirm('确定要删除这个模版吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportService.delReport(id).then((res) => {
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
    viewBig(title,src) {
      this.imgDialog = true;
      this.imgDialogSrc = src;
    }
  }
}
