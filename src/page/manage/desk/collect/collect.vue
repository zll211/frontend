<template>
  <div class="collect-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
      <div class="flex align-items-center pointer" @click="exportListBtn" style="margin-right: 30px">
        <i class="el-icon-tickets export-btn-icon"></i>
        <span class="refresh-text">导出</span>
      </div>
    </pis-search-head>
    <div class="normal-specimen-table">
      <pis-page-size
        :total-count="pagination.total"
        :page-size="tablePageSize"
        @page-size-change="handleSizeChange">
      </pis-page-size>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
        <el-table-column
          prop="id"
          label="病理号"
          width="120"
          align="center"
          fixed>
          <template slot-scope="scope">
            <a @click="viewCollect(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="case_type"
          label="病理类型"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop="treat_type"
          label="就诊类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop='age'
          label="年龄"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          prop="inspection_hospital"
          label="送检医院"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="inspection_department"
          label="送检科室"
          align="center">
        </el-table-column>
        <el-table-column
          prop="inspection_doctor"
          label="送检医生"
          align="center">
        </el-table-column>
        <el-table-column
          prop="inspection_date"
          label="送检时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="specimen_num"
          label="标本数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="190" fixed="right">
          <template slot-scope="scope">
            <div class="flex">
              <el-button type="primary" @click="viewCollect(scope.row.id)" size="mini">查看详情</el-button>
              <el-button type="warning" @click="cancelCollect(scope.row.id)" size="mini">取消收藏</el-button>
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
  </div>
</template>

<script src="./collect.component.js"></script>
<style src="./collect.scss"></style>
