import {mapState} from 'vuex';
import pisTab from '../../../../common/components/pisTab';
import pisIcon from '../../../../common/components/pisIcon';
import pisCheckbox from '../../../../common/components/pisCheckbox';
import {formatTime, formatNumber} from '@/config/utils';

import {schedualListService} from './list.service';
import {schedualCycleService} from '../cycle/cycle.service';
import {formatDate} from '../../../../config/utils';

const year = new Date().getFullYear();
const month = new Date().getMonth();
const day = new Date().getDate();
const startTime = new Date(year, month, day, 8, 0);
const endTime = new Date(year, month, day, 17, 0);
const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default {
  components: {
    pisTab,
    pisIcon,
    pisCheckbox,
  },
  mounted() {
    this.refreshPage();
  },
  computed: {
    ...mapState({
      schedualUserList: state => state.userList.map((user) => ({
        label: user.realname,
        name: user.name,
        value: user.id,
      })),
    }),
  },
  watch: {
    schedualUserList() {
      this.refreshPage();
    },
  },
  data() {
    return {
      schedualViewDialog: false,
      activeTabName: 'fixed',
      weekList: weekList.map((week, index) => ({
        checked: true,
        name: week,
        index: index + 1,
        range: [startTime, endTime],
      })),
      schedualUser: '',
      cycles: [],
      schedualCycle: '',
      rules: [],
      weekHeaderList: [],
      weekIndex: undefined,
      dateHeaderList: [],
      userBodyList: [],
      loading: false,
    };
  },
  methods: {
    schedualList(params) {
      if (!params) {
        params = {
          start_date: formatDate(new Date(year, month, day - this.weekIndex), '-'),
          end_date: formatDate(new Date(year, month, day + 6 - this.weekIndex), '-'),
        };
      }
      this.loading = true;
      schedualListService.schedualList(params)
        .then((res) => {
          const results = res.data.data;
          this.dateHeaderList = Object.keys(results);
          this.userBodyList = this.schedualUserList.map((user) => ({
            name: user.label,
            id: user.value,
            stateList: this.dateHeaderList.map((date) => (do {
              if (results[date]) {
                const people = results[date].find((item) => item.user_name === user.name);
                if (people) {
                  `${people.start_time}-${people.end_time}`;
                } else {
                  '休息';
                }
              } else {
                '休息';
              }
            })),
          }));
        }).finally(() => {
        this.loading = false;
      });
    },
    createSchedual() {
      this.cycleList();
      this.schedualViewDialog = true;
    },
    closeDialog() {
      this.schedualUser = '';
      this.schedualCycle = '';
      this.schedualViewDialog = false;
    },
    confirmSchedual() {
      let data = {};
      if (!this.schedualUser || this.schedualUser.length === 0) {
        this.$message.warning('请选择排班医生');
        return;
      }
      data.user_ids = this.schedualUser;
      if (this.activeTabName === 'fixed') {
        if (this.weekList.filter((week) => week.checked && !week.range).length > 0) {
          this.$message.warning('请选择排班时间');
          return;
        }
        data.fixed_day = {};
        this.weekList.forEach((week) => {
          if (week.checked) {
            data.fixed_day[week.index] = {
              start_time: formatTime(week.range[0]),
              end_time: formatTime(week.range[1]),
            };
          }
        });
      } else {
        if (!this.schedualCycle) {
          this.$message.warning('请选择排班周期');
          return;
        }
        data.scheduling_cycle_id = this.schedualCycle;
      }
      schedualListService.createSchedulingRule(data)
        .then((res) => {
          this.refreshPage();
          this.$message.success('新建成功');
        }).catch(() => {
        this.$message.error('新建失败');
      });
    },
    cycleList() {
      schedualCycleService.cycleList().then((res) => {
        this.cycles = res.data.data.filter((item) => item.cycle_name).map((item) => ({
          label: item.cycle_name,
          value: item.id,
        }));
      });
    },
    refreshPage() {
      this.weekIndex = new Date().getDay() - 1;
      this.weekHeaderList = weekList;
      this.schedualList();
    },
    lastWeek() {
      this.weekIndex += 7;
      this.schedualList();
    },
    nextWeek() {
      this.weekIndex -= 7;
      this.schedualList();
    },
  },
};
