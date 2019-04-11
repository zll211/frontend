<template>
  <main class="doperate-page" v-loading.fullscreen="loading">
    <el-row class="fixed-head" type="flex" align="bottom" justify="space-between">
      <el-row type="flex" align="middle">
        <div class="back-icon" @click="backList">
          <i class="el-icon-back"></i>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card" class="nav-top">
          <el-tab-pane :label="tab.label" :name="tab.name"
                       v-for="tab in tabList" :key="tab.id">
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
        <el-button type="primary" @click="goTakeSpecimen"
                   v-if="caseInfoForm.outside_register_type!=='玻片'&&caseInfoForm.draw_status === '未取材'" size="small">取材
        </el-button>
        <el-button type="primary" @click="goOperate" v-if="caseInfoForm.status === '已制片'" size="small">诊断
        </el-button>
      </el-row>
    </el-row>
    <div>
      <diagnosis-content v-show="activeName==='diagnosis'"
                         :case-info-form="caseInfoForm"
                         :readonly="isReadonly"
                         :diagnosis="writeDiagnosisForm" @view-report="viewReport"
                         class="doperate-child-page"></diagnosis-content>
      <register-info v-show="activeName==='register'"
                     :case-info-form="caseInfoForm"
                     :case-type="caseType" class="doperate-child-page"></register-info>
      <pis-slide-view v-if="activeName==='film'"></pis-slide-view>
      <materials-info v-show="activeName==='materials'"
                      :specimen-info-form="caseInfoForm" class="doperate-child-page"></materials-info>
      <doctor-advice v-show="activeName==='special'"
                     :advice-data="caseInfoForm.specialInspectionAdvice" class="doperate-child-page"></doctor-advice>
      <doctor-advice v-show="activeName==='technical'"
                     :advice-data="caseInfoForm.technicalAdvice.data" class="doperate-child-page"></doctor-advice>
      <section-list class="doperate-child-page" v-show="activeName==='film'" :section-list="sectionList" @bind="gotoBind"></section-list>
    </div>

    <!--预览诊断报告-->
    <el-dialog
      class="pdf-dialog"
      title="预览"
      :visible.sync="pdfViewVisible"
      :fullscreen="true">
      <iframe :src="pdf" style="width: 100%;height: 100%" frameborder="0"
              marginheight="0" marginwidth="0"></iframe>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" v-if="!isReadonly" @click="filedReport">签发报告
        </el-button>
      </div>
    </el-dialog>
  </main>


</template>

<script src="./collectdetail.component.js"></script>
<style src="../../diagnosis/operate/operate.scss"></style>
