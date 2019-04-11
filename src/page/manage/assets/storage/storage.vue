<template>
  <div class="storage-page main-container">
    <pis-search-head
      placeholder="资产名称/条码"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      @select-change="selectChange"
      :searchFormList="searchFormList">
      <div class="flex align-items-center pointer" @click="addAssetsBtn" style="margin-right: 30px">
        <i class="el-icon-plus"></i>
        <span class="refresh-text">入库</span>
      </div>
      <div class="flex align-items-center pointer" @click="useAssetsBtn" style="margin-right: 30px">
        <i class="el-icon-goods"></i>
        <span class="refresh-text">领用</span>
      </div>
      <div class="flex align-items-center pointer" @click="returnAssetsBtn" style="margin-right: 30px">
        <i class="el-icon-sold-out"></i>
        <span class="refresh-text">退还</span>
      </div>
      <!--<div class="flex align-items-center pointer" @click="exportAssets" style="margin-right: 30px">
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
      ref="assetsTable"
      v-loading="loading"
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
        label="资产状态"
        prop="assets_status"
        align="center"
        width="80px"
        fixed>
        <template slot-scope="scope">
          <el-tooltip content="点击可强制将资产变为闲置状态" placement="top" effect="light" v-if="scope.row.assets_status === '维修'||scope.row.assets_status ==='报废'">
            <el-tag @click.native="changeAssetsStatus(scope.row.id)" style="cursor: pointer;">{{ scope.row.assets_status }}</el-tag>
          </el-tooltip>
          <el-tag v-if="scope.row.assets_status !== '维修'&& scope.row.assets_status !=='报废'" style="cursor: pointer;">{{ scope.row.assets_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="资产条码"
        prop="assets_id"
        align="center"
        fixed>
        <template slot-scope="scope">
          <a @click="viewAssets(scope.row, scope.row.id)" style="color: #01cfb1;text-decoration:underline;cursor: pointer">{{scope.row.assets_id}}</a>
        </template>
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
      <!--<el-table-column
        label="计量单位"
        prop="assets_unit"
        align="center"
        width="80px">
      </el-table-column>
      <el-table-column
        label="金额"
        prop="assets_money"
        align="center">
      </el-table-column>-->
      <el-table-column
        label="购入时间"
        prop="buy_at"
        align="center">
      </el-table-column>
      <el-table-column
        label="存放地点"
        prop="assets_position"
        align="center">
      </el-table-column>
      <el-table-column
        label="供应商"
        prop="assets_supplier"
        align="center">
      </el-table-column>
      <el-table-column
        label="维保到期"
        prop="assets_end_at"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="columnShow"
        label="负责人"
        prop="assets_principal"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="columnShow"
        label="维保说明"
        prop="service_remark"
        align="center">
      </el-table-column>
      <el-table-column
        label="领用人"
        prop="person"
        align="center">
      </el-table-column>
      <el-table-column
        label="领用日期"
        prop="handling_at"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="scope">
          <div class="flex justify-content-center">
            <el-button type="primary" @click="editAssetsBtn(scope.row,scope.row.id)" size="mini"> 修改</el-button>
            <el-button type="danger" @click="deleteAssets(scope.row,scope.row.id)" size="mini"> 报废</el-button>
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

    <!-- 新增资产入库Dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="addAssetsDialog" center @close="closeAddAssetsDialog" class="addAssetsDialog">
      <el-form :model="addAssetsForm" :rules="addAssetsFormRules" ref="addAssetsForm" label-position="right" label-width="80px" size="small" class="add-assets-form" :disabled="addFormDisabled">
        <pis-title label="基本信息"></pis-title>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="资产类别" prop="assets_type">
              <el-select v-model="addAssetsForm.assets_type" auto-complete="on" clearable>
                <el-option value="脱水机器" label="脱水机器"></el-option>
                <el-option value="包埋机器" label="包埋机器"></el-option>
                <el-option value="切片机器" label="切片机器"></el-option>
                <el-option value="染色机器" label="染色机器"></el-option>
                <el-option value="封片机器" label="封片机器"></el-option>
                <el-option value="通用设备" label="通用设备"></el-option>
                <el-option value="交通运输设备" label="交通运输设备"></el-option>
                <el-option value="电子产品及通信设备" label="电子产品及通信设备"></el-option>
                <el-option value="文艺体育设备" label="文艺体育设备"></el-option>
                <el-option value="图书文物及陈列品" label="图书文物及陈列品"></el-option>
                <el-option value="家具用品及其他" label="家具用品及其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产名称" prop="assets_name">
              <el-input v-model="addAssetsForm.assets_name" placeholder="请输入资产名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="assets_model">
              <el-input v-model="addAssetsForm.assets_model" placeholder="请输入规格型号" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="SN号" prop="assets_sn">
              <el-input v-model="addAssetsForm.assets_sn" placeholder="请输入SN号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位" prop="assets_unit">
              <el-input v-model="addAssetsForm.assets_unit" placeholder="请输入计量单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="assets_money">
              <el-input v-model="addAssetsForm.assets_money" placeholder="请输入金额" clearable>
                <el-button slot="append" size="small">元</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="购入时间" prop="buy_at">
              <el-date-picker
                v-model="addAssetsForm.buy_at"
                value-format="yyyy-MM-dd"
                type="date"
                style="width: 100%"
                placeholder="购入时间"
                align="right"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存放地点" prop="assets_position">
              <el-input v-model="addAssetsForm.assets_position" placeholder="请输入存放地点" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源" prop="assets_from">
              <el-select v-model="addAssetsForm.assets_from" auto-complete="on" clearable>
                <el-option value="购入" label="购入"></el-option>
                <el-option value="自建" label="自建"></el-option>
                <el-option value="租赁" label="租赁"></el-option>
                <el-option value="捐赠" label="捐赠"></el-option>
                <el-option value="其他" label="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="备注" prop="base_remark">
              <el-input type="textarea" v-model="addAssetsForm.base_remark" clearable placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <pis-title label="维保信息"></pis-title>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="供应商" prop="assets_supplier">
              <el-input v-model="addAssetsForm.assets_supplier" placeholder="请输入供应商" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="assets_supplier_name">
              <el-input v-model="addAssetsForm.assets_supplier_name" placeholder="联系人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="assets_supplier_phone">
              <el-input v-model="addAssetsForm.assets_supplier_phone" placeholder="联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="负责人" prop="assets_principal">
              <el-input v-model="addAssetsForm.assets_principal" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期时间" prop="assets_end_at">
              <el-date-picker
                v-model="addAssetsForm.assets_end_at"
                value-format="yyyy-MM-dd"
                type="date"
                width="100%"
                placeholder="到期时间"
                align="right"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="维保说明" prop="service_remark">
              <el-input type="textarea" v-model="addAssetsForm.service_remark" clearable placeholder="维保说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row v-if="handleRecord" class="handle-record">
        <pis-title label="操作记录"></pis-title>
          <el-table
            v-loading="handleTabelLoading"
            :data="handleTableData"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row>
            <el-table-column
              label="处理时间"
              prop="handling_at"
              align="center"
              width="160px"
              fixed>
            </el-table-column>
            <el-table-column
              label="处理人"
              prop="handler"
              align="center">
            </el-table-column>
            <el-table-column
              label="处理方式"
              prop="action"
              align="center">
            </el-table-column>
            <el-table-column
              label="领用/退还人"
              prop="person"
              align="center">
            </el-table-column>
            <el-table-column
              label="领用/退还部门"
              prop="department"
              align="center"
              width="120px">
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
              align="center">
            </el-table-column>
        </el-table>
        <el-pagination class="flex justify-content-center"
                       @current-change="handleCurrentPageChange"
                       background
                       :page-size="handlePagination.per_page"
                       :current-page="handlePagination.current_page"
                       layout="prev, pager, next"
                       :total="handlePagination.total">
        </el-pagination>
      </el-row>
      <div slot="footer" class="dialog-footer" v-if="footerShow">
        <el-button @click="cancelAddAssetsDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('addAssetsForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 领用资产dialog -->
    <el-dialog :title="'资产' + this.action" :visible.sync="useAssetsDialog" center @close="closeUseAssetsDialog" width="380px">
      <p style="margin-bottom:25px">已选{{assetsConunt}}条资产</p>
      <el-form :model="useAssetsForm" :rules="useAssetsFormRules" ref="useAssetsForm" label-position="right"
               label-width="80px" size="small" class="add-assets-form">
        <el-form-item :label="this.action === '报废'?'处理人': this.action + '人'" prop="person" v-if="this.action !== '报废'">
          <el-select v-model="useAssetsForm.person" auto-complete="on" clearable>
            <el-option v-for="(item,index) in userList"
                       :key="index"
                       :value="item.realname"
                       :label="item.realname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="this.action === '报废'?'处理部门': this.action + '部门'" prop="department" v-if="this.action !== '报废'">
          <el-select v-model="useAssetsForm.department" auto-complete="on" clearable>
            <el-option label="病理科" value="病理科"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="this.action === '报废'?'处理日期': this.action + '日期'" prop="handling_at">
          <el-date-picker
            v-model="useAssetsForm.handling_at"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:215px"
            placeholder="领用日期"
            align="right"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="useAssetsForm.remark" placeholder="备注" clearable style="width: 215px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUseAssetsDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitUseForm('useAssetsForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./storage.component.js"></script>
<style src="./storage.scss"></style>
