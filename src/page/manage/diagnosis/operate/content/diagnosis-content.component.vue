<template>
  <div>
    <el-row class="diagnosis-content">
      <el-row type="flex" align="middle">
        <div class="base-info-title flex-1">姓名：<span class="dark-color">{{caseInfoForm.patient_name}}</span>
          <el-dropdown @command="handleCommand" v-if="caseInfoForm.same_name_id">
            <span class="el-dropdown-link">
              同名查看<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(id, index) in caseInfoForm.same_name_id" :key="index" :command="id">{{id}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <span class="base-info-title flex-1">性别：<span
          class="dark-color">{{caseInfoForm.gender}}</span></span>
        <span class="base-info-title flex-1">年龄：<span
          class="dark-color">{{caseInfoForm.age}}</span></span>
        <span class="base-info-title flex-1">病理号：<span
          class="dark-color">{{caseInfoForm.id}}</span></span>
        <span class="flex-1"></span>
      </el-row>
      <el-row type="flex" align="middle">
         <span class="base-info-title flex-1">标本类型：<span
           class="dark-color">{{caseInfoForm.specimen_type}}</span></span>
        <span class="base-info-title flex-4">标本名称：<span
          class="dark-color">{{caseInfoForm.specimenTotalName}}</span></span>
      </el-row>
      <el-row type="flex" align="middle">
      <span class="base-info-title flex-3">临床诊断：<span
        class="dark-color">{{caseInfoForm.ext.clinical_opinions}}</span></span>
      </el-row>
      <el-row type="flex" align="middle">
         <span class="base-info-title flex-1">大体所见：<span
           class="dark-color">{{caseInfoForm.ext.clinical_opinions}}</span></span>
      </el-row>
      <div class="diagnosis-line"></div>
      <el-form :model="writeDiagnosisForm" ref="writeDiagnosisForm"
               :rules="writeDiagnosisRules">
        <el-row>
          <div class="flex align-items-center justify-content-between">
            <p class="diagnosis-title">镜下所见</p>
            <pis-icon
              v-if="!readonly"
              class="show-template"
              icon-text="显示模板"
              icon-src="../../../../assets/img/show-template.png"
              @icon-click="exportTemplate('mirror')"></pis-icon>
          </div>
          <el-form-item prop="mirror">
            <el-input type="textarea" v-model="writeDiagnosisForm.mirror"
                      :autosize="{ minRows: 4, maxRows: 4}"
                      :readonly="readonly" :disabled="readonly"></el-input>
          </el-form-item>
        </el-row>
        <div class="flex align-items-center justify-content-between">
          <p class="diagnosis-title">报告附图</p>
          <div class="flex align-items-center" v-if="!readonly">
            <el-upload
              style="margin-right: 12px"
              action="/api/image"
              name="draw_material"
              :on-success="handleSuccess"
              :headers="uploadHeaders"
              :limit="3"
              :show-file-list="false"
              :http-request="httpRequest"
              accept="image/*">
              <el-button size="small">上传图片</el-button>
            </el-upload>
            <el-button @click="getVideo" size="small" class="get-video-btn">获取摄像头</el-button>
            <el-button @click="screenShot" size="small" class="screen-shot-btn">截图</el-button>
          </div>
        </div>
        <gallery ref="gallery" :img-list="writeDiagnosisForm.imgList" :readonly="readonly"
                 @handle-file-remove="handleFileRemove"
                 @move-img="moveImg"></gallery>
        <div class="flex align-items-center justify-content-between">
          <p class="diagnosis-title">诊断意见</p>
          <div class="flex">
            <pis-icon
              v-if="!readonly"
              class="show-template"
              icon-text="导入医嘱"
              icon-src="../../../../assets/img/show-advice.png"
              @icon-click="exportAdvice"></pis-icon>
            <pis-icon
              v-if="!readonly"
              class="show-template"
              icon-text="显示模板"
              icon-src="../../../../assets/img/show-template.png"
              @icon-click="exportTemplate('diagnosis')"></pis-icon>
          </div>
        </div>
        <el-form-item prop="advice">
          <el-input type="textarea" v-model="writeDiagnosisForm.advice"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    :readonly="readonly" :disabled="readonly"></el-input>
        </el-form-item>
        <p class="diagnosis-title">附注建议</p>
        <el-form-item prop="remark">
          <el-input type="textarea" v-model="writeDiagnosisForm.remark"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    :readonly="readonly" :disabled="readonly"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-top: 10px" class="flex justify-content-between">
      <el-col class="flex justify-content-start">
        <el-button size="small" @click="previous(caseInfoForm.previous)" v-if="caseInfoForm.previous && !readonly">上一例
        </el-button>
      </el-col>
      <el-col class="flex justify-content-center" v-if="!readonly">
        <el-button size="small" type="default" @click="saveDiagnosis">
          保存
        </el-button>
        <el-button size="small" type="primary" @click="consultation">申请科内会诊
        </el-button>
        <el-button size="small" type="primary" @click="viewReport">生成报告
        </el-button>
        <el-button size="small" type="primary" @click="auditing">复审
        </el-button>
      </el-col>
      <el-col class="flex justify-content-center" v-if="readonly">
        <el-button size="small" type="primary" @click="viewReport">
          预览报告
        </el-button>
      </el-col>
      <el-col class="flex justify-content-end">
        <el-button size="small" @click="next(caseInfoForm.next)" v-if="caseInfoForm.next && !readonly">下一例</el-button>
      </el-col>
    </el-row>
    <!--导入相关的镜下所见和诊断模板-->
    <el-dialog
      title="导入模板"
      width="50%"
      :visible.sync="diagnosisViewVisible">
      <el-row type="flex" style="min-height: 400px;overflow: auto">
        <div class="flex-1">
          <pis-title label="诊断术语"></pis-title>
          <el-tree
            v-loading="templateLoading"
            class="filter-tree"
            :data="diagnosisTemplateList"
            node-key="id"
            :indent="10"
            :check-on-click-node="true"
            :highlight-current="true"
            :expand-on-click-node="true"
            @node-click="handleDiagnosisNodeClick"
            ref="tree">
          </el-tree>
        </div>
        <div class="v-line"></div>
        <div class="flex-1">
          <pis-title label="术语内容"></pis-title>
          <div>{{diagnosisTemplateInfo}}</div>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" size="mini" @click="confirmTemplateInfo">确定
        </el-button>
        <el-button type="info" size="mini" plain
                   @click="diagnosisViewVisible = false">取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import methods from './diagnosis.common';
  import Gallery from './gallery';

  export default {
    components: {Gallery},
    mixins: [methods],
    data() {
      return {
        writeDiagnosisForm: {
          imgList: [],
        },
        writeDiagnosisRules: {
          mirror: [
            {required: true, message: '请输入镜下所见内容', trigger: 'blur'},
          ],
          advice: [
            {required: true, message: '请输入诊断意见', trigger: 'blur'},
          ],
        },
      };
    },
    mounted() {
    },
    watch: {
      diagnosis(val) {
        this.writeDiagnosisForm = Object.assign({imgList: []}, val);
      },
    },
    methods: {
      screenShot() {
        if (this.haveVideo) {
          if (this.writeDiagnosisForm.imgList.length >= 3) return;
          let canvas = this.$refs.gallery.$refs.canvas;
          let video = this.$refs.gallery.$refs.video;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          let imgFile = this.covertBase64UrlToFile(canvas.toDataURL('image/png'));
          this.httpRequest({file: imgFile});
        } else {
          this.$message.warning('暂无视频源，不可截图。');
        }
      },
      confirmTemplateInfo() {
        if (!this.writeDiagnosisForm.mirror) this.writeDiagnosisForm.mirror = '';
        if (!this.writeDiagnosisForm.advice) this.writeDiagnosisForm.advice = '';
        if (this.type === 'mirror') {
          this.writeDiagnosisForm.mirror = this.writeDiagnosisForm.mirror + this.diagnosisTemplateInfo;
        } else if (this.type === 'diagnosis') {
          this.writeDiagnosisForm.advice = this.writeDiagnosisForm.advice + this.diagnosisTemplateInfo;
        }
        this.diagnosisViewVisible = false;
      },
      handleFileRemove(file, key) {
        this.writeDiagnosisForm.imgList.splice(key, 1);
      },
      moveImg(currentKey, dragingKey) {
        if (dragingKey === currentKey) return;
        const list = [...this.writeDiagnosisForm.imgList];
        const currentItem = list.splice(dragingKey, 1);
        list.splice(currentKey, 0, currentItem[0]);
        this.writeDiagnosisForm.imgList = list;
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../../../style/variables";

  .diagnosis-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 6px;
    .base-info-title {
      color: $_pm-default-table-color;
    }
    .diagnosis-line {
      margin: 10px 0 0;
      height: 0;
      width: 100%;
      border-bottom: 2px dashed #E9E9E9;
    }
    .dark-color {
      color: $_pm-tree-color;
    }
    textarea {
      background-color: #F8F8F8 !important;
      border: 1px solid #E2E2E2 !important;
    }
    .diagnosis-title {
      padding: 14px 0;
      color: $_pm-tree-color;
    }
    .show-template {
      font-size: 14px;
      img {
        width: 20px;
        height: 17px;
      }
      & + .show-template {
        margin: 0 0 0 10px;
      }
    }
    .upload-report {
      position: relative;
      min-height: 80px;
      border: 1px solid #dcdfe6;
      padding: 10px 15px;
      border-radius: 4px;
      background-color: #F8F8F8;
      .el-upload-list__item {
        height: 120px;
        width: 150px;
      }
      .el-upload--picture-card {
        width: 0;
        height: 0;
        border: none;
        position: absolute;
        top: -43px;
        right: 256px;
        line-height: 1;
      }
      .upload-img {
        height: 120px;
        width: 150px;
        margin-right: 10px;
      }
    }
    .v-line {
      margin: 0 5px;
      height: 400px;
      width: 2px;
      background-color: $_pm-default-border-color;
    }
  }
</style>
