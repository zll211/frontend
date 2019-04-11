<template>
  <div class="follow-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
      <div class="flex align-items-center pointer" @click="deleteFollow" style="margin-right: 30px">
        <i class="el-icon-delete delete-btn-icon"></i>
        <span class="refresh-text">删除</span>
      </div>
    </pis-search-head>
    <pis-tab
      v-model="activeName"
      :tab-list="[{label:'随访中',name:'following',number:countList.following},{label:'随访完成',name:'followed',number:countList.followed}]"
      @tab-click="handleClick">
    </pis-tab>
    <div class="normal-specimen-table">
      <pis-page-size
        :total-count="pagination.total"
        :page-size="pagination.per_page"
        @page-size-change="handleSizeChange">
      </pis-page-size>
      <el-table
        v-loading="loading"
        ref="followTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        highlight-current-row>
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
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template slot-scope="scope">
            <div class="flex">
              <el-button type="primary" @click="editFollow(scope.row.id, scope.row.pivot)" size="mini">记录</el-button>
              <el-button type="danger" @click="finishFollow(scope.row.id, scope.row.pivot)" size="mini" v-if="activeName === 'following'">结束</el-button>
              <el-button type="danger" @click="reStartFollow(scope.row.id, scope.row.pivot)" size="mini" v-if="activeName === 'followed'">随访</el-button>
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
    <el-dialog title="随访记录" :visible.sync="recordListDialog" center width="500px">
      <ul class="record-list">
        <li v-for="(item,index) in recordList" :key="index">
          <p>随访时间：{{item.time}}</p>
          <p>随访结果：{{item.msg}}</p>
        </li>
      </ul>
      <el-form :model="recordForm" ref="recordForm" :close="closeRecordForm" label-width="80px" :rules="recordFormRule" class="record-form" v-if="activeName === 'following'">
        <el-form-item label="随访时间" prop="time">
          <el-date-picker
            v-model="recordForm.time"
            type="datetime"
            placeholder="请选择随访时间"
            default-time="12:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            size="small"
            clearable
            style="width:80%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="随访结果" prop="msg">
          <el-input v-model="recordForm.msg" size="small" clearable style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center" v-if="activeName === 'following'">
        <el-button type="primary" @click="confirmRecordBtn" size="small">确定</el-button>
        <el-button @click="cancelRecordBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./follow.component.js"></script>
<style src="./follow.scss"></style>
