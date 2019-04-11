import {workLoadService} from './workload.service';
import pisMoreSearch from '../../../../common/components/pisMoreSearch';
import {formatDateTime, formatNumber} from '@/config/utils';
import {mapState} from 'vuex';

// 引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入柱状图组件
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/legendScroll');

const typeList = ['登记', '取材', '脱水', '包埋', '切片', '染色', '封片', '切片扫描', '切片绑定', '诊断', '打印报告', '发放报告'];

export default {
  components: {
    pisMoreSearch,
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      users: state => state.userList.map((user) => {
        return {
          label: user.realname,
          value: user.name,
        };
      }),
    }),
  },
  data() {
    return {
      charts: null,
      userName: '',
      byDate: true,
      dateType: 'month',
      workDate: new Date(),
      mychart1StartDate: '',
      mychart1EndDate: '',
      searchFormList: [{
        type: 'select',
        name: 'type',
        model: 'role',
        placeholder: '请选择统计类型',
        clearable: false,
        selectOptions: [{
          label: '角色',
          value: 'role',
        }, {
          label: '医生',
          value: 'person',
        }, {
          label: '部门',
          value: 'department',
        }],
      }, {
        label: '时间范围',
        labelWidth: '80px',
        type: 'daterange',
        name: 'range',
        clearable: false,
        model: [new Date(new Date() - 3600 * 1000 * 24* 30), new Date()],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            },
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [date, date]);
            },
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
              picker.$emit('pick', [start, end]);
            },
          }],
        },
      }],
    };
  },
  async mounted() {
    this.charts = echarts.init(this.$el.getElementsByClassName('myChart')[0]);
    this.charts1 = echarts.init(this.$el.getElementsByClassName('myChart1')[0]);
    this.workList({
      type: 'role',
      start_date: formatDateTime(new Date(new Date() - 3600 * 1000 * 24 * 30)).substr(0, 10),
      end_date: formatDateTime(new Date()).substr(0, 10),
    });
    this.$root.$on('size-change', this.resize);
    this.userName = this.users[0] ? this.users[0].value : undefined;
    this.workDateChange();
  },
  methods: {
    resize() {
      this.charts.resize();
      this.charts1.resize();
    },
    searchChange(params) {
      params.start_date = params.range ? formatDateTime(params.range[0]).substr(0, 10) : formatDateTime(new Date() - 3600 * 1000 * 24).substr(0, 10);
      params.end_date = params.range ? formatDateTime(params.range[1]).substr(0, 10) : formatDateTime(new Date()).substr(0, 10);
      this.workList(params);
    },
    drawEchart(legend, xAxis, series) {
      // 绘制图表
      this.charts.clear();
      this.charts.setOption({
        title: {text: `工作量统计`, left: 'center'},
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        dataZoom: [{
          type: 'inside',
        }, {
          type: 'slider',
        }],
        legend: {
          top: 50,
          data: legend,
          type: 'scroll',
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          minInterval: 1,
        },
        series: series,
      });
    },
    workList({type, start_date, end_date}) {
      workLoadService.workList({type, start_date, end_date})
        .then((res) => {
          const echartData = res.data.data;
          const xAxis = Object.keys(echartData);
          let _series = {};
          if (~xAxis.indexOf('完成')) {
            xAxis.splice(xAxis.indexOf('完成'),1);
          }
          xAxis.forEach((prop, index) => {
            if (echartData[prop]) {
              typeList.forEach((type) => {
                if (!_series[type]) {
                  _series[type] = {
                    name: type,
                    type: 'bar',
                    stack: prop,
                    data: [],
                  };
                }
                const data = echartData[prop].find((item) => item.work_type === type);
                if (data) {
                  _series[type].data.push(data.num);
                } else {
                  _series[type].data.push(0);
                }
              });
            }
          });
          let series = [];
          for (let prop in _series) {
            series.push(_series[prop]);
          }
          this.drawEchart(typeList, xAxis, series);
        });
    },
    workDateChange() {
      let startDate, endDate;
      if (this.byDate) {
        startDate = `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth() + 1)}`;
        endDate = this.workDate.getMonth() + 2 <= 12 ?
          `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth() + 2)}` : `${this.workDate.getFullYear() + 1}-01`;
      } else {
        startDate = `${this.workDate.getFullYear()}-01-01`;
        endDate = `${this.workDate.getFullYear() + 1}-01-01`;
      }
      this.mychart1StartDate = startDate;
      this.mychart1EndDate = endDate;
      this.dateType = this.byDate ? 'month' : 'year';
      this.userWorkList({
        user_name: this.userName,
        type: this.byDate ? 'day' : 'month',
        start_date: startDate,
        end_date: endDate,
      });
    },
    async userWorkList({user_name, type, start_date, end_date}) {
      return workLoadService.userWorkList({
        user_name,
        type,
        start_date,
        end_date,
      }).then((res) => {
        const echartData = res.data.data;
        const xAxis = Object.keys(echartData);
        let _series = {};
        typeList.forEach((type) => {
          if (!_series[type]) {
            _series[type] = {
              name: type,
              type: 'line',
              data: [],
            };
          }
          xAxis.forEach((date) => {
            if (echartData[date] && echartData[date][type]) {
              _series[type].data.push(echartData[date][type]);
            } else {
              _series[type].data.push(0);
            }
          });
        });
        let series = [];
        for (let prop in _series) {
          series.push(_series[prop]);
        }
        this.drawLine(typeList, xAxis, series);
      });
    },
    drawLine(legend, xAxis, series) {
      // 绘制图表

      this.charts1.clear();
      this.charts1.setOption({
        title: {text: `工作量统计`, left: 'center'},
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        dataZoom: [{
          type: 'inside',
        }, {
          type: 'slider',
        }],
        legend: {
          top: 50,
          data: legend,
          type: 'scroll',
          selected: {
            '登记': true,
            '取材': false,
            '脱水': false,
            '包埋': false,
            '切片': false,
            '染色': false,
            '封片': false,
            '切片扫描': false,
            '切片绑定': false,
            '诊断': false,
            '打印报告': false,
            '发放报告': false,
          },
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          minInterval: 1,
        },
        series: series,
      });
    },
    exportDatafromMyChart() {
      let params = {
        type: this.searchFormList[0].model,
        start_date: formatDateTime(this.searchFormList[1].model[0]),
        end_date: formatDateTime(this.searchFormList[1].model[1]),
      };
      workLoadService.exportDataFromMyChart(params).then((res) => {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '表格统计.xls');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) => {
      }).finally((e) => {

      });
    },
    exportDatafromMyChart1() {
      let params = {
        user_name: this.userName,
        start_date: this.mychart1StartDate,
        end_date: this.mychart1EndDate,
      };
      workLoadService.exportDataFromMyChart1(params).then((res) => {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '表格统计.xls');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) => {
      }).finally((e) => {

      });
    },
  },
  destroyed() {
    this.$root.$off('size-change', this.resize);
  },
};
