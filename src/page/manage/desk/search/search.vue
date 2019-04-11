<template>
  <div class="search-page main-container">
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
        @page-size-change="handleSizeChange"
        style="padding: 0 0 20px 0">
      </pis-page-size>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        ref="caseTable"
        @selection-change="handleSelectionChange"
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
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
          sortable
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
          prop="inspection_doctor"
          label="送检医生"
          align="center">
        </el-table-column>
        <el-table-column
          width="160"
          prop="inspection_date"
          sortable
          label="送检时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="specimen_num"
          label="标本数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          fixed="right"
          >
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="drawMaterial"
          label="取材医生"
          align="center">
        </el-table-column>
        <el-table-column
          prop="p_doctor"
          label="切片医生"
          align="center">
        </el-table-column>
        <el-table-column
          prop="p_doctor"
          label="诊断医生"
          align="center">
        </el-table-column>
        <el-table-column
          prop="p_doctor"
          label="审核医生"
          align="center">
        </el-table-column>-->
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
    <el-dialog title="病例详情" :visible.sync="caseLogDialog" center width="80%">
      <div class="log-case-main" v-loading="dialoagLoading">
        <div class="log-case-item" v-for="(log,index) in logs" :key="index">
          <p class="case-header">病理号：{{log.id}} 病理类型：{{log.case_type}}</p>
          <el-steps align-center :active="log.active">
            <el-step :status="log.register.status" :title="log.register.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.register.content"></div>
            </el-step>
            <el-step v-if="log.draw_material.show"
                     :status="log.draw_material.status"
                     :title="log.draw_material.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.draw_material.content"></div>
            </el-step>
            <el-step v-if="log.dehydration.show" :status="log.dehydration.status"
                     :title="log.dehydration.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.dehydration.content"></div>
            </el-step>
            <el-step v-if="log.entrapment.show" :status="log.entrapment.status"
                     :title="log.entrapment.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.entrapment.content"></div>
            </el-step>
            <el-step v-if="log.section.show" :status="log.section.status"
                     :title="log.section.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.section.content"></div>
            </el-step>
            <el-step v-if="log.dyeing.show" :status="log.dyeing.status"
                     :title="log.dyeing.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.dyeing.content"></div>
            </el-step>
            <el-step v-if="log.seal.show" :status="log.seal.status"
                     :title="log.seal.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.seal.content"></div>
            </el-step>
            <el-step v-if="log.diagnosis.show" :status="log.diagnosis.status"
                     :title="log.diagnosis.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.diagnosis.content"></div>
            </el-step>
            <el-step v-if="log.review.show" :status="log.review.status"
                     :title="log.review.title">
              <div slot="description" class="flex column align-items-center"
                   v-html="log.review.content"></div>
            </el-step>
          </el-steps>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./search.component.js"></script>
<style src="./search.scss"></style>
