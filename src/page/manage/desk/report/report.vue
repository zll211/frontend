<template>
  <div class="report-page main-container" v-loading="pageLoading">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"
      :form-id-list="[1,2,3,4,5]"
      :search-form-list="searchFormList">
      <div class="flex align-items-center pointer" @click="printReportBtn" style="margin-right: 30px" v-if="this.tableStatus === '已签发' || this.tableStatus === '已发放'">
        <i class="el-icon-printer print-btn-icon"></i>
        <span class="refresh-text">打印报告</span>
      </div>
      <div class="flex align-items-center pointer" @click="sendReportBtn" style="margin-right: 30px" v-if="this.tableStatus === '已打印'">
        <i class="el-icon-sort send-btn-icon"></i>
        <span class="refresh-text">发放报告</span>
      </div>
      <div class="flex align-items-center pointer" @click="exportReportBtn" style="margin-right: 30px">
        <i class="el-icon-tickets export-btn-icon"></i>
        <span class="refresh-text">导出报告</span>
      </div>
    </pis-search-head>
    <div class="report-table">
      <pis-tab
        v-model="activeReportName"
        :tab-list="[{label:'待打印',name:'notPrint',number:countList.signed},{label:'待发放',name:'notPutout',number:countList.printed},{label:'已发放',name:'putout',number:countList.granted}]"
        @tab-click="handleClick">
      </pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="tablePageSize"
      @page-size-change="handleSizeChange">
    </pis-page-size>

    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      ref="reportTable"
      style="width: 100%"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="id"
        label="病理号"
        align="center"
        width="120"
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
        prop="phone"
        label="联系方式"
        align="center">
      </el-table-column>
      <el-table-column
        width="160"
        prop="filed_at"
        label="签发时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="报告状态"
        align="center">
      </el-table-column>
      <el-table-column v-for="(item, index) in notPutoutList" :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
        width="160">
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template slot-scope="scope">
          <div class="flex justify-content-between">
            <el-button type="primary" @click="viewReport(scope.row.id)" size="mini">预览</el-button>
            <el-button type="primary" @click="printReportSingle(scope.row.id)" size="mini">打印</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <el-pagination class="flex justify-content-center "
                   @current-change="handleCurrentChange"
                   background
                   :page-size="pagination.per_page"
                   :current-page="pagination.current_page"
                   layout="prev, pager, next"
                   :total="pagination.total">
    </el-pagination>
    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
    <el-dialog
      v-loading="pdfLoading"
      class="pdf-dialog"
      title="预览"
      :close="pdfDialogClose"
      :visible.sync="pdfViewVisible"
      :fullscreen="true">
      <iframe :src="viewPdf" style="width: 100%;height: 100%" frameborder="0"
              marginheight="0" marginwidth="0"></iframe>
    </el-dialog>
  </div>
</template>

<script src="./report.component.js"></script>
<style src="./report.scss"></style>
