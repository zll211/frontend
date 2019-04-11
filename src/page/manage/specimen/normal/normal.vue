<template>
  <div class="normal-specimen-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list=[2,3,4,5,6,7]
      @select-change="selectChange">
      <div class="flex align-items-center pointer" style="margin-right: 30px" @click="takeSpecimen">
        <i class="el-icon-plus spec-btn-icon"></i>
        <span class="spec-btn-text">取材</span>
      </div>
    </pis-search-head>
    <pis-tab
      v-model="activeName"
      :tab-list="[{label:'未取材',name:'first',number:countList.not_draw},{label:'重补取/脱钙',name:'second',number:countList.replenish},{label:'已取材',name:'third',number:countList.drawed},{label:'全部',name:'all',number:countList.total}]"
      @tab-click="handleClick">
    </pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="tablePageSize"
      @page-size-change="handleSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      ref="specimenTable"
      :data="tableData"
      tooltip-effect="dark"
      @row-click="rowClick"
      @row-dblclick="rowDbClick"
      style="width: 100%"
      @selection-change="handleSelectionChange">
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
        v-if="tableStatus !== '未取材'"
        prop="draw_materialer"
        label="取材医生"
        align="center">
      </el-table-column>
      <!-- <el-table-column
         prop="new_doctor"
         label="初取医生"
         align="center">
       </el-table-column>-->
      <el-table-column
        v-if="tableStatus !== '未取材'"
        prop="recorder"
        label="记录员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="取材状态"
        align="center">
      </el-table-column>
      <el-table-column
        v-if="tableStatus !== '未取材'"
        prop="draw_material_at"
        label="取材时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="specimen_num"
        label="标本数"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="scope">
          <div class="flex justify-content-center">
            <el-button v-if="scope.row.draw_status === '未取材'" type="primary" @click="editSpecimen(scope.row.id)" size="mini"> 取材</el-button>
            <el-button v-if="scope.row.draw_status === '重补取'" type="primary" @click="editSpecimen(scope.row.id)" size="mini"> 补取</el-button>
            <el-button v-if="scope.row.draw_status === '已取材'" type="primary" @click="editSpecimen(scope.row.id)" size="mini"> 修改</el-button>
            <!--<el-button type="danger" @click="deleteSpecimen(scope.row.id)" size="mini"> 删除</el-button>-->
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
</template>


<script src="./normal.component.js"></script>
<style src="./normal.scss"></style>
