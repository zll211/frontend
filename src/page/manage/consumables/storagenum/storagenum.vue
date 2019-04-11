<template>
  <div class="storagenum-page main-container">
    <pis-search-head
      placeholder="物料编码/名称"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      @select-change="selectChange"
      :searchFormList="searchFormList">
      <!--<div class="flex align-items-center pointer" @click="exportStoragenumList" style="margin-right: 30px">
        <i class="el-icon-download"></i>
        <span class="refresh-text">导出</span>
      </div>-->
    </pis-search-head>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="tablePageSize"
      @page-size-change="handleSizeChange">
    </pis-page-size>
    <el-table
      ref="storagenumTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      highlight-current-row>
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        label="物料编码"
        prop="consumables_id"
        align="center"
        fixed>
        <template slot-scope="scope">
          <a @click="viewMaterials(scope.row, scope.row.id)" style="color: #01cfb1;text-decoration:underline;cursor: pointer">{{scope.row.consumables_id}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="物料名称"
        prop="consumables_name"
        align="center"
        fixed>
      </el-table-column>
      <el-table-column
        label="规格型号"
        prop="model_specification"
        align="center">
      </el-table-column>
      <el-table-column
        label="计量单位"
        prop="unit"
        align="center">
      </el-table-column>
      <el-table-column
        label="品牌"
        prop="brand"
        align="center">
      </el-table-column>
      <el-table-column
        label="供应商"
        prop="supplier"
        align="center">
      </el-table-column>
      <el-table-column
        label="现存量"
        prop="sum"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination class="flex justify-content-center"
                   @current-change="handleCurrentChange"
                   background
                   :page-size="pagination.per_page"
                   :current-page="pagination.current_page"
                   layout="prev, pager, next"
                   :total="pagination.total">
    </el-pagination>

    <el-dialog title="入库&出库记录" :visible.sync="storagenumDialog" center width="70%">
      <pis-tab
        v-model="storageTab"
        :tab-list="[{label:'入库记录',name:'入库记录'},{label:'出库记录',name:'出库记录'}]"
        @tab-click="storageTabHandleClick">
      </pis-tab>
      <el-table
        ref="storagenumTable"
        v-loading="dialogTableloading"
        :data="storageTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        highlight-current-row
        show-summary
        :summary-method="getSummaries">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          v-for="(item,index) in this.action_type === '入库'?storageinColumnList:storageoutColumnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :fixed="item.fixed"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
        >
        </el-table-column>
      </el-table>
      <el-pagination class="flex justify-content-center"
                     @current-change="dialogTableHandleCurrentChange"
                     background
                     :page-size="dialogTablePagination.per_page"
                     :current-page="dialogTablePagination.current_page"
                     layout="prev, pager, next"
                     :total="dialogTablePagination.total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script src="./storagenum.component.js"></script>
<style lang="scss" src="./storagenum.scss"></style>
