<template>
  <main class="pis-list">
    <div class="load-list" v-show="loading">
      <i class="el-icon-loading"></i>
    </div>
    <div class="time-list-container" v-show="!loading">
      <p class="no-data" v-if="timeList.length===0">暂无数据</p>
      <div class="time-list-item flex" v-for="(item, timeIndex) in timeList"
           :key="timeIndex">
        <div class="line-container">
          <div class="v-line"></div>
        </div>
        <div class="flex-1">
          <div class="time-table-item">
            <div class="flex align-items-center relative">
              <div class="date-icon-container absolute">
                <div class="date-icon"></div>
              </div>
              <div class="time-head flex align-items-center flex-1">
                <img v-if="selection" class="checkbox"
                     @click="handleSelectionChange(timeIndex)"
                     :src="selectList[timeIndex].checkboxSrc"/>
                <div class="flex-1">
                  <span>病理号：<a>{{item.pathology_id}}</a></span>
                  <span>{{sortText}} {{item[sortProp]}}</span>
                  <span style="color: #ff6f6f" v-if="item.special_advice_status||item.technical_advice_status">医嘱</span>
                </div>
                <div v-if="expand" class="upfold"
                     @click="toggleExpand(timeIndex)">
                  <img :src="expandList[timeIndex].expandSrc">
                </div>
              </div>
            </div>
            <div class="time-table">
              <div class="flex">
                <div class="time-table-head"
                     v-for="(head, index) in tableHeaderList" :key="index"
                     :class="{'flex-1': !head.width}"
                     :style="{width: `${head.width}px`, minWidth: `${head['min-width']}px`, justifyContent: head.align}">
                  {{head.label}}
                </div>
              </div>
              <div class="flex">
                <div class="time-table-body"
                     v-for="(head, index) in tableHeaderList" :key="index"
                     :class="{'flex-1': !head.width}"
                     :style="{width: `${head.width}px`, minWidth: `${head['min-width']}px`, justifyContent: head.align}">
                  <div v-if="head.prop!=='_operate'"
                       v-html="timeList[timeIndex][head.prop]"></div>
                  <slot name="operateBtn" v-if="head.prop==='_operate'"
                        :row="timeList[timeIndex]">
                    <div v-html="timeList[timeIndex][head.prop]"></div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
          <div class="expand-table">
            <div class="flex align-items-center expand"
                 v-if="expandList[timeIndex].isExpand">
              <div class="time-expand-info"
                   v-for="(expand, index) in expandInfoList" :key="index"
                   :class="{'flex-1': !expand.width}"
                   :style="{width: `${expand.width}px`, minWidth: `${expand['min-width']}px`, justifyContent: expand.align}">
                <div v-html="timeList[timeIndex][expand.prop]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import {strSplice} from '@/config/utils';

  export default {
    name: 'pisList',
    created() {
    },
    data() {
      return {
        selectList: [],
        expandList: [],
      };
    },
    props: {
      sortProp: '',
      sortText: '',
      data: Array,
      tableHeaderList: {
        type: Array,
        default: function () {
          return [
            {
              'prop': 'base',
              'label': '基本信息',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': 'specimenName',
              'label': '标本信息',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': 'diagnosis',
              'label': '诊断意见',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': 'status',
              'label': '当前状态',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': '_operate',
              'label': '操作',
              'min-width': 120,
              'align': 'center',
            },
          ];
        },
      },
      expandInfoList: {
        type: Array,
        default: function () {
          return [
            {
              'prop': 'baseInfo',
              'label': '基本信息',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': 'specimenInfo',
              'label': '标本信息',
              'min-width': 120,
              'align': 'center',
            }, {
              'prop': 'diagnosisInfo',
              'label': '诊断意见',
              'min-width': 120,
              'align': 'center',
            }
          ];
        },
      },
      selection: false,
      expand: true,
      loading: false,
    },
    computed: {
      timeList: function () {
        this.selectList = this.data.map(() => ({
          checkboxSrc: '../assets/img/unchecked.png',
        }));
        this.expandList = this.data.map(() => ({
          expandSrc: '../assets/img/down.png',
          isExpand: false,
        }));
        return this.data.map((item) => (Object.assign({
          pathology_id: item.pathology_id || item.id,
          base: item.base || `${item.patient_name} ${item.gender} ${item.age}`,
          specimenName: item.specimen ? this.getSpecimen(item.specimen) : '无',
          diagnosis: this.getDiagnosisInfo(item, 'part'),
          status: `${item.status}`,
          baseInfo: this.getBaseInfo(item),
          specimenInfo: this.getSpecimenInfo(item),
          diagnosisInfo: this.getDiagnosisInfo(item, 'all'),
        }, item)));
      }
    },
    methods: {
      handleSelectionChange(index) {
        if (this.selectList[index].checkboxSrc === '../assets/img/unchecked.png') {
          this.selectList[index].checkboxSrc = '../assets/img/checked.png';
        } else {
          this.selectList[index].checkboxSrc = '../assets/img/unchecked.png';
        }
        let selectList = [];
        this.selectList.filter((item, index) => {
          if (item.checkboxSrc === '../assets/img/checked.png') {
            selectList.push(this.timeList[index]);
          }
        });
        this.$emit('selection-change', selectList);
      },
      toggleExpand(index) {
        let type;
        if (this.expandList[index].isExpand) {
          this.expandList[index].expandSrc = '../assets/img/down.png';
          type = 'up';
        } else {
          this.expandList[index].expandSrc = '../assets/img/up.png';
          type = 'down';
        }
        this.expandList[index].isExpand = !this.expandList[index].isExpand;
        this.$emit('expand-change', {type: type, index: index});
      },
      getSpecimen(specimen) {
        let specimen_name = '';
        specimen.data.forEach((item) => {
          specimen_name = `${specimen_name}
          <p>${item.specimen_name}</p>`;
        });
        return specimen_name || '无';
      },
      getBaseInfo(info) {
        return `<p>病例类型：${info.case_type || '无'}</p>
<p>送检医院：${info.inspection_hospital || '无'}</p>
<p>送检医生：${info.inspection_doctor || '无'}</p>
<p>送检部门：${info.inspection_department || '无'}</p>
<p>送检时间：${info.inspection_date || '无'}</p>
<p>登记时间：${info.receive_at || '无'}</p>
<p>登记医生：${info.receive_doctor || '无'}</p>`
      },
      getSpecimenInfo(info) {
        let specimenInfo = '';
        if (info.specimen) {
          specimenInfo = `<p>标本类型：${info.specimen_type || '无'}， 标本数量：${info.specimen_num || '无'}</p>`;
          info.specimen.data.forEach((item, index) => {
            specimenInfo = `${specimenInfo}
          <p>标本名称${index + 1}：${item.specimen_name || '无'}</p>`;
          });
        }
        if (info.drawMaterial && info.drawMaterial.data) {
          specimenInfo = `${specimenInfo}<p>取材时间：${info.drawMaterial.data.draw_material_at || '无'}</p>
<p>取材医生：${info.drawMaterial.data.draw_materialer || '无'}</p>`;
        }
        return specimenInfo || '无';
      },
      getDiagnosisInfo(info, type) {
        let diagnosisInfo = '';
        if (info.report && info.report.data) {
          if (type === 'all') diagnosisInfo = `<p>${info.report.data.diagnostic_opinion || '无'}</p>`;
          if (type === 'part') {
            diagnosisInfo = info.report.data.diagnostic_opinion || '无';
            if (diagnosisInfo.length > 30) {
              diagnosisInfo = diagnosisInfo.substring(0, 30) + '...';
            }
          }
        }
        return diagnosisInfo;
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '../../style/variables';

  .pis-list {
    // padding: 0 10px;
    width: 100%;
    .time-list-container {
      position: relative;
      .time-list-item {
        margin: 0 0 26px 30px;
        .time-table-item {
          position: relative;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          .time-head {
            font-size: 16px;
            position: relative;
            height: 40px;
            padding: 0 23px;
            line-height: 40px;
            background-color: #EEEEEE;
            font-weight: bold;
            color: $_pm-default-table-color;
            a {
              color: $_pm-base-color;
            }
            span {
              & + span {
                margin-left: 28px;
              }
            }
            .checkbox {
              cursor: pointer;
              width: 22px;
              height: 22px;
              margin: 0 16px 0 0;
            }
            .upfold {
              margin: 0 13px 0 0;
              cursor: pointer;
              img {
                height: 16px;
                width: 20px;
              }
            }
          }
          .time-table {
            background-color: #fff;
            .time-table-head {
              display: flex;
              align-items: center;
              height: 40px;
              padding: 5px;
              border-bottom: 2px solid #F0F0F0;
              border-left: 2px solid #F0F0F0;
              font-size: 14px;
              font-weight: bold;
              color: $_pm-tree-color;
              box-sizing: border-box;
              &:nth-child(1) {
                border-left: none;
              }
            }
            .time-table-body {
              @extend .time-table-head;
              height: auto;
              min-height: 60px;
              font-weight: normal;
              border-bottom: none;
              word-break: break-all;
            }
          }
        }
        .expand-table {
          margin: -1px 20px 0;
          .expand {
            border-radius: 6px;
            min-height: 110px;
            background-color: #fff;
            padding: 40px 10px;
          }
          .time-expand-info {
            display: flex;
            align-items: center;
            min-height: 110px;
            height: 100%;
            border-right: 2px solid #F0F0F0;
            font-size: 14px;
            color: $_pm-tree-color;
            box-sizing: border-box;
            line-height: 25px;
            &:nth-last-child(1) {
              border-right: none;
            }
          }
        }
      }
      .no-data {
        font-size: 16px;
        text-align: center;
        color: $_pm-default-light-color;
      }
    }
    .load-list {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 200px;
      i {
        font-size: 48px;
        color: $_pm-base-color;
      }
    }
  }

  .line-container {
    position: absolute;
    left: 0;
    top: 15px;
    bottom: 0;
    width: 30px;
    min-width: 30px;
    .v-line {
      width: 1px;
      margin-left: 7px;
      height: 100%;
      background-color: #DADADA;
    }
  }

  .date-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    left: -33px;
    width: 21px;
    height: 21px;
    z-index: 10;
    background-color: #F8F8F8;
    .date-icon {
      width: 14px;
      height: 14px;
      background: #01D0B0;
      box-shadow: 0 0 4px 0 #01D0B0;
      border-radius: 50%;
      &:after {
        position: absolute;
        content: '';
        top: 8px;
        left: 8px;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
</style>
