<template>

  <main class="main-container">
  <div class="flex">
    <pis-more-search
      :form-id-list="[]"
      :search-form-list="searchFormList"
      @form-change="searchChange"
    ></pis-more-search>
    <el-button type="primary" size="small" @click="exportDatafromMyChart" style="height: 30px;margin-top: 5px;">导出</el-button>
  </div>
    <div class="chart-main">
      <div class="myChart" style="width: 100%;height: 500px"></div>
    </div>

    <div class="flex column">
      <el-form class="flex wrap align-items-center myChart1Form" label-position="right">
        <el-form-item class="form-item">
          <el-select size="small" v-model="userName"  @change="workDateChange">
            <el-option v-for="user in users" :key="user.value"
                       :label="user.label"
                       :value="user.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item">
          <el-switch
            style="display: block"
            v-model="byDate"
            inactive-color="#409eff"
            active-text="按月"
            inactive-text="按年"
            @change="workDateChange">
          </el-switch>
        </el-form-item>
        <el-form-item class="form-item">
          <el-date-picker
            size="small"
            :clearable="false"
            v-model="workDate"
            :type="dateType"
            placeholder="选择日期"
            @change="workDateChange">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" size="small" @click="exportDatafromMyChart1">导出</el-button>
      </el-form>
      <div class="chart-main">
        <div class="myChart1" style="width: 100%;height: 500px"></div>
      </div>
    </div>

  </main>

</template>

<script src="./workload.components.js"></script>

<style scoped lang="scss" src="./workload.scss"></style>
