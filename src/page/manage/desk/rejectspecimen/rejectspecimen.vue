<template>
  <div class="rejectspecimen-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list=[2,5,6]
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab
      v-model="activeName"
      :tab-list="[{label:'常规',name:'routine',number:countList.routine},{label:'冰冻',name:'frozen',number:countList.frozen},{label:'细胞学',name:'cell',number:countList.cell}]"
      @tab-click="handleClick">
    </pis-tab>
    <div class="normal-specimen-table">
      <pis-page-size
        :total-count="pagination.total"
        :page-size="tablePageSize"
        @page-size-change="handleSizeChange"
        style="padding: 0 0 20px 0">
      </pis-page-size>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        ref="caseTable"
        highlight-current-row
        :span-method="arraySpanMethod"
        border
      >
       <!-- <el-table-column
          type="selection"
          align="center">
        </el-table-column>-->
        <el-table-column
          prop="id"
          label="病理号"
          width="125"
          align="center"
          fixed>
          <template slot-scope="scope">
            <a @click="viewCollect(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="treat_type"
          label="就诊类型"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="姓名"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop='age'
          label="年龄"
          align="center"
          width="80">
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
          prop="specimen_name"
          label="标本名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="part"
          label="标本部位"
          align="center">
        </el-table-column>
        <el-table-column
          prop="rejection_reason"
          label="拒收原因"
          align="center">
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

<script src="./rejectspecimen.component.js"></script>
<style src="./rejectspecimen.scss"></style>
