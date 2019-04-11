<template>
  <div class="takespecimen-page">
    <div class="takespecimen left" v-loading="pageLoading">
      <div class="base-information">
        <span>基本信息：<span class="pathology-id" @click="viewCollect(infoList.id)">{{infoList.id}} </span><span> / {{infoList.patient_name}} / </span><span> {{infoList.gender}} / </span><span> {{infoList.age}}{{infoList.age_unit}} / </span><span> {{infoList.treat_type}} </span></span>
        <el-button size="mini" @click="moreInfoShow = !moreInfoShow">更多信息</el-button>
        <el-tooltip class="item" effect="dark" content="点击查看冰冻诊断结果" placement="bottom" v-if="this.caseType === '常规' && this.infoList.associate_pathology">
          <el-button size="mini" @click="frozenResult" style="margin-left: 0px;">冰冻</el-button>
        </el-tooltip>
        <el-input v-model="idFormQrcode" size="mini" style="width: 150px" class="right" autofocus placeholder="扫描病理号" clearable></el-input>
        <el-collapse-transition>
          <div v-show="moreInfoShow">
            <el-row :gutter="10"  style="padding-top: 20px">
              <el-col :span="3">
                <p>婚否：<span>{{infoList.is_married}}</span></p>
              </el-col>
              <el-col :span="6">
                <p>籍贯：<span>{{infoList.origin}}</span></p>
              </el-col>
              <el-col :span="4">
                <p>民族：<span>{{infoList.nation}}</span></p>
              </el-col>
              <el-col :span="5">
                <p>职业：<span>{{infoList.career}}</span></p>
              </el-col>
              <el-col :span="6">
                <p>联系电话：<span>{{infoList.phone}}</span></p>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
      <hr style="margin-top: 20px">
      <div class="uploadImg" v-if="this.tableStatus !== '重补取'">
        <el-upload
          class="left"
          ref="uploadImg"
          action="/api/image"
          :http-request="httpRequest"
          list-type="picture-card"
          :headers="uploadImgHeader"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgList"
          name="draw_material"
          :on-success="uploadImgSuccessfunction"
          accept="image/*">
          <el-button size="small">上传取材图片</el-button>
        </el-upload>
        <div style="margin-top: 20px" >
          <video autoplay ref="video" width="146" height="110" id="video" style="border: 1px dashed #ccc; border-radius: 5px;"></video>
          <img :src="imgSrc" width="140" height="100" v-if="imgSrc ===''?false:true">
          <canvas style="display:none;" ref="canvas" width="146" height="146"></canvas>
        </div>
        <el-button @click="getVideo" size="small" class="get-video-btn" >获取摄像头</el-button>
        <el-button @click="screenShot" size="small" class="screen-shot-btn">截图</el-button>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <hr style="margin-top: 10px" v-show="this.tableStatus !== '重补取'">

      <el-tabs v-model="activeTakespecimenName" type="border-card"
               @tab-click="takespecimenHandleClick">
        <el-tab-pane :label="'标本'+(index+1)" :name="'标本'+(index+1)"
                     class="takespecimen-template"
                     v-for="(template,index) in templateList" :key="index">
          <h4>标本名称：{{template.specimen_name}}</h4>
          <el-tooltip class="item" effect="dark" content="点击选择巨检描述模板"
                      placement="top">
            <i class="el-icon-menu" @click="choseModel(index)"></i>
          </el-tooltip>

          <el-input
            type="textarea"
            :rows="2"
            autosize
            placeholder="巨检描述"
            v-model="template.gigantic_inspection"
            class="check-text"
            :disabled="textareaDisabled">
          </el-input>
          <span style="margin-right: 10px">材块 </span>
          <el-input
            v-model="template.specimen_name"
            disabled
            size="small"
            class="specimen-name-input">
          </el-input>
          <el-input-number
            controls-position="right"
            placeholder="材块个数"
            v-model="template.specimenNumber"
            style="width: 150px"
            size="small"
            :min="1"
            class="specimen-name-input"
            v-on:keyup.enter.native="addParaffin(index)">
          </el-input-number>
          <el-button type="primary" @click="addParaffin(index)" size="small">增加</el-button>
          <el-row :gutter="10" class="paraffin-form-head">
            <el-col :span="2">
              <p>蜡块</p>
            </el-col>
            <el-col :span="6">
              <p>取材名称</p>
            </el-col>
            <el-col :span="5">
              <p>取材部位</p>
            </el-col>
            <el-col :span="4">
              <p>材块数量</p>
            </el-col>
            <el-col :span="4">
              <p>补充描述</p>
            </el-col>
            <el-col :span="3">
              <p>操作</p>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="paraffin-form-body"
                  v-for="(paraffin, key) in template.paraffinList" :key="key">
            <el-col :span="2">
              <el-input :label="`${key+1}`" :value="`${key+1}`" size="small"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="paraffin.specimenName" size="small"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="paraffin.specimenPart" size="small"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input-number controls-position="right" v-model="paraffin.paraffinNum" size="small" :min="1"></el-input-number>
            </el-col>
            <el-col :span="4">
              <el-input v-model="paraffin.backup" size="small"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="danger" class="el-button--primary" size="small"
                         @click="delParaffin(index,key)">删除
              </el-button>
            </el-col>
          </el-row>
          <el-form :model="templateForm">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="附言" label-width="40px">
                  <el-select v-model="template.postscript"
                             size="small"
                             placeholder="附言">
                    <el-option label="用完" value="用完"></el-option>
                    <el-option label="脱钙" value="脱钙"></el-option>
                    <el-option label="保留" value="保留"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="保存位置" label-width="80px">
                  <el-input v-model="template.position" placeholder="保存位置" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <pis-template
        v-model="checkModelVisible"
        title="巨检描述模板"
        :template-list="modelList"
        @confirm="confirmCheckModel"
      ></pis-template>
      <el-form :rules="takespecimenrules" :model="takespecimenForm"
               ref="takespecimenForm" label-width="80px">
        <el-row :gutter="10" class="takespecimen-record"
                v-show="this.tableStatus !== '重补取'">
          <el-col :span="8">
            <el-form-item label="记录员">
              <el-select v-model="takespecimenForm.recorder" placeholder="记录员" size="small">
                <el-option v-for="user in userList" :label="user.realname"
                           :value="user.realname" :key="user.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="取材医生" prop="draw_materialer">
              <el-select v-model="takespecimenForm.draw_materialer"
                         size="small"
                         placeholder="取材医生">
                <el-option v-for="user in userList" :label="user.realname"
                           :value="user.realname" :key="user.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="取材日期" prop="draw_material_at">
              <el-date-picker
                v-model="takespecimenForm.draw_material_at"
                style="width: 100%"
                type="datetime"
                placeholder="取材日期"
                size="small"
                default-time="12:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="save-button-group right">
        <el-button size="small" @click="takeSpecimenPrint">保存并打印取材单</el-button>
        <el-button class="el-button--primary"
                   size="small"
                   @click="saveInfo('takespecimenForm')"
                   v-show="this.tableStatus === '未取材'">保存
        </el-button>
        <el-button class="el-button--primary" @click="saveReCharge" size="small"
                   v-show="this.tableStatus === '重补取'">重补取
        </el-button>
        <el-button class="el-button--primary" @click="saveEditInfo" size="small"
                   v-show="this.tableStatus === '已取材'">保存修改
        </el-button>
      </div>
    </div>
    <div class="takespecimen-table right" v-bind:style="{top:changeTop}">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="未取材" name="未取材"></el-tab-pane>
        <el-tab-pane label="重补取/脱钙" name="重补取"></el-tab-pane>
        <el-tab-pane label="已取材" name="已取材"></el-tab-pane>
        <el-tab-pane label="全部" name="全部"></el-tab-pane>
      </el-tabs>
      <el-form>
        <el-input v-model="takespecimenSearchInput" placeholder="病理号/姓名" size="small"
                  class="takespecimen-search-input" clearable>
          <el-button slot="append" @click="takespecimenTableSearch">搜索</el-button>
        </el-input>
      </el-form>
      <el-table
        v-loading="loading"
        :data="takeSpecimenTable"
        highlight-current-row
        current-row-key=2>
        <el-table-column
          prop="id"
          label="病理号"
          width="120"
          align="center">
          <template slot-scope="scope">
            <a @click="newInfo(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.screenWidth > 1100"
          prop="gender"
          label="性别"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.screenWidth > 1100"
          prop="case_type"
          label="类型"
          align="center">
        </el-table-column>
      </el-table>
      <pis-pagination
        :pis-pagination="pisPagination"
        @nextPage = "pisNextPage"
        @prePage = "pisPrePage">
      </pis-pagination>
    </div>
    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
    <el-dialog title="冰冻结果" :visible.sync="frozenResultDialog" center width="700px">
      <el-form :model="frozenResultForm" label-width="80px" disabled v-loading="frozenResultFormLoading">
        <el-form-item label="镜下所见" style="margin-bottom: 10px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="暂无"
            v-model="frozenResultForm.see_under_microscope">
          </el-input>
        </el-form-item>
          <el-form-item label="诊断意见" style="margin-bottom: 10px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="暂无"
              v-model="frozenResultForm.diagnostic_opinion">
            </el-input>
          </el-form-item>
          <el-form-item label="附注建议">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="暂无"
              v-model="frozenResultForm.note_suggestion">
            </el-input>
          </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script src="./takespecimen.component.js"></script>
<style src="./takespecimen.scss"></style>
