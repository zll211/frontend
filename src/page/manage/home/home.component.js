import {homeService} from "./home.service";
import pisTitle from "../../../common/components/pisTitle";
import {mapState} from 'vuex';
import {userService} from "../system/users/users.service";
import {workLoadService} from "../statistical/workload/workload.service";
import {formatDateTime, formatNumber} from "../../../config/utils";
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

import routineDrawIcon from '../../../assets/img/routineDraw-icon.png';
import frozenDrawIcon from '../../../assets/img/frozenDraw-icon.png';
import routineProductionIcon from '../../../assets/img/routineProduction-icon.png';
import frozenProductionIcon from '../../../assets/img/frozenProduction-icon.png';
import cellProductionIcon from '../../../assets/img/cellProduction-icon.png';
import routineDiagnoseIcon from '../../../assets/img/routineDiagnosis-icon.png';
import frozenDiagnoseIcon from '../../../assets/img/frozenDiagnosis-icon.png';
import cellDiagnoseIcon from '../../../assets/img/cellDiagnosis-icon.png';
import reportIcon from '../../../assets/img/report-icon.png';
import specialAdviceIcon from '../../../assets/img/special-icon.png';

const typeList = ['登记', '取材', '脱水', '包埋', '切片', '染色', '封片', '切片扫描', '切片绑定', '诊断', '打印报告', '发放报告'];
const permissionList = ['常规取材', '冰冻取材', '常规制片', '冰冻制片', '细胞制片', '常规诊断', '术中冰冻', '细胞诊断', '报告管理', '特检医嘱'];

export default {
  components: {
    pisTitle
  },
  data() {
    return {
      loading: false,
      timeoutShow: false,
      collectShow: false,
      hasPermission: false,
      userInfo: {},
      userRole: [],
      userPermission: [],
      displayList: [],
      allDisplayList: [
        {name: '常规取材', path: '/specimen/normal', imgSrc: routineDrawIcon, number: '0', key: 'routineDraw'},
        {name: '冰冻取材', path: '/specimen/frozen', imgSrc: frozenDrawIcon, number: '0', key: 'frozenDraw'},
        {name: '常规制片', path: '/production/normal', imgSrc: routineProductionIcon, number: '0', key: 'routineProduction'},
        {name: '冰冻制片', path: '/production/frozen', imgSrc: frozenProductionIcon, number: '0', key: 'frozenProduction'},
        {name: '细胞制片', path: '/production/cell', imgSrc: cellProductionIcon, number: '0', key: 'cellProduction'},
        {name: '常规诊断', path: '/diagnosis/normal', imgSrc: routineDiagnoseIcon, number: '0', key: 'routineDiagnose'},
        {name: '术中冰冻', path: '/diagnosis/frozen', imgSrc: frozenDiagnoseIcon, number: '0', key: 'frozenDiagnose'},
        {name: '细胞诊断', path: '/diagnosis/cell', imgSrc: cellDiagnoseIcon, number: '0', key: 'cellDiagnose'},
        {name: '报告管理', path: '/desk/report', imgSrc: reportIcon, number: '0', key: 'report'},
        {name: '特检医嘱', path: '', imgSrc: specialAdviceIcon, number: '0', key: 'specialAdvice'}
      ],
      isManager: false,
      workDate: new Date(),
      loginTime: '',
      specimenNumber: '0',
      productionNumber: '0',
      diagnosisNumber: '0',
      reportNumber: '0',
      screenWidth: document.body.clientWidth,
      collectNumber: '0',
      technical_advice_count: '0',
      special_inspection_advice_count: '0',
      other_hospital_count: '0',
      routine_timeout_count: '0',
      cell_timeout_count: '0',
      frozen_timeout_count: '0',
    };
  },

  created() {
    this.loading = true;
    this.loginTime = window.sessionStorage.getItem("loginTime");
    this.getUserPermission();
  },
  async mounted() {
    this.charts1 = echarts.init(this.$el.getElementsByClassName('myChart1')[0]);
    this.$root.$on('size-change', this.resize);
    await this.getUserInfo();
    this.getCaseStatus();
    this.workDateChange();
  },
  watch: {},
  computed: {
    ...mapState(['user']),
  },
  methods: {
    to(route) {
      this.$router.push(`${route}`);
    },
    async getUserInfo() {
      return userService.userInfo(window.sessionStorage.getItem('userId')).then((res) => {
        this.userRole = res.body.data.roles.data.map((item) => {
          return item.name;
        });
        if (!!~this.userRole.findIndex(item => item === '管理员')) {
          this.isManager = true;
        } else {
          this.isManager = false;
        }
        this.userInfo.realname = res.body.data.realname;
        this.userInfo.organization_name = res.body.data.organization.data.organization_name;
        this.userInfo.role = res.body.data.roles.data.map((item) => {
          return item.name
        }).join(' ');
        return this.userInfo.name = res.body.data.name;
      }).catch((err) => {

      }).finally((e) => {

      })
    },
    getUserPermission() {
      return userService.userPermission().then((res) => {
        let permissions = res.body.permissions;
        permissionList.forEach((item) => {
          let index = permissions.findIndex(per => per === item);
          if (index >= 0) {
            this.userPermission.push(permissions[index])
          }
        })
        if(this.userPermission.length === 0) {
          this.hasPermission = false;
        } else {
          this.hasPermission = true;
        }
        if(!!~permissions.findIndex(per => per === '超时病例')) {
          this.timeoutShow = true;
        } else{
          this.timeoutShow = false;
        }
        if(!!~permissions.findIndex(per => per === '病例收藏')) {
          this.collectShow = true;
        } else{
          this.collectShow = false;
        }
      })
    },
    getCaseStatus() {
      homeService.getCaseStatus().then((res) => {
        if (this.isManager) {
          this.specimenNumber = res.body.data.routineDraw + res.body.data.frozenDraw;
          this.productionNumber = res.body.data.routineProduction + res.body.data.frozenProduction + res.body.data.cellProduction;
          this.diagnosisNumber = res.body.data.routineDiagnose + res.body.data.frozenDiagnose + res.body.data.cellDiagnose;
          this.reportNumber = res.body.data.report;
          this.special_inspection_advice_count = res.body.data.specialAdvice;
        } else {
          this.userPermission.forEach((permission) => {
            let routineDranIndex = this.allDisplayList.findIndex(item => item.name === permission);
            this.allDisplayList[routineDranIndex].number = res.body.data[this.allDisplayList[routineDranIndex].key];
            this.displayList.push(this.allDisplayList[routineDranIndex]);
          })
        }
        this.routine_timeout_count = res.body.data.timeOut.big_specimen_timeout_count + res.body.data.timeOut.small_specimen_timeout_count;
        this.cell_timeout_count = res.body.data.timeOut.cell_timeout_count;
        this.frozen_timeout_count = res.body.data.timeOut.frozen_timeout_count;
        this.other_hospital_count = res.body.data.timeOut.block_timeout_count + res.body.data.timeOut.slide_time_count;
      }).finally(() => {
        this.loading = false;
      })
    },
    resize() {
      this.screenWidth = document.body.clientWidth;
      this.charts1.resize();
    },
    workDateChange() {
      if(!this.workDate) {
        this.workDate = new Date();
      }
      let startDate, endDate;
      startDate =  this.workDate.getMonth() !==0 ? `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth())}-${formatNumber(this.workDate.getDate())}`:`${this.workDate.getFullYear()-1}-12-${formatNumber(this.workDate.getDate()+1)}`;
      endDate = this.workDate.getMonth() + 1 <= 12 ?
        `${this.workDate.getFullYear()}-${formatNumber(this.workDate.getMonth() + 1)}-${formatNumber(this.workDate.getDate())}` : `${this.workDate.getFullYear() + 1}-01-${formatNumber(this.workDate.getDate())}`;

      this.userWorkList({
        user_name: this.userInfo.name,
        type: 'day',
        start_date: startDate,
        end_date: endDate,
      });

    },
    async userWorkList({user_name, type, start_date, end_date}) {
      return workLoadService.userWorkList({
        user_name,
        type,
        start_date,
        end_date
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
      }).catch((err) => {

      }).finally((e) => {
        this.loading = false;
      })
    },
    drawLine(legend, xAxis, series) {
      // 绘制图表
      this.charts1.clear();
      this.charts1.setOption({
        title: {show: 'false'},
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 50,
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
          top: 10,
          data: legend,
          selected: {
            '登记': true,
            '取材': true,
            '脱水': false,
            '包埋': false,
            '切片': false,
            '染色': false,
            '封片': true,
            '切片扫描': false,
            '切片绑定': false,
            '诊断': true,
            '打印报告': false,
            '发放报告': false,
          },
          type: 'scroll',
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          minInterval: 1,
          name: '每日操作数量',
          nameLocation: 'center',
          nameTextStyle: {
            fontSize: 14,
            padding: [0, 0, 10, 0]
          }
        },
        series: series,
      });
    },

  },
  destroyed() {
    this.$root.$off('size-change', this.resize);
  },
};
