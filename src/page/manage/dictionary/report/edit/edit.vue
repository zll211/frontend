<template>
  <div class="edit-page">
    <div class="report-container" v-loading="pageLoading">
      <header>
        <div class="uploadImg">
          <el-upload
            ref="uploadImg"
            action="/api/image"
            list-type="picture-card"
            :headers="uploadImgHeader"
            :on-remove="handleRemove"
            :file-list="logoImgList"
            drag
            :limit="limit"
            name="draw_material"
            :on-success="uploadImgSuccessfunction"
            accept="image/*">
            <i class="el-icon-plus"></i>
            <p style="font-size: 12px">上传logo</p>
          </el-upload>
        </div>

        <h1 class="title" @click="headerDialog=true">
          <p>{{report.hospital_name}}</p>
          <p>{{report.report_name}}</p>
          <div class="edit-icon"><i class="el-icon-edit" title="编辑"></i></div>
        </h1>
        <span class="pathological-number">病理号：xxx</span>
        <el-button type="primary" class="back-btn" size="small" @click="reBack">返回</el-button>
        <el-button type="primary" class="save-btn" size="small" @click="setting">保存</el-button>
      </header>
      <div class="base-info">
        <draggable v-model="baseInfoList">
          <transition-group type="transition" tag="div">
            <div class="base-info-item" v-for="(item,index) in baseInfoList" :key="index">
              <span class="base-info-label">{{item.label}}：<i class="el-icon-remove remove-icon" title="删除" @click="deleteBaseInfo(index)"></i></span>
              <span :id="item.id"></span>
            </div>
          </transition-group>
        </draggable>
        <div class="base-info-plus base-info-item" style="margin-left: 10px;">
          <el-popover
            placement="right"
            width="210"
            trigger="click">
            <el-tag v-if="selectBaseInfoList.length !== 0" size="small" v-for="(item,index) in selectBaseInfoList" :key="index" style="margin: 2px 2px;cursor: pointer;" @click.native="selectTag(index)">{{item.label}}</el-tag>
            <p v-if="selectBaseInfoList.length === 0" style="font-size: 14px;color: #aaa;text-align: center;">没有更多信息可添加。</p>
            <span style="border: 1px dashed #aaa;cursor: pointer" title="增加基础信息" slot="reference"><i class="el-icon-plus" style="margin:0 15px;"></i></span>
          </el-popover>
        </div>
        <div class="clear"></div>
      </div>
      <div class="diagnosis-info">
        <draggable v-model="diagnosisInfoList">
          <transition-group type="transition" tag="div" class="flex column">
            <div class="flex row align-items-start diagnosis-info-item" v-for="(item,index) in diagnosisInfoList"
                 :key="index" @click="item.id !=='pathologyImg'?contentDialog=true:contentDialog=false">
              <label class="diagnosis-info-label">{{item.value}}：</label>
              <p v-if="item.id !== 'pathologyImg'" class="diagnosis-item-content flex-1"></p>
              <div v-if="item.id === 'pathologyImg'" class="flex diagnosis-item-img">
                <div v-for="(item,index) in pathologothImgList" :key="index" class="pathologoth-img">
                  <img class="diagnosis-img" src="../../../../../assets/img/reportImg.png">
                  <i class="el-icon-remove" @click="deleteImg(index)" title="删除"></i>
                </div>
                <div class="plus-icon" v-if="pathologothImgList.length < 3"><i class="el-icon-circle-plus"
                                                                               @click="addImg"></i></div>
              </div>
              <div class="delete-icon" @click.stop="deleteDiagnosis(index)"><i class="el-icon-delete" title="删除"></i></div>
              <div class="edit-icon" @click="contentDialog=true"><i class="el-icon-edit" title="编辑"></i></div>
            </div>
          </transition-group>
        </draggable>
        <div class="flex row justify-content-center" style="margin: 10px 0">
          <el-popover
            placement="bottom"
            width="140"
            trigger="click">
            <el-tag v-if="selectContentList.length !== 0" size="small" v-for="(item,index) in selectContentList" :key="index" style="margin: 4px 4px;cursor: pointer;" @click.native="selectContentTag(index)">{{item.value}}</el-tag>
            <p v-if="selectContentList.length === 0" style="font-size: 14px;color: #aaa;text-align: center;">没有更多模块可添加。</p>
            <span style="border: 1px dashed #aaa;cursor: pointer;padding: 5px 0;" title="增加内容信息" slot="reference"><i class="el-icon-plus" style="margin:0 32px;font-size: 18px"></i></span>
          </el-popover>
        </div>
      </div>
      <footer @click="footerDialog=true">
        <div class="flex column">
          <p class="doctor-name flex justify-content-end">{{report.doctor_sign}}：</p>
          <p class="sign-at justify-content-end flex">{{report.sign_at}}：</p>
        </div>
        <p class="extend-info">{{report.footer_text}}</p>
        <div class="edit-icon" @click="footerDialog=true"><i class="el-icon-edit" title="编辑"></i></div>
      </footer>
    </div>
    <el-dialog title="标题设置" :visible.sync="headerDialog" center width="30%">
      <el-form :model="headerForm" ref="headerForm" label-position="right" label-width="80px" size="small"
               class="header-form">
        <el-form-item label="医院名称">
          <el-input v-model="report.hospital_name"></el-input>
        </el-form-item>
        <el-form-item label="报告名称">
          <el-input v-model="report.report_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHeaderDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitHeaderSetup" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="内容设置" :visible.sync="contentDialog" center width="30%">
      <el-form :model="headerForm" ref="headerForm" label-position="right" label-width="100px" size="small"
               class="header-form">
        <el-form-item :label="item.label" v-for="(item,index) in diagnosisInfoList" :key="index">
          <el-input v-model="item.value" style="width: 80%" size="small"></el-input>
          <el-button type="danger" size="small" @click="deleteDiagnosis(index)">删除</el-button>
        </el-form-item>
        <!--<el-button type="primary" size="small">增加项目</el-button>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelContentDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitContentSetup" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="页尾设置" :visible.sync="footerDialog" center width="30%">
      <el-form :model="footerForm" ref="footerForm" label-position="right" label-width="100px" size="small"
               class="header-form">
        <el-form-item label="医生签名名称">
          <el-input v-model="report.doctor_sign"></el-input>
        </el-form-item>
        <el-form-item label="签名日期名称">
          <el-input v-model="report.sign_at"></el-input>
        </el-form-item>
        <el-form-item label="页尾文字">
          <el-input v-model="report.footer_text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFooterDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitFooterSetup" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认保存" :visible.sync="saveDialog" center width="500px">
      <el-form :model="saveForm" ref="saveForm" :rules="saveFormRules" label-position="right" label-width="110px" size="small"
               class="save-form">
        <el-form-item label="报告模版类型" prop="type">
          <el-select v-model="saveForm.type" placeholder="请选择模版类型" style="width: 100%;" clearable>
            <el-option label="通用病理报告模版" value="通用"></el-option>
            <el-option label="常规病理报告模版" value="常规"></el-option>
            <el-option label="冰冻病理报告模版" value="冰冻"></el-option>
            <el-option label="细胞病理报告模版" value="细胞"></el-option>
            <el-option label="外院病理报告模版" value="外院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告模版名称" prop="template_name">
          <el-input v-model="saveForm.template_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelsaveDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitsaveDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 报告模版html片段 -->
    <div id="reportModel" style="display: none" ref="reportModel">
      <div class="report-container">
        <div class="header">
          <div class="logo-img">
            <img :src="logoImgList.length === 0?'':logoImgList[0].url" alt="logo" id="logo-img">
          </div>
          <div class="title">
            <p id="hospital-name">{{report.hospital_name}}</p>
            <p id="report-name">{{report.report_name}}</p>
          </div>
          <span class="pathological-number" id="pathological-number">病理号：xxx</span>
        </div>
        <div class="base-info">
          <div class="base-info-item" v-for="(item,index) in baseInfoList" :key="index">
            <span class="base-info-label">{{item.label}}：</span>
            <span :id="item.id"></span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="diagnosis-info">
          <div>
            <div class="diagnosis-info-item" :class="item.id" v-for="(item,index) in diagnosisInfoList"
                 :key="index">
              <label class="diagnosis-info-label left">{{item.value}}：</label>
              <p v-if="item.id !== 'pathologyImg'" class="diagnosis-item-content" :id="item.id"></p>
              <div v-if="item.id === 'pathologyImg'" class="diagnosis-item-img">
                <div v-for="(item,index) in pathologothImgList" :key="index" class="pathologoth-img left">
                  <img class="diagnosis-img" src="../../../../../assets/img/reportImg.png"
                       :id="'pathologothImg'+(index+1).toString()">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div>
            <p class="doctor-name" id="doctor_sign">{{report.doctor_sign}}：</p>
            <p class="sign-at" id="sign_at">{{report.sign_at}}：</p>
          </div>
          <p class="extend-info" id="footer_text">{{report.footer_text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./edit.components.js"></script>
<style src="./edit.scss"></style>
<style scoped>

</style>
