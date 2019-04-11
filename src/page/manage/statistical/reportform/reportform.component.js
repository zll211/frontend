import {reportFormService} from './reportform.service';
import {formatDateTime, formatNumber} from '@/config/utils';
import {mapState} from 'vuex';

// 引入基本模板
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/legendScroll');

export default {
  components: {},
  computed: {
    ...mapState(['departments'])
  },
  data() {
    return {
      charts: null,
      users: [],
      userName: '',
      byDate: true,
      dateType: 'month',
      workDate: new Date(),
      searchParams: {},
      tableData: [],
      loading: false,
      specimenVisible: false,
      reportStartDate:'',
      reportEndDate:''
    }
  },
  async mounted() {
    this.typeCharts = echarts.init(this.$el.getElementsByClassName('report-form-type-chart')[0]);
    this.fromChart = echarts.init(this.$el.getElementsByClassName('report-form-from-chart')[0]);
    this.timeChart = echarts.init(this.$el.getElementsByClassName('report-form-time-chart')[0]);
    this.$root.$on('size-change', this.resize);
    this.reportChange();
  },
  methods: {
    resize() {
      this.typeCharts.resize();
      this.fromChart.resize();
      this.timeChart.resize();
    },
    reportChange() {
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
      this.reportStartDate = startDate;
      this.reportEndDate = endDate;
      this.reportFormTypeList({
        type: this.byDate ? 'day' : 'month',
        start_date: startDate,
        end_date: endDate,
        field: ['type'],
      });
      this.reportFormFromList({
        type: this.byDate ? 'day' : 'month',
        start_date: startDate,
        end_date: endDate,
        field: ['from'],
      });
      this.reportFormTimeList({
        type: this.byDate ? 'day' : 'month',
        start_date: startDate,
        end_date: endDate,
        field: ['production_time', 'diagnosis_time'],
      });
    },
    async reportFormTypeList({field, type, start_date, end_date}) {
      return reportFormService.reportFormList(Object.assign({
        type,
        start_date,
        end_date,
        field,
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
            if (echartData[date] && echartData[date][`${type}`]) {
              _series[type].data.push(echartData[date][`${type}`]);
            } else {
              _series[type].data.push(0);
            }
          })
        });
        let series = [];
        for (let prop in _series) {
          series.push(_series[prop]);
        }
        this.drawLine(this.typeCharts, '标本类型统计', typeList, xAxis, series);
      })
    },

    async reportFormFromList({field, type, start_date, end_date}) {
      return reportFormService.reportFormList(Object.assign({
        type,
        start_date,
        end_date,
        field,
      }, this.searchParams)).then((res) => {
        const echartData = res.data.data;
        const xAxis = Object.keys(echartData);
        let _series = {};
        const typeList = this.departments.map((item) => item.inspection_department_name);
        typeList.forEach((type) => {
          if (!_series[type]) {
            _series[type] = {
              name: type,
              type: 'line',
              data: [],
            }
          }
          xAxis.forEach((date) => {
            if (echartData[date] && echartData[date][`${type}`]) {
              _series[type].data.push(echartData[date][`${type}`]);
            } else {
              _series[type].data.push(0);
            }
          })
        });
        let series = [];
        for (let prop in _series) {
          series.push(_series[prop]);
        }
        this.drawLine(this.fromChart, '标本来源统计', typeList, xAxis, series);
      })
    },

    async reportFormTimeList({field, type, start_date, end_date}) {
      return reportFormService.reportFormList(Object.assign({
        type,
        start_date,
        end_date,
        field,
      }, this.searchParams)).then((res) => {
        const echartData = res.data.data;
        const xAxis = Object.keys(echartData);
        let _series = {};
        const typeList = ['制片平均时间', '诊断平均时间'];
        typeList.forEach((type) => {
          if (!_series[type]) {
            _series[type] = {
              name: type,
              type: 'line',
              data: [],
            }
          }
          xAxis.forEach((date) => {
            if (echartData[date] && echartData[date][`${type}`]) {
              _series[type].data.push(echartData[date][`${type}`]);
            } else {
              _series[type].data.push(0);
            }
          })
        });
        let series = [];
        for (let prop in _series) {
          series.push(_series[prop]);
        }
        this.drawLine(this.timeChart, '制片/诊断平均时间统计', typeList, xAxis, series);
      })
    },
    drawLine(chart, text, legend, xAxis, series) {
      // 绘制图表
      chart.clear();
      chart.setOption({
        title: {text: text, left: 'center'},
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
    exportTypeData() {
      let params = {
        start_date: this.reportStartDate,
        end_date: this.reportEndDate,
        field:['type'],
      }
      reportFormService.exportData(params).then((res) =>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '病理报告.pdf');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
      }).finally((e) =>{

      })
    },
    exportFromData() {
      let params = {
        start_date: this.reportStartDate,
        end_date: this.reportEndDate,
        field:['from'],
      }
      reportFormService.exportData(params).then((res) =>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '病理报告.pdf');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
      }).finally((e) =>{

      })
    },
    exportTimeData() {
      let params = {
        start_date: this.reportStartDate,
        end_date: this.reportEndDate,
        field:['production_time','diagnosis_time'],
      }
      reportFormService.exportData(params).then((res) =>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '病理报告.pdf');
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
