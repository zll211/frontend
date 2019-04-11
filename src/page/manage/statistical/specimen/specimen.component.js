import {specimenService} from './specimen.service';
import pisMoreSearch from '../../../../common/components/pisMoreSearch';
import {formatDateTime, formatNumber} from '@/config/utils';

// 引入基本模板
let echarts = require('echarts/lib/echarts');
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
  computed: {},
  data() {
    return {
      charts: null,
      users: [],
      userName: '',
      byDate: true,
      dateType: 'month',
      workDate: new Date(),
      searchParams: {},
      mychartStartDate:'',
      mychartEndDate:'',
      searchFormList: []
    }
  },
  async mounted() {
    this.charts = echarts.init(this.$el.getElementsByClassName('specimenChart')[0]);
    this.$root.$on('size-change', this.resize);
    this.specimenDateChange();
  },
  methods: {
    resize() {
      this.charts.resize();
    },
    searchChange(params) {
      this.searchParams = params;
      this.specimenDateChange();
    },
    specimenDateChange() {
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
      this.mychartStartDate = startDate;
      this.mychartEndDate = endDate;
      this.specimenList({
        type: this.byDate ? 'day' : 'month',
        start_date: startDate,
        end_date: endDate,
      });
    },
    async specimenList({user_name, type, start_date, end_date}) {
      return specimenService.specimenList(Object.assign({
        type,
        start_date,
        end_date
      }, this.searchParams)).then((res) => {
        const echartData = res.data.data;
        const xAxis = Object.keys(echartData);
        let _series = {};
        const typeList = this.searchParams.case_type ? [this.searchParams.case_type] : ['常规', '细胞', '冰冻'];
        typeList.forEach((type) => {
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
        this.drawLine(typeList, xAxis, series);
      })
    },
    drawLine(legend, xAxis, series) {
      // 绘制图表
      this.charts.clear();
      this.charts.setOption({
        title: {text: `标本统计`, left: 'center'},
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

    exportData() {
      let params = {
        start_date: this.mychartStartDate,
        end_date: this.mychartEndDate,
        case_type:this.searchParams.case_type,
        inspection_department:this.searchParams.inspection_department,
      }
      specimenService.exportData(params).then((res)=>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '表格统计.xls');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
      }).finally((e) =>{

      })
    }
  },
  destroyed() {
    this.$root.$off('size-change', this.resize);
  },
}
