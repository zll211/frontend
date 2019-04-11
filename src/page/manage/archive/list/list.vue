<template>
  <div class="archive-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"
      :form-id-list="[]">
      <div class="flex align-items-center pointer" style="margin-right: 30px" @click="autoArchive">
        <i class="el-icon-circle-plus-outline spec-btn-icon"></i>
        <span class="spec-btn-text">自动归档</span>
      </div>
      <div class="flex align-items-center pointer" style="margin-right: 30px" @click="handleArchive">
        <i class="el-icon-circle-plus spec-btn-icon"></i>
        <span class="spec-btn-text">手动归档</span>
      </div>
    </pis-search-head>
    <div class="report-table">
      <pis-tab
        v-model="activeName"
        :tab-list="[{label:'未归档',name:'未归档',number:countList.unfiled},{label:'已归档',name:'已归档',number:countList.filed}]"
        @tab-click="handleClick">
      </pis-tab>
      <pis-page-size
        :total-count="pagination.total"
        :page-size="pagination.per_page"
        @page-size-change="pageSizeChange">
      </pis-page-size>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        ref="reportTable"
        @row-click="rowClick"
        fit
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="id"
          label="病理号"
          align="center"
          fixed>
          <template slot-scope="scope">
            <a @click="viewCollect(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
          </template>
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
          prop="case_type"
          label="病理类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="treat_type"
          label="就诊类型"
          align="center">
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
          v-if="this.activeName === '未归档'"
          prop="status"
          label="病理状态"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.activeName === '已归档'"
          width="160"
          prop="filed_at"
          label="归档时间"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.activeName === '已归档'"
          prop="position"
          label="存放区域"
          align="center">
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

    <el-dialog :title="'当前需要归档的病理材料数量：'+needArchive" :visible.sync="archiveDialog" width="450px">
      <p style="margin-bottom: 10px">选择归档仓库：</p>
      <el-select clearable v-model="chooseLockers" value-key="id" multiple size="small" style="width: 300px" @change="lockerSelectChange">
        <el-option v-for="(locker,index) in lockers" :key="index" :label="locker.name" :value="locker.value">
          <span style="float: left">{{ locker.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">可用容量:{{ locker.avail_volume }}</span>
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="confirmArchiveBtn" size="small">确定</el-button>
        <el-button @click="cancelArchiveBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./list.component.js"></script>

<style scoped lang="scss">
  .borrow-pro-text{
    margin: 20px 0 0 12px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #cccccc;
    font-weight: bolder;
  p{
    text-align: center;
  }
  }
  .borrow-con-text{
    margin: 15px 0 0 12px;
  p{
    text-align: center;
    line-height: 32px;
  }
  }
  .spec-btn-icon{
    font-size: 32px;
    vertical-align: middle;
    color: #01d0b0;
    margin-right: 5px;
  }
  .spec-btn-text{
    color: #6f6f6f;
    font-size: 16px;
    line-height: 22px;
    margin-left: 8px;
  }
  .pathology-id{
    .pathology-id{
      color: #01d0b0;
      cursor: pointer;
      text-decoration: none !important;
      &:hover{
        text-decoration: underline !important;
      }
    }
  }
</style>
