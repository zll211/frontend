import {archiveService} from '../archive.service';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisList from '../../../../common/components/pisList';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import {reportService} from "../../desk/report/report.service";
import {mapState} from "vuex";
import pisTab from '../../../../common/components/pisTab';

export default {
  created() {
    this.archiveList();
    this.getLockers();
  },
  components: {
    pisPageSize,
    pisList,
    pisSearchHead,
    pisTab
  },
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {total: 0, current_page: 1, per_page: 10},
      searchParams: {},
      archiveDialog: false,
      archiveProList: [],
      archiveId: '',
      lockers: [],
      dialogStatus: 'view',
      activeName: '未归档',
      countList: {},
      needArchive:'0',
      chooseLockers:[],
      archiveType :'',
      ids:[],
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    handleClick() {
      this.archiveList();
    },
    getTableCount() {
      archiveService.filesStatusCount().then((res) => {
        this.countList = res.body.data;
      })
    },
    archiveList({page = 1, page_size = this.pagination.per_page, ...rest} = {
      page: 1,
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.tableData = [];
      archiveService.archiveList(Object.assign(this.searchParams, {
        page: page,
        page_size: page_size,
        file_status: this.activeName,
        include: 'file.locker'
      }, rest)).then(({body}) => {
        this.tableData = body.data;
        this.tableData.forEach((item) => {
          item.age = item.age + item.age_unit;
          item.position = item.file.data.length !== 0?item.file.data.locker.data.name +'#'+ item.file.data.number:'';
        });
        this.pagination = body.meta.pagination;
      }).finally(() => {
        if (this.tableData.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.getTableCount();
        this.loading = false;
      });
    },
    refreshPage() {
      this.searchParams = {};
      this.archiveList();
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.archiveList({search: searchInput});
    },
    selectChange(params) {
      this.searchParams = params;
      this.archiveList(params);
    },
    pageSizeChange(size) {
      this.archiveList({page_size: size});
    },
    handleCurrentChange(page) {
      this.archiveList({
        page: page,
        page_size: this.pagination.per_page,
        status: this.status
      });
    },
    rowClick(row) {
      this.$refs.reportTable.toggleRowSelection(row);
    },
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    /**
     * 获取储物柜列表
     */
    getLockers() {
      reportService.getLockers().then((res) =>{
        this.lockers  = res.body.data.map((item) => {
          return  {
            name: item.name,
            volume: item.volume,
            avail_volume: item.avail_volume,
            id: item.id,
            value: {
              id: item.id,
              avail_volume: item.avail_volume
            }
          }
        })
      })
    },
    /**
     * 归档dialog确定按钮
     */
    confirmArchiveBtn() {
      if (this.archiveType === 'handle') {
        let cases = [];
        this.$refs.reportTable.selection.forEach((item) => {
          cases.push(item.id)
        })
        let params = {
          ids: this.ids,
          cases: cases,
        }
        archiveService.filesArchive(params).then((res) => {
          this.$message.success('归档成功');
          this.archiveList();
          this.archiveDialog = false;
        })
      } else {
        archiveService.filesArchive({ids:this.ids}).then((res) => {
          this.$message.success('归档成功');
          this.archiveList();
          this.archiveDialog = false;
        })
      }
    },
    /**
     * 归档dialog取消按钮
     */
    cancelArchiveBtn() {
      this.archiveDialog = false;
    },
    /**
     * 自动归档
     */
    autoArchive() {
      this.archiveType = 'auto';
      archiveService.getAutoArchiveNum().then((res)=>{
        this.needArchive = res.body.count;
      }).finally(() => {
        if(this.needArchive === 0) {
          this.$message.warning('当前没有可自动归档的病理材料。');
          return false;
        }
        this.getLockers();
        this.chooseLockers = [];
        this.ids = [];
        this.archiveDialog = true;
      })
    },
    /**
     * 手动归档
     */
    handleArchive() {
      this.archiveType = 'handle';
      if(this.$refs.reportTable.selection.length === 0) {
        this.$message.warning('请选择需要手动归档的病理材料。');
        return false;
      }
      this.needArchive = this.$refs.reportTable.selection.length;
      this.getLockers();
      this.chooseLockers = [];
      this.ids = [];
      this.archiveDialog = true;
    },
    /**
     * 归档仓库选择事件
     * @param val 归档仓库列表
     */
    lockerSelectChange(val) {
      let allColume = 0;
      val.forEach((item) => {
        allColume += item.avail_volume;
        this.ids.push(item.id);
      })
      if(allColume < parseInt(this.needArchive)) {
        this.$message.warning('当前所选仓库的可用容量小于归档数量，请添加仓库。')
      }
    },
  },
};
