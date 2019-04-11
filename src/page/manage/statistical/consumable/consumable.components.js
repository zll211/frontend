import {workLoadService} from './consumable.service';
import pisMoreSearch from '../../../../common/components/pisMoreSearch';
import {formatTime, formatNumber} from '@/config/utils';
import {mapState} from 'vuex';
import {userService} from '../../system/users/users.service';
import {consumablesService} from "./consumable.service";
import {formatDateTime} from "../../../../config/utils";

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

export default {
  components: {
    pisMoreSearch,
  },
  computed: {
  },
  data() {
    return {
      charts: null,
      users: [],
      userName: '',
      byDate: true,
      allMaterials:[],
      dateType: 'month',
      workDate: new Date(),
      searchFormList: [{
        label: '时间范围',
        labelWidth: '80px',
        type: 'daterange',
        name: 'range',
        clearable: false,
        model: [new Date(new Date() - 3600 * 1000 * 24 * 30), new Date()],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [date, date]);
            }
          }, {
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
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }]
    }
  },
  async mounted() {
    this.charts = echarts.init(this.$el.getElementsByClassName('myChart')[0]);
    this.charts1 = echarts.init(this.$el.getElementsByClassName('myChart1')[0]);
    await this.materialsNumList({
      start_date: formatDateTime(new Date(new Date() - 3600 * 1000 * 24 * 30)).substr(0, 10),
      end_date: formatDateTime(new Date()).substr(0, 10),
    });
    this.$root.$on('size-change', this.resize);
    this.storageDateChange();
  },
  methods: {
    resize() {
      this.charts.resize();
      this.charts1.resize();
    },
    searchChange(params) {
      params.start_date = params.range ? formatDateTime(params.range[0]).substr(0, 10) : formatDateTime(new Date() - 3600 * 1000 * 24).substr(0, 10);
      params.end_date = params.range ? formatDateTime(params.range[1]).substr(0, 10) : formatDateTime(new Date()).substr(0, 10);
      this.materialsNumList(params);
    },
    drawEchart(xAxis, series) {
      // 绘制图表
      this.charts.clear();
      this.charts.setOption({
        title: {text: `耗材消耗数量统计图`, left: 'center'},
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            type:'bar',
            label:{
              show:true,
              position:'top'
            },
            data: series,
            itemStyle:{
              color:'#01d0b0'
            }
          }
          ],
      });
    },
    async materialsNumList({start_date, end_date}) {
      consumablesService.materialsNumList({action_type:'出库', start_date, end_date})
        .then((res) => {
          const echartData = res.data.data;
          const xAxis = echartData.map((item) => {
            return item.name;
          });
          this.allMaterials = echartData.map((item) => {
            return item.name;
          });
          const series = echartData.map((item) => {
            return item.num;
          });
          this.drawEchart(xAxis, series);
        })
    },

    storageDateChange() {
      let startDate, endDate;
      if (this.byDate) {
        startDate = `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth() + 1)}`;
        endDate = this.workDate.getMonth() + 2 <= 12 ?
          `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth() + 2)}` : `${this.workDate.getFullYear() + 1}-01`;
      } else {
        startDate = `${this.workDate.getFullYear()}-01-01`;
        endDate = `${this.workDate.getFullYear()+1}-01-01`;
      }
      this.dateType = this.byDate ? 'month' : 'year';
      this.materialsTrendList({
        type: this.byDate ? 'month' : 'year',
        start_date: startDate,
        end_date: endDate,
      });
    },
    async materialsTrendList({type, start_date, end_date}) {
      return consumablesService.materialsTrendList({
        type,
        start_date,
        end_date,
        action_type: '出库'
      }).then((res) => {
        const echartData = res.data.data;
        const xAxis = Object.keys(echartData);
        let _series = {};
        this.allMaterials.forEach((type) => {
          if (!_series[type]) {
            _series[type] = {
              name: type,
              type: 'line',
              data: [],
            }
          }
          xAxis.forEach((date) => {
            if (echartData[date] && echartData[date][type]) {
              _series[type].data.push(echartData[date][type]);
            } else {
              _series[type].data.push(0);
            }
          })
        });
        let series = [];
        for (let prop in _series) {
          series.push(_series[prop]);
        }
        this.drawLine(this.allMaterials, xAxis, series);
      })
    },
    drawLine(legend, xAxis, series) {
      // 绘制图表
      this.charts1.clear();
      this.charts1.setOption({
        title: {text: `耗材消耗情况统计图`, left: 'center'},
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
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
          minInterval: 1
        },
        series: series,
      });
    },
   /* exportData() {
      let params = {
        start_date:formatDateTime(this.searchFormList[0].model[0]),
        end_date:formatDateTime(this.searchFormList[0].model[1]),
      }
      consumablesService.exportData(params).then((res)=>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '病理报告.pdf');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
        console.log(err);
      }).finally((e) =>{

      })
    },*/
  },
  destroyed() {
    this.$root.$off('size-change', this.resize);
  },
}
