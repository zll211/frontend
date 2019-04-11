<template>
  <div class="tct">
    <el-form class="tct-form" size="small" :model="writeDiagnosisForm" :rules="writeDiagnosisRules"
             ref="writeDiagnosisForm" :disabled="readonly">
      <el-row class="tct-one-header">
        <el-col :span="8">
           <span>姓名：{{caseInfoForm.patient_name}}</span>
          <el-dropdown @command="handleCommand"  v-if="caseInfoForm.same_name_id">
            <span class="el-dropdown-link">
              同名查看<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(id, index) in caseInfoForm.same_name_id" :key="index" :command="id">{{id}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8">
         性别：{{caseInfoForm.gender}}
        </el-col>
        <el-col :span="8">
          年龄：{{caseInfoForm.age}}
        </el-col>
        <el-col :span="8">
          病理号：{{caseInfoForm.id}}
        </el-col>
        <el-col :span="8">
          取样日期：{{caseInfoForm.take_cell_at}}
        </el-col>
        <el-col :span="8">
          取样医师：{{caseInfoForm.register_doctor}}
        </el-col>
      </el-row>
      <el-row class="tct-two-container">
        <el-col :span="12">
          <el-row>
            <el-form-item>
              <el-col :span="8">标本满意情况：</el-col>
              <el-col :span="8">
                <el-select v-model="writeDiagnosisForm.specimen_satisfaction">
                  <el-option label="满意" value="满意"></el-option>
                  <el-option label="基本满意" value="基本满意"></el-option>
                  <el-option label="重新取样" value="重新取样"></el-option>
                  <el-option label="不满意" value="不满意"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（1）上皮细胞数：</el-col>
              <el-col :span="8">
                <el-select v-model="writeDiagnosisForm.epithelium_count">
                  <el-option label=">5000个细胞" value=">5000个细胞"></el-option>
                  <el-option label="<5000个细胞" value="<5000个细胞"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（2）颈管细胞：</el-col>
              <el-col :span="8">
                <el-select v-model="writeDiagnosisForm.neck_canal_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（3）化生细胞：</el-col>
              <el-col :span="8">
                <el-select v-model="writeDiagnosisForm.metaplastic_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">炎症程度：</el-col>
              <el-col :span="8">
                <el-select v-model="writeDiagnosisForm.inflammation">
                  <el-option label="无" value="无"></el-option>
                  <el-option label="轻度炎症" value="轻度炎症"></el-option>
                  <el-option label="重度炎症" value="重度炎症"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col>微生物项目：</el-col>
            <el-form-item v-for="(item, index) in writeDiagnosisForm.microbial" :key="index">
              <el-col class="flex">（{{index+1}}）{{item.name}}：
                <el-checkbox v-model="item.checked"></el-checkbox>
              </el-col>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="tct-three-container">
        <div class="flex">
          <div class="flex-3">
            <p class="tct-diagnosis-TBS">TBS标准诊断：</p>
            <p class="tct-diagnosis-title">鳞状上皮细胞：</p>
            <div class="flex align-items-center" v-for="(cell, index) in writeDiagnosisForm.squamous_cell"
                 :key="index">
              <el-form-item>
                <span>{{cell.name}}</span>
                <el-checkbox v-model="cell.checked" @change="cellCheck(cell, $event)"></el-checkbox>
              </el-form-item>
              <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
              <div>
                <el-form-item v-for="(item, index) in cell.children" :key="index">
                  <span v-show="index===0">┌─</span>
                  <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                  <span v-show="index===cell.children.length-1">└─</span>
                  <span>{{item.name}}</span>
                  <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                </el-form-item>
              </div>
            </div>
            <p class="tct-diagnosis-title">腺上皮细胞分析：</p>
            <div class="flex align-items-center" v-if="index<2"
                 v-for="(cell, index) in writeDiagnosisForm.glandular_cell"
                 :key="cell.name">
              <el-form-item>
                <span>{{cell.name}}</span>
                <el-checkbox v-model="cell.checked" @change="cellCheck(cell, $event)"></el-checkbox>
              </el-form-item>
              <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
              <div>
                <el-form-item v-for="(item, index) in cell.children" :key="index">
                  <span v-show="index===0">┌─</span>
                  <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                  <span v-show="index===cell.children.length-1">└─</span>
                  <span>{{item.name}}</span>
                  <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="flex-2" v-if="!readonly">
            <div class="uploadImg">
              <el-upload
                ref="uploadImg"
                action="/api/image"
                :http-request="httpRequest"
                list-type="picture-card"
                :headers="uploadHeaders"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="writeDiagnosisForm.imgList"
                :limit="2"
                name="draw_material"
                accept="image/*">
                <el-button size="small">上传图片</el-button>
              </el-upload>
              <div>
                <video autoplay ref="video" width="150" height="120" id="video"
                       style="border: 1px dashed #ccc; border-radius: 5px;"></video>
                <canvas style="display:none;" ref="canvas" width="150" height="120"></canvas>
              </div>
              <el-button @click="getVideo" size="small" class="get-video-btn">获取摄像头</el-button>
              <el-button @click="screenShot" size="small" class="screen-shot-btn">截图</el-button>
            </div>
          </div>
          <div class="flex-2" v-if="readonly">
            <div class="uploadImg">
              <img class="upload-img" v-for="(img, index) in writeDiagnosisForm.imgList" :src="img.url">
            </div>
          </div>
        </div>
        <div class="flex align-items-center">
          <div class="flex align-items-center" v-if="index>=2"
               :class="{'margin-left-temp': index===3}"
               v-for="(cell, index) in writeDiagnosisForm.glandular_cell"
               :key="index">
            <el-form-item>
              <span>{{cell.name}}</span>
              <el-checkbox v-model="cell.checked" @change="cellCheck(cell, $event)"></el-checkbox>
            </el-form-item>
            <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
            <div>
              <el-form-item v-for="(item, index) in cell.children" :key="index">
                <span v-show="index===0">┌─</span>
                <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                <span v-show="index===cell.children.length-1">└─</span>
                <span>{{item.name}}</span>
                <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-row>
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
      <el-form-item prop="tct_diagnostic">
        <el-input type="textarea" v-model="writeDiagnosisForm.tct_diagnostic"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  :readonly="readonly"></el-input>
      </el-form-item>
    </el-form>
    <el-row style="margin-top: 10px">
      <el-col class="flex justify-content-center" v-if="!readonly">
        <el-button size="small" type="default" @click="saveDiagnosis">
          保存
        </el-button>
        <el-button size="small" type="primary" @click="viewReport">生成报告
        </el-button>
        <el-button size="small" type="primary" @click="auditing">复审
        </el-button>
      </el-col>
      <el-col class="flex justify-content-end" v-if="readonly">
        <el-button size="small" type="primary" @click="viewReport">
          预览报告
        </el-button>
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

  class TCT {
    constructor() {
      this.microbial = [{name: '放线菌', checked: false}, {name: '菌群转变', checked: false}, {
        name: '滴虫感染',
        checked: false,
      }, {name: '霉菌感染', checked: false}, {name: 'HPV感染', checked: false}, {name: '疱疹病毒感染', checked: false}];
      this.squamous_cell = [{
        name: '未见上皮内病变',
        checked: false,
        children: [{name: '正常', checked: false}, {name: '炎症', checked: false}, {
          name: '表皮细胞萎缩',
          checked: false,
        }, {name: '宫内节育器反应', checked: false}, {name: '妊娠反应', checked: false}, {name: '放疗反应', checked: false}, {
          name: '其他',
          checked: false,
        }],
      }, {
        name: '非典型鳞状细胞',
        checked: false,
        children: [{name: '不能明确意义', checked: false}, {name: '倾向上皮细胞内高度病变', checked: false}],
      }, {
        name: '上皮内低度病变',
        checked: false,
        children: [],
      }, {
        name: '上皮内高度病变',
        checked: false,
        children: [{name: 'CIN-II级', checked: false}, {name: 'CIN-III级', checked: false}],
      }, {
        name: '鳞状细胞癌',
        checked: false,
        children: [],
      }];
      this.glandular_cell = [{
        name: '非典型性腺细胞',
        checked: false,
        children: [{name: '宫内膜', checked: false}, {name: '来源不明', checked: false}],
      }, {
        name: '可疑腺癌',
        checked: false,
        children: [],
      }, {
        name: '非典型性腺细胞(宫颈管)',
        checked: false,
        children: [{name: '倾向原位腺癌', checked: false}, {name: '不能明确意义', checked: false}, {
          name: '倾向良性反应性改变',
          checked: false,
        }],
      }, {
        name: '腺癌',
        checked: false,
        children: [{name: '宫颈管', checked: false}, {name: '宫内膜', checked: false}, {name: '其他', checked: false}],
      }];
    }
  }

  export default {

    mixins: [methods],
    data() {
      return {
        writeDiagnosisForm: {
          imgList: [],
          tct_content: new TCT().content,
        },
        writeDiagnosisRules: {
          tct_diagnostic: [
            {required: true, message: '请输入诊断意见', trigger: 'blur'},
          ],
        },
      };
    },
    mounted() {
    },
    watch: {
      diagnosis(val) {
        if (!val.tct_content || val.tct_content.length === 0) {
          val.microbial = new TCT().microbial;
          val.squamous_cell = new TCT().squamous_cell;
          val.glandular_cell = new TCT().glandular_cell;
        }
        this.writeDiagnosisForm = Object.assign({imgList: []}, val);
      },
    },
    methods: {
      screenShot() {
        if (this.haveVideo) {
          if (this.writeDiagnosisForm.imgList.length >= 2) return;
          let canvas = this.$refs.canvas;
          let video = this.$refs.video;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          let imgFile = this.covertBase64UrlToFile(canvas.toDataURL('image/png'));
          this.httpRequest({file: imgFile});
        } else {
          this.$message.warning('暂无视频源，不可截图。');
        }
      },
      cellCheck(cell, value) {
        if (!value) {
          cell.children.forEach((item) => item.checked = value);
        }
      },
      confirmTemplateInfo() {
        if (!this.writeDiagnosisForm.tct_diagnostic) this.writeDiagnosisForm.tct_diagnostic = '';
        if (this.type === 'diagnosis') {
          this.writeDiagnosisForm.tct_diagnostic = this.writeDiagnosisForm.tct_diagnostic + this.diagnosisTemplateInfo;
        }
        this.diagnosisViewVisible = false;
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../../../style/variables";

  .tct {
    .tct-form {
      background: #ffffff;
      padding: 0 5px 5px;
      border-radius: 5px;
      .el-form-item--small .el-form-item__content {
        line-height: 24px;
      }
    }
    .tct-one-header {
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .tct-two-container {
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .tct-three-container {
      position: relative;
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
      .el-checkbox {
        margin-left: 20px;
      }
      .margin-left-temp {
        margin-left: 50px;
      }
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
      .uploadImg {
        position: relative;
        .el-upload-list {
          display: flex;
          flex-direction: column;
        }
        .el-upload-list__item {
          height: 120px;
          width: 150px;
        }
        .upload-img{
          height: 120px;
          width: 150px;
        }
        .el-upload--picture-card {
          width: 0;
          height: 0;
          border: none;
          position: absolute;
          top: 0;
          right: 84px;
        }
        .get-video-btn {
          position: absolute;
          right: 5px;
          top: 40px;
        }
        .screen-shot-btn {
          position: absolute;
          right: 5px;
          top: 80px;
        }
      }
      .el-upload--picture-card {
        line-height: 1;
      }
      .el-upload-dragger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 146px;
        width: auto;
        border: none;
      }
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 5px;
    }
    .tct-diagnosis-TBS {
      font-size: 18px;
      font-weight: bold;
    }
    .tct-diagnosis-title {
      font-size: 16px;
      font-weight: bold;
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
  }

</style>
