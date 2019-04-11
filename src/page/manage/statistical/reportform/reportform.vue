<template>
  <main class="main-container report-form">
    <div class="flex wrap align-items-center">
      <el-form class="flex wrap align-items-center" label-position="right">
        <el-form-item class="form-item">
          <el-switch
            style="display: block"
            v-model="byDate"
            inactive-color="#409eff"
            active-text="按月"
            inactive-text="按年"
            @change="reportChange">
          </el-switch>
        </el-form-item>
        <el-form-item class="form-item">
          <el-date-picker
            size="small"
            :clearable="false"
            v-model="workDate"
            :type="dateType"
            placeholder="选择日期"
            @change="reportChange">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="exportTypeData" style="margin-top: -4px;">导出标本类型统计表</el-button>
      <el-button type="primary" size="small" @click="exportFromData" style="margin-top: -4px;">导出标本来源统计表</el-button>
      <el-button type="primary" size="small" @click="exportTimeData" style="margin-top: -4px;">导出平均时间统计表</el-button>
    </div>

    <div class="flex wrap">
      <div class="chart-main flex-1">
        <div class="report-form-type-chart"></div>
      </div>
      <div class="chart-main flex-1">
        <div class="report-form-from-chart"></div>
      </div>
    </div>
    <div class="flex wrap">
      <div class="chart-main flex-1">
        <div class="report-form-time-chart"></div>
      </div>
      <!--<div class="chart-main flex-1">
        <div class="report-form-from-chart"></div>
      </div>-->
    </div>

    <el-dialog :visible.sync="specimenVisible">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="类型"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="case_type"
          label="来源"
          align="center">
        </el-table-column>
        <el-table-column
          prop="treat_type"
          label="制片平均时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="诊断平均时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop='age'
          label="免疫组化按类型"
          align="center"
          width="70">
        </el-table-column>
      </el-table>
    </el-dialog>
  </main>
</template>

<script src="./reportform.component.js"></script>

<style scoped lang="scss" src="./reportform.scss"></style>
