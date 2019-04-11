<template>
  <div class="timeout-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab
      v-model="activeName"
      :tab-list="[{label:'小标本',name:'small_specimen_timeout',number:countList.small_specimen},{label:'大标本',name:'big_specimen_timeout',number:countList.big_specimen},{label:'冰冻病理',name:'frozen_timeout',number:countList.frozen},{label:'细胞病理',name:'cell_timeout',number:countList.cell},{label:'外院切片',name:'slide_timeout',number:countList.slide},{label:'外院蜡块',name:'block_timeout',number:countList.block}]"
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
      style="width: 100%"
      @selection-change="handleSelectionChange"
      highlight-current-row
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
      <el-table-column
        prop="has_use_time"
        label="已用时长"
        align="center">
      </el-table-column>
      <el-table-column
        prop="timeout"
        label="超时时长"
        align="center"
        width="180"
        fixed="right">
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

<script src="./timeout.component.js"></script>
<style src="./timeout.scss"></style>
