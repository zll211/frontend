<template>
  <main class="doperate-page" v-loading.fullscreen="loading">
    <el-row class="fixed-head" type="flex" align="bottom"
            justify="space-between">
      <el-row type="flex" align="middle">
        <div class="back-icon" @click="backList">
          <i class="el-icon-back"></i>
        </div>
        <el-tabs v-model="activeName" type="card" class="nav-top">
          <el-tab-pane :label="tab.label" :name="tab.name"
                       v-for="tab in tabList" :key="tab.id">
          </el-tab-pane>
        </el-tabs>
      </el-row>

      <el-row v-if="!isReadonly" class="flex">
        <i class="el-icon-bell" :class="followed?'followed':'follow'" @click="setFollow" :title="followed?'取消随访':'加入随访'"></i>
        <pis-star @collect="doCollect" @cancelCollect="cancelCollect"
                  :isCollect="isCollect" style="margin-right: 10px"></pis-star>
        <el-button size="small" type="primary"
                   v-if="caseInfoForm.outside_register_type!=='玻片'&&caseInfoForm.outside_register_type!=='蜡块'"
                   @click="writeDiagnosis()">下医嘱
        </el-button>
        <el-button size="small" type="primary"
                   v-if="caseInfoForm.hz_status === '未远程会诊'"
                   @click="remoteConsultation()">远程会诊
        </el-button>
      </el-row>
    </el-row>
    <tct-content v-if="caseType==='细胞'&&caseInfoForm.specimen_type==='宫颈细胞'" class="doperate-child-page"
                 v-show="activeName==='diagnosis'"
                 :case-info-form="caseInfoForm"
                 :readonly="isReadonly"
                 :diagnosis="writeDiagnosisForm"
                 @view-report="viewReport"
                 @save-diagnosis="saveDiagnosis" @auditing="auditing"
                 @consultation="consultation"
                 @export-advice="exportAdvice"></tct-content>
    <diagnosis-content
      v-if="caseType&&!(caseType==='细胞'&&caseInfoForm.specimen_type==='宫颈细胞')"
      ref="doctorAdvice" class="doperate-child-page" v-show="activeName==='diagnosis'"
      :case-info-form="caseInfoForm"
      :readonly="isReadonly"
      :diagnosis="writeDiagnosisForm" @view-report="viewReport"
      @save-diagnosis="saveDiagnosis" @auditing="auditing"
      @consultation="consultation"
      @export-advice="exportAdvice"></diagnosis-content>
    <register-info class="doperate-child-page" v-show="activeName==='register'"
                   :case-info-form="caseInfoForm"
                   :case-type="caseType"></register-info>
    <!--<pis-slide-view v-if="activeName==='film'" :file-name-list="fileNameList" @bind="gotoBind"
                    ></pis-slide-view>-->
    <section-list class="doperate-child-page" v-show="activeName==='film'" :section-list="sectionList" @bind="gotoBind" @screen-shot="screenShot"></section-list>
    <materials-info class="doperate-child-page" v-show="activeName==='materials'"
                    :specimen-info-form="caseInfoForm"></materials-info>
    <doctor-advice class="doperate-child-page" v-show="activeName==='special'"
                   type="special"
                   :case-type="caseType"
                   :advice-data="specialInspectionAdvice"></doctor-advice>
    <doctor-advice class="doperate-child-page" v-show="activeName==='technical'"
                   type="technical"
                   :case-type="caseType"
                   :advice-data="caseInfoForm.technicalAdvice.data"></doctor-advice>
    <remote-consultation class="doperate-child-page" v-if="activeName==='remote'"
                         :remote-data="caseInfoForm.hz_report_url"></remote-consultation>
    <consultation class="doperate-child-page"  v-if="activeName ==='consultation'"
                  :consultations="caseInfoForm.consultations.data" @confirmConsultation="confirmConsultation"></consultation>
    <write-advice :visible.sync="writeVisible" :case-info-form="caseInfoForm"
                  :case-type="caseType"
                  :tec-process="tecProcess"
                  :spec-process="specProcess"
                  @submit-advice="submitAdvice"></write-advice>
    <!--预览诊断报告-->
    <el-dialog
      class="pdf-dialog"
      title="预览"
      :visible.sync="pdfViewVisible"
      :fullscreen="true">
      <el-form :model="changeTemplateForm" ref="changeTemplateForm" label-position="left" slot="title"
               v-if="caseType&&caseInfoForm.specimen_type&&!(caseType==='细胞'&&caseInfoForm.specimen_type==='宫颈细胞')">
        <el-form-item label="切换模板" prop="changeTemplate">
          <el-select v-model="changeTemplateForm.changeTemplate" size="small" clearable placeholder="请选择报告模板"
                     @change="templateChange">
            <el-option v-for="(item,index) in templateList" :key="index" :label="item.template_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <iframe :src="pdf" style="width: 100%;height: 100%" frameborder="0"
              marginheight="0" marginwidth="0"></iframe>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" v-if="!isReadonly" @click="filedReport">签发报告
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="复审医生" width="300px" :visible.sync="reviewViewVisible">
      <el-select
        v-model="reviewDoctor"
        filterable
        reserve-keyword
        placeholder="请输入复审医生姓名">
        <el-option
          v-for="item in doctorList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" size="mini" @click="confirmDoctor">确定
        </el-button>
        <el-button type="info" size="mini" plain
                   @click="reviewViewVisible = false">取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择科内会诊医生" width="400px" :visible.sync="consultationDoctorDialog">
      <el-select v-model="selectedDoctorList" multiple placeholder="请选择会诊医生"  style="width: 100%">
        <el-option
          v-for="doc in consultationDoctorList"
          :key="doc.id"
          :label="doc.realname"
          :value="doc.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" size="mini" @click="confirmConsultationDoctor">确定
        </el-button>
        <el-button type="info" size="mini" plain
                   @click="consultationDoctorDialog = false">取消
        </el-button>
      </div>
    </el-dialog>
  </main>


</template>

<script src="./operate.component.js"></script>
<style src="./operate.scss"></style>
