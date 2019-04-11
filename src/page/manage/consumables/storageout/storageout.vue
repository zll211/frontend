<template>
  <div class="storageout-page main-container">
    <pis-search-head
      placeholder="出库单号"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      @select-change="selectChange"
      :searchFormList="searchFormList">
      <div class="flex align-items-center pointer" @click="storageoutBtn" style="margin-right: 30px">
        <i class="el-icon-plus"></i>
        <span class="refresh-text">出库</span>
      </div>
      <!--<div class="flex align-items-center pointer" @click="exportStorageoutList" style="margin-right: 30px">
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
      ref="storageoutTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      highlight-current-row>
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        label="出库单号"
        prop="stock_out_id"
        align="center"
        fixed>
        <template slot-scope="scope">
          <a @click="viewStorageout(scope.row, scope.row.id)" style="color: #01cfb1;text-decoration:underline;cursor: pointer">{{scope.row.stock_out_id}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="出库日期"
        prop="stock_out_at"
        align="center">
      </el-table-column>
      <el-table-column
        label="经办人"
        prop="handler"
        align="center">
      </el-table-column>
      <el-table-column
        label="出库备注"
        prop="remark"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="flex justify-content-center">
            <el-button type="primary" @click="editStorageoutBtn(scope.row,scope.row.id)" size="mini"> 修改</el-button>
          </div>
        </template>
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


    <!-- 出库单Dialog -->
    <el-dialog title="出库单" :visible.sync="storageoutDialog" center @close="closeStorageoutDialog" width="45%">
      <el-form :model="storageoutForm" :rules="storageoutFormRules" ref="storageoutForm" label-position="right" label-width="80px" size="small" class="add-stroagein-form" :disabled="storageoutFormAbled">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="领用人" prop="person">
              <el-select v-model="storageoutForm.person" auto-complete="on" clearable style="width: 100%">
                <el-option v-for="(item,index) in userList"
                           :key="index"
                           :value="item.realname"
                           :label="item.realname">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领用部门" prop="department">
              <!--<el-select v-model="storageoutForm.department" auto-complete="on" clearable style="width: 100%">
                <el-option v-for="(item,index) in departments"
                           :key="index"
                           :value="item.inspection_department_name"
                           :label="item.inspection_department_name">
                </el-option>
              </el-select>-->
              <el-input type="text" v-model="storageoutForm.department" clearable placeholder="领用部门"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="经办人" prop="handler">
              <el-select v-model="storageoutForm.handler" auto-complete="on" clearable style="width: 100%">
                <el-option v-for="(item,index) in userList"
                           :key="index"
                           :value="item.realname"
                           :label="item.realname">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库日期" prop="stock_out_at">
              <el-date-picker
                v-model="storageoutForm.stock_out_at"
                value-format="yyyy-MM-dd"
                type="date"
                style="width:100%"
                placeholder="出库日期"
                align="right"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="storageoutForm.remark" clearable placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button size="small" @click="chooseMaterialsBtn" :disabled="editDisabled">选择物料</el-button>
          <el-button size="small" @click="deleteChooseMaterials" :disabled="editDisabled">删除</el-button>
        </el-row>
        <el-row :gutter="10">
          <el-table
            ref="chooseTable"
            v-loading="chooseTableLoading"
            :data="chooseTableData"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row>
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="耗材编码"
              prop="consumables_id"
              align="center"
              fixed>
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
              label="品牌"
              prop="brand"
              align="center">
            </el-table-column>
            <el-table-column
              label="供应商"
              prop="supplier"
              align="center">
            </el-table-column>
            <!--<el-table-column
              label="库存上限"
              prop="inventory_upper_limit"
              align="center">
            </el-table-column>
            <el-table-column
              label="库存下限"
              prop="inventory_lower_limit"
              align="center">
            </el-table-column>-->
            <el-table-column
              label="出库数量"
              prop="number"
              align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.number" :disabled="editDisabled"></el-input>
              </template>
            </el-table-column>
            <!--<el-table-column
              label="出库单价"
              prop="unit_price"
              align="center">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.unit_price" :disabled="editDisabled"></el-input>
              </template>
            </el-table-column>-->
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelStorageoutDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitStorageoutForm" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择物品dialog-->
    <el-dialog title="选择物料" :visible.sync="chooseMaterialsDialog" center class="choose-materials-dialog" width="55%">
      <el-row :gutter="20">
        <el-col :span="6">
          <pis-title label="物料分类"></pis-title>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            size="small">
          </el-input>
          <el-tree
            v-loading="treeLoading"
            class="filter-tree"
            node-key="id"
            show-checkbox
            :check-strictly="true"
            :data="groupData"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="groupTree">
          </el-tree>
        </el-col>
        <el-col :span="18">
          <pis-title label="物料列表"></pis-title>
          <el-table
            ref="materialsTable"
            v-loading="chooseMaterialsLoading"
            :data="chooseMaterialsData"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row>
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="耗材编码"
              prop="consumables_id"
              align="center"
              fixed>
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
              label="库存上限"
              prop="inventory_upper_limit"
              align="center">
            </el-table-column>
            <el-table-column
              label="库存下限"
              prop="inventory_lower_limit"
              align="center">
            </el-table-column>
          </el-table>
          <el-pagination class="flex justify-content-center"
                         @current-change="materialsHandleCurrentChange"
                         background
                         :page-size="materialsPagination.per_page"
                         :current-page="materialsPagination.current_page"
                         layout="prev, pager, next"
                         :total="materialsPagination.total"
                         style="padding-top: 20px;">
          </el-pagination>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChooseStorageoutDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmChooseStorageoutDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./storageout.component.js"></script>
<style lang="scss" src="./storageout.scss"></style>
