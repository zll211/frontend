<template>
  <el-row class="slice-scan main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab
      v-model="activeTabName"
      :tab-list="tabList"
      @tab-click="handleTab">
    </pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pagination.per_page"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      :data="scans"
      @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" v-if="activeTabName!=='total'">
      </el-table-column>-->
      <el-table-column v-for="(item, index) in tableHeaderList"
                       :key="index" :prop="item.prop"
                       :label="item.label" :align="item.align"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
                     v-if="scope.row.status === '已扫描未绑定'"
                     @click="$router.push(`/slice/bind?id=${scope.row.pathology_id}`)">前去绑定
          </el-button>
          <el-button type="default" size="mini"
                     v-if="scope.row.status === '未扫描'"
                     @click="updateStatus(scope.row.id, '扫描中')">开始扫描
          </el-button>
          <el-button type="primary" size="mini"
                     v-if="scope.row.status === '扫描中'"
                     @click="updateStatus(scope.row.id, '已扫描未绑定')">扫描完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<pis-list
      :selection="selection"
      :data="scans"
      :table-header-list="tableHeaderList"
      :loading="loading"
      @selection-change="handleSelectionChange">
      <template slot="operateBtn" slot-scope="scope">
        <el-button type="primary" size="mini"
                   v-show="scope.row.status === '未扫描'"
                   @click="updateStatus(scope.row.id, '扫描中')">开始扫描
        </el-button>
        <el-button type="primary" size="mini"
                   v-show="scope.row.status === '扫描中'"
                   @click="updateStatus(scope.row.id, '已扫描未绑定')">扫描完成
        </el-button>
      </template>
    </pis-list>-->
    <el-pagination
      class="flex justify-content-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      :current-page="pagination.current_page"
      @current-change="currentChange">
    </el-pagination>
  </el-row>
</template>

<script src="./scan.components.js"></script>

<style scoped lang="scss" src="./scan.scss"></style>
