import {dScanService} from './scan.service';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisList from '../../../../common/components/pisList';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {mapState} from 'vuex';
import {formatDateTime} from '@/config/utils';

export default {
  created() {
    this.scanList();
  },
  computed: mapState([
    'user',
  ]),
  components: {
    pisPageSize,
    pisList,
    pisSearchHead,
    pisTab,
  },
  data() {
    return {
      activeTabName: 'total',
      tabList: [{
        label: '全部',
        name: 'total',
        number: 0,
      }, {
        label: '未扫描',
        name: 'unscan',
        number: 0,
      }, {
        label: '扫描中',
        name: 'scanning',
        number: 0,
      }, {
        label: '已扫描',
        name: 'scaned',
        number: 0,
      }],
      status: ['未扫描','扫描中','已扫描未绑定', '已扫描已绑定'],
      pagination: {total: 0, current_page: 1, per_page: 10},
      scans: [],
      multipleSelection: [],
      selection: false,
      loading: false,
      tableHeaderList: [{
        'prop': 'pathology_id',
        'label': '病理号',
        'min-width': 120,
        'align': 'center',
      },{
        'prop': 'paraffin_block_id',
        'label': '蜡块号',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'id',
        'label': '切片号',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'scan_start_at',
        'label': '扫描开始时间',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'scan_end_at',
        'label': '扫描结束时间',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'operator',
        'label': '操作人',
        'min-width': 120,
        'align': 'center',
      }, {
        'prop': 'status',
        'label': '当前状态',
        'min-width': 120,
        'align': 'center',
      }],
      searchParams: {},
    };
  },
  methods: {
    handleSelectionChange(list) {
      this.multipleSelection = list.concat();
    },
    handleTab(tab, event) {
      if (tab.name === 'total') {
        this.status = ['未扫描','扫描中','已扫描未绑定', '已扫描已绑定'];
        this.selection = false;
      }
      if (tab.name === 'unscan') {
        this.status = ['未扫描'];
        this.selection = true;
      }
      if (tab.name === 'scanning') {
        this.status = ['扫描中'];
        this.selection = true;
      }
      if (tab.name === 'scaned') {
        this.status = ['已扫描未绑定', '已扫描已绑定'];
        this.selection = false;
      }
      this.searchParams = {};
      this.$refs.searchHead.clear();
      this.scanList({
        page: 1,
        page_size: this.pagination.per_page,
        status: this.status
      });
    },
    updateStatus(id, status) {
      const data = {
        id: Array.isArray(id) ? id : [id],
        scan_start_at: status === '扫描中' ? formatDateTime(new Date()) : undefined,
        scan_end_at: status === '已扫描未绑定' ? formatDateTime(new Date()) : undefined,
        operator: this.user.name,
        status: status,
      };
      dScanService.updateParafinSection(data)
        .then(() => {
          this.scanList({
            page: this.pagination.current_page,
            page_size: this.pagination.per_page,
            status: this.status
          });
          this.$message.success('操作成功');
        }).catch(() => {
        this.$message.error('操作失败');
      })
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
        status: this.status
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
      dScanService.scanList(Object.assign(this.searchParams, {
        page: page,
        page_size: page_size,
        status: status,
      }, rest))
        .then((res) => {
          this.scans = res.body.data;
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.scans.length === 0) {
          this.pagination = {total: 0, current_page: 1,per_page:10};
        }
        this.loading = false;
      })
      dScanService.scanCount()
        .then((res) => {
          this.tabList.forEach((tab) => {
            tab.number = res.data.data[tab.name];
          });
        })
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.scanList({status: this.status, search: searchInput});
    },
  },
};
