<template>
  <div class="service-page main-container">
    <pis-search-head
      placeholder="维修单号"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      @select-change="selectChange"
      :searchFormList="searchFormList">
      <div class="flex align-items-center pointer" @click="serviceAssetsDialog=true" style="margin-right: 30px">
        <i class="el-icon-plus"></i>
        <span class="refresh-text">新增维修</span>
      </div>
      <div class="flex align-items-center pointer" @click="printAssets" style="margin-right: 30px">
        <i class="el-icon-printer"></i>
        <span class="refresh-text">打印维修单</span>
      </div>
    </pis-search-head>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="tablePageSize"
      @page-size-change="handleSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      ref="serviceTable"
      :data="tableData"
      tooltip-effect="dark"
      @row-click="rowClick"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      highlight-current-row>
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        label="维修状态"
        prop="maintain_status"
        align="center"
        fixed>
        <template slot-scope="scope">
          <el-tag>{{ scope.row.maintain_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="维修单号"
        prop="maintain_id"
        align="center"
        fixed>
        <template slot-scope="scope">
          <a @click="viewService(scope.row, scope.row.id)" style="color: #01cfb1;text-decoration:underline;cursor: pointer">{{scope.row.maintain_id}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="维修日期"
        prop="maintain_at"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="完成日期"
        prop="maintain_finish_at"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="维修费用"
        prop="maintain_expense"
        align="center">
      </el-table-column>
      <el-table-column
        label="报修人"
        prop="maintain_name"
        align="center">
      </el-table-column>
      <el-table-column
        label="维修内容"
        prop="maintain_content"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px" fixed="right">
        <template slot-scope="scope">
          <div class="flex justify-content-center">
            <el-button type="primary" @click="serviceFinish(scope.row,scope.row.id)" size="mini">维修完成</el-button>
            <el-button type="warning" @click="editServiceBtn(scope.row,scope.row.id)" size="mini">修改</el-button>
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

    <!-- 资产维修单Dialog -->
    <el-dialog title="资产维修单" :visible.sync="serviceAssetsDialog" center @close="closeServiceAssetsDialog" width="45%">
      <el-form :model="serviceAssetsForm" :rules="serviceAssetsFormRules" ref="serviceAssetsForm" label-position="right" label-width="96px" size="small" class="add-assets-form" :disabled="seviceFormAbled">
        <!--<pis-title label="基本信息"></pis-title>-->
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="报修人" prop="maintain_name">
              <el-select v-model="serviceAssetsForm.maintain_name" auto-complete="on" clearable style="width: 100%">
                <el-option v-for="(item,index) in userList"
                           :key="index"
                           :value="item.realname"
                           :label="item.realname">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修费用" prop="maintain_expense">
              <el-input v-model="serviceAssetsForm.maintain_expense" placeholder="维修费用" clearable>
                <el-button slot="append" size="small">元</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="送修日期" prop="maintain_at">
              <el-date-picker
                v-model="serviceAssetsForm.maintain_at"
                value-format="yyyy-MM-dd"
                type="date"
                style="width:100%"
                placeholder="送修日期"
                align="right"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成日期" prop="maintain_finish_at">
              <el-date-picker
                v-model="serviceAssetsForm.maintain_finish_at"
                value-format="yyyy-MM-dd"
                type="date"
                style="width:100%"
                placeholder="完成日期"
                align="right"
                clearable
                disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="维修内容" prop="maintain_content">
              <el-input type="textarea" v-model="serviceAssetsForm.maintain_content" clearable placeholder="维修内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注" prop="maintain_remark">
              <el-input type="text" v-model="serviceAssetsForm.maintain_remark" clearable placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button size="small" @click="chooseAssetsBtn">选择资产</el-button>
          <el-button size="small" @click="deleteChooseAssets">删除</el-button>
        </el-row>
        <el-row :gutter="10">
          <el-table
            ref="chooseTable"
            v-loading="loading"
            @row-click="chooseTableRowClick"
            :data="chooseTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            highlight-current-row>
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="资产条码"
              prop="assets_id"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              label="资产名称"
              prop="assets_name"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              label="资产类别"
              prop="assets_type"
              align="center">
            </el-table-column>
            <el-table-column
              label="规格型号"
              prop="assets_model"
              align="center">
            </el-table-column>
            <el-table-column
              label="SN号"
              prop="assets_sn"
              align="center">
            </el-table-column>
            <el-table-column
              label="购入时间"
              prop="buy_at"
              align="center"
              width="100px">
            </el-table-column>
            <el-table-column
              label="维保到期"
              prop="assets_end_at"
              align="center">
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!isView">
        <el-button @click="cancelServiceAssetsDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('serviceAssetsForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择资产dialog-->
    <el-dialog title="选择资产" :visible.sync="chooseAssetsDialog" center @close="closeChooseAssetsDialog">
      <el-table
        ref="chooseAssets"
        v-loading="chooseTableLoading"
        :data="assetsTableData"
        @row-click="assetsRowClick"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        highlight-current-row>
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          label="资产条码"
          prop="assets_id"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          label="资产名称"
          prop="assets_name"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          label="资产类别"
          prop="assets_type"
          align="center">
        </el-table-column>
        <el-table-column
          label="规格型号"
          prop="assets_model"
          align="center">
        </el-table-column>
        <el-table-column
          label="SN号"
          prop="assets_sn"
          align="center">
        </el-table-column>
        <el-table-column
          label="购入时间"
          prop="buy_at"
          align="center">
        </el-table-column>
        <el-table-column
          label="维保到期"
          prop="assets_end_at"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination class="flex justify-content-center"
                     @current-change="assetsHandleCurrentChange"
                     background
                     :page-size="assetsPagination.per_page"
                     :current-page="assetsPagination.current_page"
                     layout="prev, pager, next"
                     :total="assetsPagination.total"
                     style="padding-top: 20px;">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChooseAssetsDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmChooseAssetsDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
  </div>
</template>

<script src="./service.component.js"></script>
<style src="./service.scss"></style>
