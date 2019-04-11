<template>
  <main class="main-container schedual-list-page">
    <div class="operate-methods flex justify-content-end">
      <pis-icon class="add-btn"
                :is-button="true"
                icon-name="el-icon-plus"
                @icon-click="createSchedual"
                icon-text='新增排班规则'></pis-icon>
      <pis-icon
        class="refresh"
        icon-name="el-icon-refresh"
        icon-text="刷新"
        @icon-click="refreshPage"></pis-icon>
    </div>
    <div class="flex align-items-center justify-content-center">
      <el-button type="primary" size="small" @click="lastWeek">上周</el-button>
      <el-button type="text" size="medium" style="font-size: 28px">排班表</el-button>
      <el-button type="primary" size="small" @click="nextWeek">下周</el-button>
    </div>
    <div class="schedual-container"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">
      <div class="schedual-header flex">
        <p class="top-left bold">医生</p>
        <div class="flex-1">
          <div class="flex header">
            <div class="flex-1 header-column bold"
                 v-for="(week, index) in weekHeaderList"
                 :key="index">{{week}}
            </div>
          </div>
          <div class="flex header">
            <div class="flex-1 header-column bold"
                 v-for="(date, index) in dateHeaderList"
                 :key="index">{{date}}
            </div>
          </div>
        </div>
      </div>
      <div class="schedual-body">
        <div class="schedual-body-row" v-for="user in userBodyList"
             :key="user.id">
          <p class="body-column" style="width: 100px">{{user.name}}</p>
          <div class="flex flex-1 body">
            <div class="flex-1 body-column"
                 v-for="(state, index) in user.stateList"
                 :key="index">{{state}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog width="500px" title="新增排班" :visible.sync="schedualViewDialog"
               center
               @close="closeDialog">
      <pis-tab v-model="activeTabName"
               :tab-list="[{label:'固定',name:'fixed'},{label:'周期',name:'cycle'}]"></pis-tab>
      <el-row>
        <el-col v-if="schedualViewDialog" class="flex align-items-center justify-content-between">
          <span>排班医生</span>
          <el-select v-model="schedualUser" multiple placeholder="请选择排班医生">
            <el-option
              v-for="item in schedualUserList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col v-show="activeTabName==='fixed'"
                v-for="(week,index) in weekList" :key="index"
                class="week-item flex align-items-center justify-content-between">
          <pis-checkbox v-model="week.checked">
            <span style="margin-left: 20px">{{week.name}}</span>
          </pis-checkbox>
          <el-time-picker
            size="small"
            v-show="week.checked"
            is-range
            v-model="week.range"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
          <span v-show="!week.checked">休息</span>
        </el-col>
        <el-col v-show="activeTabName==='cycle'"
                class="week-item flex align-items-center justify-content-between">
          <span>排班周期</span>
          <el-select v-model="schedualCycle" placeholder="请选择排班周期">
            <el-option
              v-for="item in cycles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmSchedual()" size="small">确 定
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script src="./list.component.js"></script>

<style lang="scss">
  @import "../../../../style/variables";

  .schedual-list-page {
    .refresh {
      margin-left: 40px;
      .icon {
        color: $_pm-fail-color;
      }
    }
    .schedual-container {
      // background: #fff;
      .schedual-header {
        margin: 20px 0 0 0;
        background: #fff;
        .header {
          height: 40px;
          line-height: 40px;
          border: 1px solid $_pm-default-border-color;
          border-left: none;
          &:nth-child(1) {
            border-bottom: none;
          }
          .header-column {
            text-align: center;
            border-left: 1px solid $_pm-default-border-color;
          }
        }
        .top-left {
          display: flex;
          line-height: 80px;
          width: 100px;
          justify-content: center;
          box-sizing: border-box;
          border-top: 1px solid $_pm-default-border-color;
          border-left: 1px solid $_pm-default-border-color;
          border-bottom: 1px solid $_pm-default-border-color;
        }
      }
      .schedual-body {
        .schedual-body-row {
          background: #fff;
          display: flex;
          // border: 1px solid $_pm-default-border-color;
          .body-column {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80px;
            border-left: 1px solid $_pm-default-border-color;
            border-bottom: 1px solid $_pm-default-border-color;
            box-sizing: border-box;
            word-break: break-all;
          &:last-child {
              border-right: 1px solid $_pm-default-border-color;
            }
          }
        }
      }
    }
    .el-dialog__body {
      .pis-checkbox {
        margin-top: 0;
      }
      padding-top: 0;
      .week-item {
        margin-top: 15px;
        width: 100%;
        height: 42px;
      }
    }
  }
</style>
