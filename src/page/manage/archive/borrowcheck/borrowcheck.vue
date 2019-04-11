<template>
  <div class="borrowcheck-page main-container">
    <pis-search-head
      placeholder="借阅人/借阅单号"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"
      :form-id-list="[]"
      :searchFormList="searchFormList">
      <div class="flex align-items-center pointer" @click="onlyChecked" style="margin-right: 30px">
        <i class="el-icon-check borrow-btn-icon"></i>
        <span class="refresh-text">审核通过</span>
      </div>
      <div class="flex align-items-center pointer" @click="checkedAndBorrowed" style="margin-right: 30px">
        <i class="el-icon-sort view-icon"></i>
        <span class="refresh-text">审核通过并借出</span>
      </div>
    </pis-search-head>
    <div class="borrow-list-table">
      <pis-title label="借阅单列表" class="todo-list-tip"></pis-title>
      <pis-page-size
        :total-count="pagination.total"
        :page-size="tablePageSize"
        @page-size-change="handleSizeChange">
      </pis-page-size>
      <el-table
        v-loading="loading"
        :data="borrowNoTableData"
        tooltip-effect="dark"
        style="width: 100%"
        ref="borrowTable"
        @selection-change="rowSelect"
        highlight-current-row
        @row-click="borrowNoRowClick">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="id"
          label="借阅单号"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop="borrow_type"
          label="借阅类型"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop='borrower'
          label="借阅人"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="borrowed_at"
          label="借阅日期"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="return_at"
          label="归还日期"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <div class="flex justify-content-center">
              <div class="out-borrow-btn borrow-btn flex justify-content-center" @click="checkBorrowPro(scope.row,scope.row.id)">
                <span>审核借阅单</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="flex justify-content-center "
                     @current-change="handleCurrentChange"
                     background
                     :page-size="pagination.per_page"
                     :current-page="pagination.current_page"
                     layout="prev, pager, next"
                     :total="pagination.total">
      </el-pagination>
    </div>
    <div class="borrow-pro-table">
      <pis-title label="借阅资料列表" class="todo-list-tip"></pis-title>
      <el-row class="set-total" type="flex" align="middle"
              justify="space-between">
        <span>共找到{{proTotalCount}}条数据</span>
      </el-row>
      <el-table
        v-loading="loading"
        :data="borrowProTableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row>
        <el-table-column
          prop="borrow_item"
          label="借阅项目"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop="pathology_id"
          label="病理号"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop="borrow_num"
          label="数量"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="borrow_remark"
          label="备注"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="借阅单" :visible.sync="borrowProjectDialog" center @close="closeDialog">
      <el-form :model="borrowProForm" :rules="borrowProFormRules" ref="borrowProForm" label-position="right" label-width="80px" size="small" class="borrow-pro-form" disabled>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="借阅类型">
              <el-select v-model="borrowProForm.borrow_type" auto-complete="on" clearable>
                <el-option value="家属借阅" label="家属借阅"></el-option>
                <el-option value="外院借阅" label="外院借阅"></el-option>
                <el-option value="科内借阅" label="科内借阅"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="借阅人" prop="borrower">
              <el-input v-model="borrowProForm.borrower" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="borrowProForm.phone" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借阅日期" prop="borrowed_at">
              <el-date-picker
                v-model="borrowProForm.borrowed_at"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="借阅日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="归还日期" prop="return_at">
              <el-date-picker
                v-model="borrowProForm.return_at"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="归还日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="押金" prop="cash">
              <el-input v-model="borrowProForm.cash" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款人" prop="payee">
              <el-input v-model="borrowProForm.payee" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="借阅科室" v-if="borrowProForm.borrow_type === '科内借阅' ">
              <el-input v-model="borrowProForm.department" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借阅单位" v-if="borrowProForm.borrow_type === '外院借阅' ">
              <el-input v-model="borrowProForm.hospital" auto-complete="off" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人" prop="check_doctor">
              <el-select v-model="borrowProForm.check_doctor" auto-complete="on" clearable filterable>
                <el-option v-for="(item,index) in userList" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="borrow-pro-text">
          <el-col :span="2">
            <p>序号</p>
          </el-col>
          <el-col :span="6">
            <p>借阅项目</p>
          </el-col>
          <el-col :span="5">
            <p>对应病理号</p>
          </el-col>
          <el-col :span="4">
            <p>数量</p>
          </el-col>
          <el-col :span="5">
            <p>备注</p>
          </el-col>
          <el-col :span="2">
            <p>操作</p>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="borrow-con-text" v-for="(item,index) in borrowProList" :key="index">
          <el-col :span="2">
            <p>{{`${index+1}.`}}</p>
          </el-col>
          <el-col :span="6">
            <el-select v-model="item.borrow_item" auto-complete="on" clearable size="small">
              <el-option value="玻片" label="玻片"></el-option>
              <el-option value="蜡块" label="蜡块"></el-option>
              <el-option value="报告" label="报告"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.pathology_id" clearable size="small"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="item.borrow_num" clearable size="small"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.borrow_remark" clearable size="small"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button size="small" type="danger" @click="deleteBorrowPro(index)">删除</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 20px">
          <el-col>
            <el-form>
              <el-form-item label="审核意见：（审核通过可不填）">
                <el-input v-model="refusal_reason" type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckedBtn" size="small">审核通过</el-button>
        <el-button type="primary" @click="dialogCheckedAndBorrowed" size="small">审核通过并借出</el-button>
        <el-button type="warning" @click="dialogNotAllowed" size="small">不予通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script src="./borrowcheck.component.js"></script>
<style src="./borrowcheck.scss"></style>

