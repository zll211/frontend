import {dBindService} from './bind.service';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisSlideView from '../../../../common/components/pisSlideView/pisSlideView';
import pisTab from '../../../../common/components/pisTab';
import {mapState} from 'vuex';
import {formatDateTime} from '@/config/utils';
import {baseUrl} from '../../../../config/utils';

export default {
  created() {
    this.searchParams = {
      search: this.$route.query?.id,
    };
    this.scanList();
  },
  computed: mapState([
    'user',
  ]),
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab,
    pisSlideView,
  },
  data() {
    return {
      activeTabName: 'unscan',
      tabList: [{
        label: '未扫描',
        name: 'unscan',
        number: 0,
      }, {
        label: '未绑定',
        name: 'unbind',
        number: 0,
      }, {
        label: '已绑定',
        name: 'binded',
        number: 0,
      }, {
        label: '全部',
        name: 'total',
        number: 0,
      }],
      status: ['未扫描'],
      pagination: {total: 0, current_page: 1, per_page: 10},
      pathPagination: {total: 0, current_page: 1, per_page: 10},
      scans: [],
      scan: {},
      pathIdList: [],
      section: undefined,
      sectionList: [],
      scanImages: {},
      imageList: [],
      multipleSelection: [],
      selection: false,
      loading: false,
      bindDialogVisible: false,
      bindDetailDialogVisible: false,
      tableHeaderList: [
        /*{
        'prop': 'id',
        'label': '病理号',
        'min-width': 120,
        'align': 'center',
      }, */
        {
          'prop': 'case_type',
          'label': '病理类型',
          'min-width': 120,
          'align': 'center',
        }, /*{
        'prop': 'scan_at',
        'label': '扫描时间',
        'min-width': 120,
        'align': 'center',
      }, */{
          'prop': 'section_status',
          'label': '当前状态',
          'min-width': 120,
          'align': 'center',
        }],
      searchParams: {},
      showFile: false,
      fileNameList: [],
      fileIndex: 0,
    };
  },
  methods: {
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    handleSelectionChange(list) {
      this.multipleSelection = list.concat();
    },
    handleTab(tab, event) {
      if (tab.name === 'total') {
        this.status = ['未扫描', '未绑定', '已绑定'];
        this.selection = false;
      }
      if (tab.name === 'unscan') {
        this.status = ['未扫描'];
        this.selection = false;
      }
      if (tab.name === 'unbind') {
        this.status = ['未绑定'];
        this.selection = true;
      }
      if (tab.name === 'binded') {
        this.status = ['已绑定'];
        this.selection = true;
      }
      this.multipleSelection = [];
      this.searchParams = {};
      this.$refs.searchHead.clear();
      this.scanList({
        page: 1,
        page_size: this.pagination.per_page,
        status: this.status,
      });
    },
    bindParafinSection(scan) {
      this.scan = scan;
      this.bindDialogVisible = true;
      dBindService.pathList()
        .then((res) => {
          this.imageList = res.body.data.map((item) => {
            item.labelSrc = `${baseUrl}/slide/getImage?file=${item.path}&type=label`;
            return item;
          });
          this.pathPagination = res.body.meta.pagination;
        });
      dBindService.pathologySection({id: scan.id})
        .then((res) => {
          this.sectionList = res.body.data;
        });
    },
    scanParafinSection(scan) {
      dBindService.pathologySectionScan({id: [scan.id]})
        .then((res) => {
          this.scanList({
            page: this.pagination.current_page,
            page_size: this.pagination.per_page,
            status: this.status,
          });
        });
    },
    confirmBind() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('未选择绑定的切片');
        return;
      }
      const data = {
        pathology_id: this.scan.id,
        paraffin_section_id: this.section,
        section_path_id: this.multipleSelection.map((item) => item.id),
      };
      dBindService.bindParafinSection(data)
        .then(() => {
          this.scanList({
            page: this.pagination.current_page,
            page_size: this.pagination.per_page,
            status: this.status,
          });
          this.$message.success('绑定成功');
        }).catch(() => {
        this.$message.error('绑定失败');
      });
    },
    upBindParafinSection(id) {
      const data = {
        pathology_id: this.scan.id,
        id: Array.isArray(id) ? id : [id],
      };
      dBindService.upBindParafinSection(data)
        .then(() => {
          this.scanList({
            page: this.pagination.current_page,
            page_size: this.pagination.per_page,
            status: this.status,
          });
          this.bindDetailDialogVisible = false;
          this.$message.success('解绑成功');
        }).catch(() => {
        this.$message.error('解绑失败');
      });
    },
    lookParafinSection(row) {
      this.scan = row;
      this.multipleSelection = [];
      this.imageList = (row.sectionPath?.data || []).map((item) => {
        item.labelSrc = `${baseUrl}/slide/getImage?file=${item.path}&type=label`;
        return item;
      });
      this.bindDetailDialogVisible = true;
    },
    lookKfb(row) {
      this.showFile = true;
      this.fileIndex = 0;
      this.fileNameList = (row.sectionPath?.data || []).map((item) => item.path);
    },
    unPatchBind() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要解绑的切片');
        return;
      }
      this.upBindParafinSection(
        this.multipleSelection.map((item) => item.id));
    },
    selectChange(params) {
      this.searchParams = params;
      params['status'] = this.status;
      this.scanList(params);
    },
    refreshPage() {
      this.searchParams = {};
      this.scanList({status: this.status});
    },
    currentChange(page) {
      this.scanList({
        page: page,
        page_size: this.pagination.per_page,
        status: this.status,
      });
    },
    pathCurrentChange(page) {
      dBindService.pathList({
        page: page,
        page_size: this.pathPagination.per_page,
      }).then((res) => {
        this.imageList = res.body.data;
        this.pathPagination = res.body.meta.pagination;
      });
    },
    pageSizeChange(size) {
      this.scanList({page: 1, page_size: size, status: this.status});
    },
    scanList({page = 1, page_size = this.pagination.per_page, status = this.status, ...rest} = {
      page: 1,
      status: this.status,
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.scans = [];
      dBindService.bindList(Object.assign(this.searchParams, {
        page: page,
        page_size: page_size,
        section_status: status,
      }, rest))
        .then((res) => {
          this.scans = res.body.data;
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.scans.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.loading = false;
      });
      dBindService.bindCount()
        .then((res) => {
          this.tabList.forEach((tab) => {
            tab.number = res.data.data[tab.name];
          });
        });
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.scanList({status: this.status, search: searchInput});
    },
  },
};
