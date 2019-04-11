<template>
  <main class="log-page main-container">
    <pis-search-head
      ref="searchHead"
      placeholder="查询病理号"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"></pis-search-head>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pageSize"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <div class="log-case-main" v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">
      <div v-for="(item,index) in logs" :key="index">

        <div class="log-case-item">
          <p class="case-header flex align-items-center justify-content-between">
            <span>病理号：{{item.id}} 病例类型：{{item.case_type}}</span>
            <el-button type="text" v-show="item.logs.length>1&&item.showCount===1" @click="showAllCase(item)">查看病例全部状态
            </el-button>
            <el-button type="text" v-show="item.logs.length===item.showCount&&item.showCount!==1"
                       @click="showAllCase(item)">收起
            </el-button>
          </p>
          <el-steps align-center :active="log.active" v-for="(log,index) in item.logs" :key="index"
                    v-show="index<item.showCount">
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

    </div>

    <el-pagination
      class="flex justify-content-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      :current-page="pagination.current_page"
      @current-change="currentChange">
    </el-pagination>
  </main>
</template>

<script src="./case.component.js"></script>

<style lang="scss" src="./case.scss"></style>
