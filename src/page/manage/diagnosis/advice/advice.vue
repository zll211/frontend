<template>
  <el-row class="dadvice-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      :search-form-list="searchFormList"
      @select-change="selectChange"
    ></pis-search-head>

    <pis-tab v-model="activeTabName"
             :tab-list="tabList"
             @tab-click="handleClick">
    </pis-tab>

    <pis-page-size
      :total-count="pagination.total"
      :page-size="pagination.per_page"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      ref="pTable"
      v-loading="loading"
      :data="prods"
      :span-method="arraySpanMethod"
      @row-click="rowClick"
      @select="handleSelect"
      border
      :height="tableHeight"
      style="width: 100%">
      <el-table-column v-for="(data, index) in tableHeaderList"
                       :key="index"
                       :fixed="data.fixed"
                       :prop="data.prop"
                       :label="data.label"
                       :min-width="data['min-width']"
                       :align="data.align">
      </el-table-column>
      <el-table-column prop="operate" align="center" label="操作" fixed="right"
                       :width="160">
        <template slot-scope="scope">
          <div class="flex align-items-center justify-content-center">
            <el-select v-model="scope.row.result" clearable size="small" @change="changeResult(scope.row, $event)">
              <el-option v-for="(item,index) in specialResultList" :key="index" :value="item" :label="item"></el-option>
            </el-select>
          </div>
        </template>
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


  </el-row>
</template>

<script src="./advice.component.js"></script>

<style scoped lang="scss">

  .el-table {
    overflow-y: auto;
  }
</style>
