import pisPageSize from '../../../../common/components/pisPageSize';
import pisIcon from '../../../../common/components/pisIcon';
import {sectionService} from "./section.service";
import {userService} from "../../system/users/users.service";
import {formatDateTime} from '@/config/utils'

export default {
  components: {
    pisPageSize,
    pisIcon,
  },
  data() {
    return {
      rangeDate: [],
      searchParams: {},
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
      },
      /*searchForm: {rangeDate: []},
      searchParams: {},
      searchFormList: [{
        type: 'select',
        form: '',
        selectOptions: [],
        placeholder: '请选择操作用户',
        name: 'user_id'
      }, {
        type: 'daterange',
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
        },
        placeholder: '请选择操作用户',
        name: 'rangeDate'
      }],*/
      searchRules: {},
      loading: false,
      pagination: {total: 0},
      pageSize: 10,
      tableHeaderList: [{
        'prop': 'user_name',
        'label': '用户',
        'align': 'center',
      }, {
        'prop': 'action_type',
        'label': '类型',
        'align': 'center',
      }, {
        'prop': 'barcode',
        'label': '二维码',
        'align': 'center',
      }, {
        'prop': 'dev_id',
        'label': '设备号',
        'align': 'center',
      }, {
        'prop': 'time',
        'label': '扫描时间',
        'align': 'center',
      }, {
        'prop': 'opt',
        'label': '操作',
        'align': 'center',
      }],
      sections: [],
      users: [],
    };
  },
  created() {
    this.sectionList();
    this.userList();
  },
  methods: {
    pageSizeChange(size) {
      this.pageSize = size;
      this.sectionList({page_size: size});
    },
    currentChange(page) {
      this.sectionList({page: page});
    },
    refreshPage() {
      this.searchParams = {};
      this.rangeDate = [];
      this.sectionList();
    },
    sectionList({page_size = this.pageSize, page = 1, ...rest} = {
      page_size: 10,
      page: 1
    }) {
      this.loading = true;
      sectionService.sectionList(Object.assign(this.searchParams, {
        page_size: page_size,
        page: page,
        subject_type: 'SectionPath'
      }, rest))
        .then((res) => {
          this.sections = res.body.data.map((item) => ({
            user_name: item.user_name,
            time: item.time,
            action_type: item.action_type === 'updated'?'更新':'创建',
            opt: item.opt,
            barcode: item.properties.attributes.barcode,
            dev_id: item.properties.attributes.dev_id,
          }));
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.sections.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.loading = false;
      })
    },
    userList() {
      userService.userList()
        .then((res) => {
          this.users = res.body.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        }).finally(() => {

      });
    },
    selectChange(params) {
      this.sectionList();
      this.searchParams = {
        user_id: params.user_id,
        begin_at: this.rangeDate ? formatDateTime(this.rangeDate[0]) : undefined,
        end_at: this.rangeDate ? formatDateTime(this.rangeDate[1]) : undefined,
      };
      this.sectionList();
    },
  },

}
