<template>
  <main class="log-page main-container">
    <!--<pis-search-head
      ref="searchHead"
      placeholder="操作人姓名"
      :form-id-list="[]"
      :search-form-list="searchFormList"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"></pis-search-head>-->
    <div class="flex justify-content-between align-items-center">
      <div>
        <el-select v-model="searchParams.user_id" size="small"
                   placeholder="请选择操作用户" @change="logList" clearable>
          <el-option v-for="user in users" :key="user.value" :value="user.value" :label="user.label"></el-option>
        </el-select>
        <el-date-picker
          size="small"
          v-model="rangeDate"
          type="datetimerange"
          clearable
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :options="pickerOptions"
          @change="selectChange">
        </el-date-picker>
      </div>
      <pis-icon
        class="refresh"
        icon-name="el-icon-refresh"
        icon-text="刷新"
        @icon-click="refreshPage"></pis-icon>
    </div>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pageSize"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="logs"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        v-for="data in tableHeaderList"
        :key="data.label"
        :fixed="data.fixed"
        :prop="data.prop"
        :label="data.label"
        :min-width="data['min-width']"
        :align="data.align">
      </el-table-column>
    </el-table>
    <el-pagination
      class="flex justify-content-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      :current-page="pagination.current_page"
      @current-change="currentChange">
    </el-pagination>
  </main>
</template>

<script src="./login.component.js"></script>

<style lang="scss" src="./login.scss"></style>
