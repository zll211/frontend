import {schedualCycleService} from './cycle.service';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisIcon from '../../../../common/components/pisIcon';
import {formatTime, formatDate} from '@/config/utils';

const upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const year = new Date().getFullYear();
const month = new Date().getMonth();
const day = new Date().getDate();
const startTime = new Date(year, month, day, 8, 0);
const endTime = new Date(year, month, day, 17, 0);

export default {
  name: "cycle",
  components: {
    pisSearchHead,
    pisIcon,
  },
  data() {
    return {
      cycles: [],
      loading: false,
      schedualViewDialog: false,
      cycleName: '',
      restDay: 1,
      placeholder: '周期名称',
      title: '新增排班周期',
      cycleId: '',
      workList: [{
        name: `第${this.numberConvertToUppercase(1)}天`,
        index: 1,
        range: [startTime, endTime],
      }]
    };
  },
  created() {
    this.cycleList();
  },
  methods: {
    cycleList(name) {
      if (!name) name = '';
      this.loading = true;
      schedualCycleService.cycleList().then((res) => {
        this.cycles = res.data.data.filter((item) => item.cycle_name && !!~item.cycle_name.indexOf(name)).map((item) => ({
          cycle_name: item.cycle_name,
          rest_day: item.rest_day,
          work_day: Object.keys(item.work_day).length,
          id: item.id,
        }));
      }).finally(() => {
        this.loading = false;
      })
    },
    createCycle() {
      this.title = '新增排班周期';
      this.schedualViewDialog = true;
    },
    editCycle(id) {
      this.cycleId = id;
      this.title = '编辑排班周期';
      schedualCycleService.cycle(id)
        .then((res) => {
          this.schedualViewDialog = true;
          this.cycleName = res.data.data.cycle_name;
          this.restDay = res.data.data.rest_day;
          const workDay = res.data.data.work_day;
          this.workList = Object.keys(workDay).map((item) => {
            const range = workDay[item];
            const startTime = range.start_time;
            const endTime = range.end_time;
            return {
              name: `第${this.numberConvertToUppercase(item)}天`,
              index: item,
              range: [new Date(formatDate(new Date()) +  ' ' + startTime),
                new Date(formatDate(new Date()) + ' ' + endTime)],
            }
          });
        });
    },
    deleteCycle(id) {
      schedualCycleService.deleteCycle(id)
        .then((res) => {
          this.$message.success('删除成功');
          this.cycleList();
        }).catch((error) => {
        this.$message.error('删除失败');
      });
    },
    closeDialog() {
      this.restDay = 1;
      this.cycleName = '';
      this.workList = [{
        name: `第${this.numberConvertToUppercase(1)}天`,
        index: 1,
        range: [startTime, endTime],
      }];
      this.cycleId = '';
      this.schedualViewDialog = false;
    },
    numberConvertToUppercase(num) {
      const numList = `${num}`.split('');
      return numList.map((num) => upperCaseNumber[num]).join('');
    },
    deleteWork(index) {
      this.workList.splice(index, 1);
      this.workList = this.workList.map((work, index) => ({
        name: `第${this.numberConvertToUppercase(index + 1)}天`,
        index: index + 1,
        range: work.range,
      }))
    },
    addWork() {
      this.workList.push({
        name: `第${this.numberConvertToUppercase(this.workList.length + 1)}天`,
        index: this.workList.length + 1,
        range: [startTime, endTime],
      })
    },
    confirmSchedual() {
      if (!this.cycleName) {
        this.$message.warning('请输入周期名称');
        return;
      }
      if (this.workList.filter((week) => !week.range).length > 0) {
        this.$message.warning('请选择时间');
        return;
      }
      let data = {
        cycle_name: this.cycleName,
        rest_day: this.restDay || 0,
        work_day: {},
      };
      this.workList.forEach((work) => {
        data.work_day[work.index] = {
          start_time: formatTime(work.range[0]),
          end_time: formatTime(work.range[1]),
        }
      });
      if (this.cycleId || this.cycleId === 0) {
        schedualCycleService.editCycle(this.cycleId, data)
          .then((res) => {
            this.closeDialog();
            this.$message.success('编辑成功');
            this.cycleList();
          }).catch(() => {
          this.$message.error('编辑失败');
        })
      } else {
        schedualCycleService.addCycle(data)
          .then((res) => {
            this.closeDialog();
            this.$message.success('新增成功');
            this.cycleList();
          }).catch(() => {
          this.$message.error('新增失败');
        })
      }

    },
  },
}
