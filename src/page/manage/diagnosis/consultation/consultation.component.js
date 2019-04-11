import {dNormalService} from '../normal/normal.service';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisList from '../../../../common/components/pisList';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {mapState} from 'vuex';

export default {
  created() {
    this.caseList();
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
      activeTabName: 'wait_diagnosis',
      tabList: [{
        label: '待诊断',
        name: 'wait_diagnosis',
        number: 0,
      }, {
        label: '待审核',
        name: 'uncheck',
        number: 0,
      }, {
        label: '已诊断',
        name: 'has_diagnosis',
        number: 0,
      }],
      status: ['已制片'],
      pagination: {total: 0, current_page: 1, per_page: 10},
      cases: [],
      loading: false,
      tableHeaderList: [
        {
          'fixed': true,
          'prop': 'id',
          'label': '基本信息',
          'min-width': 120,
          'align': 'center',
        }, {
          'fixed': true,
          'prop': 'patient_name',
          'label': '标本信息',
          'min-width': 120,
          'align': 'center',
        }, {
          'fixed': true,
          'prop': 'case_type',
          'label': '诊断意见',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'age',
          'label': '当前状态',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'gender',
          'label': '操作',
          'min-width': 120,
          'align': 'center',
        },
      ],
      searchParams: {},
    };
  },
  methods: {
    selectChange(params) {
      this.searchParams = params;
      params['status'] = this.status;
      this.caseList(params);
    },
    handleClick(tab, event) {
      if (tab.name === 'wait_diagnosis') {
        this.status = ['已制片'];
      }
      if (tab.name === 'uncheck') {
        this.status = ['未审核'];
      }
      if (tab.name === 'has_diagnosis') {
        this.status = ['已签发', '已打印', '已发放'];
      }
      this.searchParams = {};
      this.$refs.searchHead.clear();
      this.caseList({page: 1, page_size:this.pagination.per_page, status: this.status});
    },
    diagnosis(id) {
      this.$store.commit('setCollapse', true);
      this.$router.push(`/diagnosis/operate/${id}`);
    },
    refreshPage() {
      this.searchParams = {};
      this.caseList({status: this.status});
    },
    currentChange(page) {
      this.caseList({
        page: page,
        page_size: this.pagination.per_page,
        status: this.status
      });
    },
    pageSizeChange(size) {
      this.caseList({page: 1, page_size: size, status: this.status});
    },
    caseList({page = 1, page_size = this.pagination.per_page, status = ['已制片'], ...rest} = {
      page: 1,
      status: ['已制片'],
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.cases = [];
      dNormalService.consultationList(Object.assign(this.searchParams, {
        page: page,
        page_size: page_size,
        status: status,
        case_type: '常规',
        review_doctor: this.activeTabName === 'uncheck' ? this.user.name : rest['review_doctor'],
      }, rest))
        .then((res) => {
          this.cases = res.body.data;
          this.cases.forEach((item) => {
            item.age = item.age + item.age_unit;
            item.has_advice = item.has_advice ? '是' : '否';
          });
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.cases.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.loading = false;
      });
      dNormalService.consultationsStatus()
        .then((res) => {
          this.tabList.forEach((tab) => {
            tab.number = res.data[tab.name];
          });
        })
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.caseList({status: this.status, search: searchInput});
    },
  },
};
