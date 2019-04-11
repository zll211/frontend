import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import {caseService} from './case.service';
import {formatDateTime} from '@/config/utils';

export default {
  components: {
    pisPageSize,
    pisSearchHead,
  },
  data() {
    return {
      searchForm: {rangeDate: []},
      searchParams: {},
      loading: false,
      pagination: {total: 0, current_page: 1, per_page: 10},
      pageSize: 10,
      tableHeaderList: [{
        'prop': 'user_name',
        'label': '用户',
        'align': 'center',
      }, {
        'prop': 'ip',
        'label': 'ip',
        'align': 'center',
      }, {
        'prop': 'time',
        'label': '时间',
        'align': 'center',
      }, {
        'prop': 'type',
        'label': '操作',
        'align': 'center',
      }],
      logs: [],
      users: [],
    };
  },
  created() {
    this.logList();
  },
  methods: {
    pageSizeChange(size) {
      this.pageSize = size;
      this.logList({page_size: size});
    },
    currentChange(page) {
      this.logList({page: page});
    },
    refreshPage() {
      this.searchParams = {};
      this.logList();
    },
    logList({page_size = this.pageSize, page = 1, ...rest} = {
      page_size: 10,
      page: 1,
    }) {
      this.loading = true;
      this.logs = [];
      caseService.logList(Object.assign(this.searchParams, {
        page_size: page_size,
        page: page,
      }, rest))
        .then((res) => {
          let logs = [];
          let _logs = [];
          res.body.data.forEach((item) => {
            item.production.forEach((production) => {
              logs.push({...item, ...production});
            });
            if (item.production.length === 0) logs.push({...item});
          });
          _logs = [..._logs, ...logs.map((item) => ({
            id: item.id,
            case_type: item.case_type,
            register: {
              title: '登记',
              content: `<p>登记医生：${item.registor || '无'}</p><p>登记时间：${item.register_at || '无'}</p>`,
              status: (!item.registor && !item.register_at) ? 'wait' : 'finish',
              show: true,
              index: 1,
            },
            draw_material: {
              title: '取材',
              index: 2,
              content: `<p>取材医生：${item.draw_materialer || '无'}</p><p>取材时间：${item.draw_material_time || '无'}</p><p>记录员：${item.recorder || '无'}</p>`,
              status: (!item.draw_materialer && !item.draw_material_time && !item.recorder) ? 'wait' : 'finish',
              show: item.case_type !== '玻片' && item.case_type !== '蜡块' && item.case_type !== '细胞',
            },
            dehydration: {
              title: '脱水',
              content: `<p>脱水操作员：${item.dehydration_operator || '无'}</p><p>脱水时间：${item.dehydration_time || '无'}</p>`,
              status: (!item.dehydration_operator && !item.dehydration_time) ? 'wait' : 'finish',
              show: item.case_type === '常规',
              index: 3,
            },
            entrapment: {
              title: '包埋',
              content: `<p>包埋操作员：${item.entrapment_operator || '无'}</p><p>包埋时间：${item.entrapment_time || '无'}</p>`,
              status: (!item.entrapment_operator && !item.entrapment_time) ? 'wait' : 'finish',
              show: item.case_type === '常规',
              index: 4,
            },
            section: {
              title: '切片',
              content: `<p>切片操作员：${item.section_operator || '无'}</p><p>切片时间：${item.section_time || '无'}</p>`,
              status: (!item.section_operator && !item.section_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片' && item.case_type !== '细胞',
              index: 5,
            },
            dyeing: {
              title: '染色',
              content: `<p>染色操作员：${item.dyeing_operator || '无'}</p><p>染色时间：${item.dyeing_time || '无'}</p>`,
              status: (!item.dyeing_operator && !item.dyeing_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片',
              index: 6,
            },
            seal: {
              title: '封片',
              content: `<p>封片操作员：${item.seal_operator || '无'}</p><p>封片时间：${item.seal_time || '无'}</p>`,
              status: (!item.seal_operator && !item.seal_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片',
              index: 7,
            },
            diagnosis: {
              title: '诊断',
              content: `<p>诊断医生：${item.clinical_doctor || '无'}</p><p>诊断时间：${item.clinical_time || '无'}</p>`,
              status: (!item.clinical_doctor && !item.clinical_time) ? 'wait' : 'finish',
              show: true,
              index: 8,
            },
            review: {
              title: '审核',
              content: `<p>审核医生：${item.review_doctor || '无'}</p><p>审核时间：${item.review_time || '无'}</p>`,
              status: (!item.review_doctor && !item.review_time) ? 'wait' : 'finish',
              show: true,
              index: 9,
            },
          }))];
          _logs.forEach((item) => {
            let index = 0;
            item.active = 1;
            for (let prop in item) {
              if (item[prop]::Object.prototype.toString() === '[object Object]' && item[prop].show && item[prop].status === 'finish') {
                index = item[prop].index;
              }
            }
            for (let prop in item) {
              if (item[prop]::Object.prototype.toString() === '[object Object]' && item[prop].show && item[prop].index < index) {
                item.active += 1;
                item[prop].status = 'finish';
              }
            }
          });
          _logs.forEach((log) => {
            const item = this.logs.find((item) => item.id === log.id);
            if (item) {
              item.logs.push(log);
            } else {
              this.logs.push({
                id: log.id,
                case_type: log.case_type,
                showCount: 1,
                logs: [log],
              });
            }
          });
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.logs.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.loading = false;
      });
    },
    selectChange(params) {
      this.searchParams = params;
      params['status'] = this.status;
      this.logList(params);
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.logList();
    },
    showAllCase(cate) {
      if (cate.logs.length === cate.showCount && cate.showCount !== 1) {
        cate.showCount = 1;
      } else {
        cate.showCount = cate.logs.length;
      }
      // cate.showCount =
    },
  },

};
