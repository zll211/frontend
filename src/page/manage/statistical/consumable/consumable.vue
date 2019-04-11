<template>

  <main class="main-container">
    <div class="flex">
      <pis-more-search
        :form-id-list="[]"
        :search-form-list="searchFormList"
        @form-change="searchChange"
      ></pis-more-search>
      <!--<el-button type="primary" size="small" @click="exportData" style="height: 30px;margin-top: 5px;">导出</el-button>-->
    </div>

    <div class="chart-main">
      <div class="myChart" style="width: 100%;height: 500px"></div>
    </div>

    <div class="flex column">
      <el-form class="flex wrap align-items-center" label-position="right">
        <el-form-item class="form-item">
          <el-switch
            style="display: block"
            v-model="byDate"
            inactive-color="#409eff"
            active-text="按月"
            inactive-text="按年"
            @change="storageDateChange">
          </el-switch>
        </el-form-item>
        <el-form-item class="form-item">
          <el-date-picker
            size="small"
            :clearable="false"
            v-model="workDate"
            :type="dateType"
            placeholder="选择日期"
            @change="storageDateChange">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="chart-main">
        <div class="myChart1" style="width: 100%;height: 500px"></div>
      </div>
    </div>

  </main>

</template>

<script src="./consumable.components.js"></script>

<style scoped lang="scss" src="./consumable.scss"></style>
