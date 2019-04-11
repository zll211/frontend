<template>
  <main class="main-container">
    <pis-search-head
      ref="searchHead"
      :form-id-list="[2,3,4,5,6,7]"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab
      v-model="activeTabName"
      :tab-list="tabList"
      @tab-click="handleClick"></pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pagination.per_page"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <pis-list
      :loading="loading"
      :selection='false'
      :expand='true'
      :data="cases"
      sort-prop="updated_at"
      sort-text="送检时间">
      <template slot="operateBtn" slot-scope="scope">
        <el-button type="primary" size="mini"
                   v-show="activeTabName === 'wait_diagnosis'"
                   @click="diagnosis(scope.row.id)">诊断
        </el-button>
        <el-button type="primary" size="mini"
                   v-show="activeTabName === 'uncheck'"
                   @click="diagnosis(scope.row.id)">审核
        </el-button>
        <el-button type="primary" size="mini"
                   v-show="activeTabName === 'has_diagnosis'"
                   @click="diagnosis(scope.row.id)">查看
        </el-button>
      </template>
    </pis-list>
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

<script src="./consultation.component.js"></script>
