<template>
  <div>
    <!--下医嘱-->
    <el-dialog title="" :visible.sync="writeVisible" :show-close="false"
               width="900px" :before-close="beforeCloseWrite">
      <template slot="title">
        <el-row class="operate-dialog-header" type="flex" align="middle"
                justify="space-between">
          <div>
            <label><span class="header-title">姓名：</span><a>{{caseInfoForm.patient_name}}</a></label>
            <label><span class="header-title">性别：</span><span>{{caseInfoForm.gender}}</span></label>
            <label><span
              class="header-title">年龄：</span><span>{{caseInfoForm.age}}</span></label>
            <label><span
              class="header-title">病理号：</span><span>{{caseInfoForm.id}}</span></label>
          </div>
          <el-row type="flex" align="middle">
            <i class="el-icon-circle-close close-dialog"
               @click="beforeCloseWrite()"></i>
          </el-row>
        </el-row>
      </template>
      <main>
        <el-row>
          <el-col :span="4" class="margin-bottom-default">
            <p>标本类型：<span>{{caseInfoForm.specimen_type}}</span></p>
          </el-col>
          <el-col :span="8" class="margin-bottom-default">
            <p>标本名称：<span>{{caseInfoForm.specimenTotalName}}</span></p>
          </el-col>
          <el-col :span="12" class="margin-bottom-default">
            <p>临床诊断：<span>{{caseInfoForm.ext.clinical_opinions}}</span></p>
          </el-col>
          <el-col :span="24" class="margin-bottom-default">
            <p>大体所见：<span>{{caseInfoForm.ext.operation_findings}}</span></p>
          </el-col>
        </el-row>
        <el-row>
          <el-row v-if="caseType!=='细胞'">
            <el-col class="margin-bottom-default">技术医嘱</el-col>
            <el-col class="margin-bottom-default">
              <el-select v-model="tSpecimenId" size="mini" placeholder="请选择标本"
                         clearable>
                <el-option v-for="item in specimenList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
              </el-select>
              <el-select v-model="tParaffinId"
                         size="mini" placeholder="请选择蜡块" clearable>
                <el-option v-for="item in tParaffinList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="recharge()" v-if="tecProcess[0]&&tecProcess[0]==='补取'">重补取
              </el-button>
              <el-button type="primary" size="mini" @click="selectTechnical()">
                切片处理
              </el-button>
            </el-col>
            <el-col class="margin-bottom-default">
              <div class="advice-content">
                <el-tag
                  v-for="(tag, index) in tAdviceTags"
                  :key="index"
                  closable
                  @close="handleTecTagClose(tag)">
                  {{tag.label}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="caseType!=='冰冻'">
            <el-col class="margin-bottom-default">特检医嘱</el-col>
            <el-col class="margin-bottom-default">
              <el-select v-model="sSpecimenId" size="mini" placeholder="请选择标本"
                         clearable>
                <el-option v-for="item in specimenList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
              </el-select>
              <el-select v-model="sParaffinId" v-if="caseType!=='细胞'"
                         size="mini" placeholder="请选择蜡块" clearable>
                <el-option v-for="item in sParaffinList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" v-for="(process, index) in specProcess" :key="index" size="mini"
                         @click="selectDye(process.name)">{{process.label}}
              </el-button>
            </el-col>
            <el-col class="margin-bottom-default">
              <div class="advice-content">
                <el-tag
                  v-for="(tag, index) in sAdviceTags"
                  :key="index"
                  closable
                  @close="handleTagClose(tag)">
                  {{tag.label}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col class="flex justify-content-end">
              <el-button type="danger" size="mini" @click="submitAdvice">提交
              </el-button>
            </el-col>
          </el-row>
        </el-row>
      </main>
    </el-dialog>
    <reagent-dialog title="试剂选择" :visible.sync="deyViewVisible"
                    :type="diagnosisType" @confirm="confirmDye"
                    :list="reagentList"></reagent-dialog>
    <section-dialog title="试剂选择" :visible.sync="sectionViewVisible"
                    @confirm="confirmSection"
                    :data="enableSectionList"
                    :list="sectionList"></section-dialog>
  </div>
</template>

<script>
  import reagentDialog from '../reagent/reagent.component';
  import sectionDialog from '../section/section.component';

  export default {
    name: 'advice',
    components: {
      reagentDialog,
      sectionDialog,
    },
    data() {
      return {
        writeVisible: false,
        diagnosisType: '',
        tSpecimenId: null,
        sSpecimenId: null,
        tParaffinId: null,
        sParaffinId: null,
        deyViewVisible: false,
        sectionViewVisible: false,
        reagentList: [],
        sectionList: [],
        sAdviceTags: [],
        tAdviceTags: [],
      };
    },
    props: {
      visible: false,
      caseInfoForm: Object,
      caseType: '',
      tecProcess: {
        type: Array,
        default: () => [],
      },
      specProcess: {
        type: Array,
        default: () => [],
      },
    },
    watch: {
      visible(val) {
        if (val) {
          this.diagnosisType = '';
          this.sAdviceTags = [];
          this.tAdviceTags = [];
          this.reagentList = [];
          this.sectionList = [];
          this.sSpecimenId = null;
          this.tSpecimenId = null;
          this.tParaffinId = null;
          this.sParaffinId = null;
        }
        this.writeVisible = val;
      },
    },
    computed: {
      enableSectionList() {
        const index = this.tecProcess.indexOf('补取');
        if (!!~index) {
          return this.tecProcess.slice(index + 1).map((item, index) => ({key: index + 1, label: item}));
        }
        return this.tecProcess.map((item, index) => ({key: index + 1, label: item}));
      },
      specimenList() {
        if (this.caseInfoForm.specimen.data) {
          return this.caseInfoForm.specimen.data.map((item) => ({
            label: item.specimen_name,
            value: item.id,
            paraffinBlock: item.paraffinBlock,
          }));
        } else {
          return [];
        }
      },
      tParaffinList() {
        if (this.tSpecimenId) {
          let specimen = this.specimenList.find((item) => item.value === this.tSpecimenId);
          if (specimen) {
            return specimen.paraffinBlock.data.map((item) => ({
              label: item.sample_name,
              value: item.id,
            }));
          }
        } else {
          this.tParaffinId = '';
        }
        return [];
      },
      sParaffinList() {
        if (this.sSpecimenId) {
          let specimen = this.specimenList.find((item) => item.value === this.sSpecimenId);
          if (specimen) {
            this.sParaffinId = '';
            return specimen.paraffinBlock.data.map((item) => ({
              label: item.sample_name,
              value: item.id,
            }));
          }
        } else {
          this.sParaffinId = '';
        }
        return [];
      },
    },
    methods: {
      beforeCloseWrite(done) {
        if (done) {
          done();
        } else {
          this.writeVisible = false;
        }
        this.$emit('update:visible', false);
      },
      selectDye(type) {
        if (!this.sSpecimenId || (!this.sParaffinId && this.caseType !== '细胞')) {
          this.$message.warning('请选择蜡块');
          return;
        }
        if (!this.sSpecimenId && this.caseType === '细胞') {
          this.$message.warning('请选择标本');
        }
        this.diagnosisType = type;
        this.reagentList = this.sAdviceTags.filter((tag) =>
          (tag.specimen_id === this.sSpecimenId &&
            tag.paraffin_block_id === this.sParaffinId &&
            tag.type === this.getTypeValue(type))).map((item) => item.reagentId);
        this.deyViewVisible = true;
      },
      confirmDye(list, type) {
        this.deyViewVisible = false;
        const tags = list.map((item) => ({
          type: this.getTypeValue(type),
          label: `${this.getSpecimenName(this.sSpecimenId)}-${this.getParaffinBlockName(this.sParaffinId, 's')} ${item.label}`,
          advice: item.label,
          reagentId: item.key,
          specimen_id: this.sSpecimenId,
          paraffin_block_id: this.sParaffinId,
        }));
        const sAdviceTags = this.sAdviceTags.filter((tag) =>
          !(tag.specimen_id === this.sSpecimenId &&
            tag.paraffin_block_id === this.sParaffinId &&
            tag.type === this.getTypeValue(type)));
        this.sAdviceTags = sAdviceTags.concat(tags);
      },
      getSpecimenName(id) {
        const specimen = this.specimenList.find((item) => item.value === id);
        return specimen?.label || '';
      },
      getParaffinBlockName(id, type) {
        const paraffin = this[`${type}ParaffinList`].find((item) => item.value === id);
        return paraffin?.label || '';
      },
      handleTagClose(tag) {
        this.sAdviceTags.splice(this.sAdviceTags.indexOf(tag), 1);
      },
      recharge() {
        if (!this.tSpecimenId || (!this.tParaffinId && this.caseType !== '细胞')) {
          this.$message.warning('请选择蜡块');
          return;
        }
        let tag = this.tAdviceTags.find((tag) =>
          tag.type === '重补取' && tag.specimen_id === this.tSpecimenId && tag.paraffin_block_id === this.tParaffinId);
        if (tag) {
          this.$message.warning('不能重复添加');
          return;
        }
        this.tAdviceTags.push({
          type: '重补取',
          label: `${this.getSpecimenName(this.tSpecimenId)}-${this.getParaffinBlockName(this.tParaffinId, 't')} 重补取`,
          advice: '重补取',
          specimen_id: this.tSpecimenId,
          paraffin_block_id: this.tParaffinId,
        });
      },
      selectTechnical() {
        if (!this.tSpecimenId || (!this.tParaffinId && this.caseType !== '细胞')) {
          this.$message.warning('请选择蜡块');
          return;
        }
        this.sectionList = this.tAdviceTags.filter((tag) =>
          (tag.specimen_id === this.tSpecimenId &&
            tag.paraffin_block_id === this.tParaffinId &&
            tag.type === '切片处理')).map((item) => item.sectionId);
        this.sectionViewVisible = true;
      },
      confirmSection(list) {
        this.sectionViewVisible = false;
        const tags = list.map((item) => ({
          type: '切片处理',
          label: `${this.getSpecimenName(this.tSpecimenId)}-${this.getParaffinBlockName(this.tParaffinId, 't')} ${item.label}`,
          advice: item.label,
          sectionId: item.key,
          specimen_id: this.tSpecimenId,
          paraffin_block_id: this.tParaffinId,
        }));
        const tAdviceTags = this.tAdviceTags.filter((tag) =>
          !(tag.specimen_id === this.tSpecimenId &&
            tag.paraffin_block_id === this.tParaffinId &&
            tag.type === '切片处理'));
        this.tAdviceTags = tAdviceTags.concat(tags);
      },
      handleTecTagClose(tag) {
        this.tAdviceTags.splice(this.tAdviceTags.indexOf(tag), 1);
      },
      getTypeValue(type) {
        return do {
          if (type === 'immunohistochemical') {
            '免疫组化';
          } else if (type === 'dye') {
            '特殊染色';
          } else if (type === 'molecular') {
            '分子病理';
          }
        };
      },
      submitAdvice() {
        this.$emit('submit-advice', [...this.sAdviceTags, ...this.tAdviceTags]);
        this.beforeCloseWrite();
      },
    },
  };
</script>

<style scoped>

</style>
