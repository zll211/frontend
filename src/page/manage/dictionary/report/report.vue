<template>
  <div class="report-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      :form-id-list="[]"
      placeholder="模版名称">
      <router-link class="flex align-items-center pointer" to="./report/edit" style="margin-right: 30px">
        <i class="el-icon-plus borrow-btn-icon"></i>
        <span class="refresh-text">新建模版</span>
      </router-link>
    </pis-search-head>
    <el-row :gutter="40" v-loading="loading">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4" v-for="(item,index) in tableData" :key="index" style="padding-top: 20px">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.image" class="image" :alt="item.template_name" :title="item.template_name" @click="viewBig(item.template_name,item.image)">
          <div style="padding: 14px;">
            <span>{{item.template_name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.created_at }}</time>
              <el-button type="text" style="color: #ff6f6f;margin-left: 5px;" class="button" @click="deleteReport(item.id)">删除</el-button>
              <el-button type="text"  class="button" @click="editReport(item.id)">编辑</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="imgDialog" width="730px">
      <img :src="imgDialogSrc" alt="" width="720" height="741">
    </el-dialog>
  </div>
</template>

<script src="./report.components.js"></script>
<style src="./report.scss"></style>
