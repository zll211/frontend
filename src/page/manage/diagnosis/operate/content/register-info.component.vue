<template>
  <div class="register-container">
    <el-form :model="caseInfoForm" ref="caseInfoForm" label-width="100px">
      <el-row class="flex align-items-center register-block">
        <el-col class="flex align-items-center justify-content-start">
          <el-form-item label="病理号" prop="id" class="pathology-id-item">
            <el-input v-model="caseInfoForm.id" size="small" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col class="flex align-items-center justify-content-end">
          <el-button size="small" style="margin-right: 0px" v-if="!fullRegister" @click="fullRegister = true"><i
            class="el-icon-plus"></i> 显示完整登记表
          </el-button>
          <el-button size="small" style="margin-right: 0px" v-if="fullRegister" @click="fullRegister = false"><i
            class="el-icon-minus"></i> 显示快捷登记表
          </el-button>
        </el-col>
      </el-row>
      <!--基本信息-->
      <div class="register-block">
        <div class="top-title">
          <p>基本信息</p>
          <div class="blue-line"></div>
        </div>
        <div class="down-icon" @click="registerInfoFull?registerInfoFull= false:registerInfoFull=true">
          <img :src="this.registerInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'"
               width="24"/>
        </div>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="姓名" prop="patient_name">
              <el-input v-model="caseInfoForm.patient_name" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="gender">
              <el-input v-model="caseInfoForm.gender" placeholder="" size="small" disabled>
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
                <el-option label="未知" value="未知"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="caseInfoForm.age" size="small" disabled>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="婚否" prop="is_married">
              <el-radio-group v-model="caseInfoForm.is_married" size="small" disabled style="width: 180px">
                <el-radio label="已婚"></el-radio>
                <el-radio label="未婚"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="fullRegister||registerInfoFull" v-show="registerInfoFull">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="民族" prop="nation">
                <el-input v-model="caseInfoForm.nation" filterable size="small" disabled>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="籍贯" prop="origin">
                <el-input
                  v-model="caseInfoForm.origin"
                  size="small" disabled
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职业" prop="career">
                <el-input v-model="caseInfoForm.career" size="small" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model.number="caseInfoForm.phone" size="small" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseInfoForm.gender === '女'" :gutter="10">
            <el-col :span="6">
              <el-form-item class="input-for-female" label="末次月经" prop="last_menses">
                <el-input v-model="caseInfoForm.last_menses" size="small" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="radio-for-female" label-width="0">
                <el-checkbox v-model="caseInfoForm.have_menses_check" size="small" disabled>绝经</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--本院送检信息-->
      <div class="register-block" v-if="caseType === '细胞' || caseType === '冰冻' || caseType === '常规'">
        <div class="top-title">
          <p>送检信息</p>
          <div class="blue-line"></div>
        </div>
        <div class="down-icon" @click="sendInfoFull?sendInfoFull= false:sendInfoFull=true">
          <img :src="this.sendInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'" width="24"/>
        </div>
        <el-row :gutter="10" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
          <el-col :span="6">
            <el-form-item label="病理分类" prop="case_type">
              <el-input v-model="caseInfoForm.case_type" size="small" disabled>
                <el-option label="默认" value="默认"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="病人隐私" prop="secret">
              <el-input v-model="caseInfoForm.secret" size="small" disabled>
                <el-option label="普通" value="普通"></el-option>
                <el-option label="隐私" value="隐私"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="就诊类别" prop="treat_type">
              <el-input v-model="caseInfoForm.treat_type" size="small" disabled>
                <el-option label="门诊" value="门诊"></el-option>
                <el-option label="外院" value="外院"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="送检医院" prop="inspection_hospital">
              <el-input v-model="caseInfoForm.inspection_hospital" size="small" disabled>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="送检科室" prop="inspection_department">
              <el-input v-model="caseInfoForm.inspection_department" size="small" disabled>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送检医生" prop="inspection_doctor">
              <el-input v-model="caseInfoForm.inspection_doctor" size="small" disabled>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="送检时间" prop="inspection_date">
              <el-input
                v-model="caseInfoForm.inspection_date"
                size="small" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
          <el-col :span="6">
            <el-form-item label="门诊号" prop="outpatient_number">
              <el-input v-model="caseInfoForm.outpatient_number" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="病历号" prop="anamnesis_no">
              <el-input v-model="caseInfoForm.anamnesis_no" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="住院号" prop="admission_number">
              <el-input v-model="caseInfoForm.admission_number" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="床号" prop="bed_number">
              <el-input v-model="caseInfoForm.bed_number" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
          <el-col :span="6">
            <el-form-item label="费别" prop="money_type">
              <el-input v-model="caseInfoForm.money_type" size="small" disabled>
                <el-option label="自费" value="自费"></el-option>
                <el-option label="合作医疗" value="合作医疗"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="金额" prop="money">
              <el-input v-model="caseInfoForm.money" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="传染性标本" class="longLabel" prop="laboratory_tests">
              <el-radio-group v-model="caseInfoForm.laboratory_tests" size="small" disabled>
                <el-radio label="是" value="是"></el-radio>
                <el-radio label="否" value="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!--外院送检信息-->
      <div class="register-block" v-if="caseType === '蜡块' || caseType === '玻片' ">
        <div class="top-title">
          <p>送检信息</p>
          <div class="blue-line"></div>
        </div>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="原病理号" prop="original_id">
              <el-input v-model="caseInfoForm.original_id" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="送检医院" prop="inspection_hospital">
              <el-input v-model="caseInfoForm.inspection_hospital" size="small" disabled>

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="送检时间" prop="inspection_date">
              <el-input
                v-model="caseInfoForm.inspection_date"
                size="small" disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="就诊类别" prop="treat_type">
              <el-input v-model="caseInfoForm.treat_type" size="small" disabled>
                <el-option label="门诊" value="门诊"></el-option>
                <el-option label="外院" value="外院"></el-option>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="caseType === '蜡块'">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-table
                :data="caseInfoForm.paraffinBlock.data"
                style="width: 100%;margin-bottom: 15px;">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="original_id"
                  label="原蜡块号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="sample_name"
                  label="取材名称"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="sample_source"
                  label="取材部位"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="summary"
                  label="补充描述"
                  align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div v-if="caseType === '玻片'">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-table
                :data="caseInfoForm.paraffinSection.data"
                style="width: 100%;margin-bottom: 15px;">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="original_id"
                  label="原切片号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="summary"
                  label="补充描述"
                  align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--常规冰冻标本信息-->
      <div v-if="caseType === '常规' || caseType === '冰冻'">
        <div class="register-block">
          <div class="top-title">
            <p>标本信息</p>
            <div class="blue-line"></div>
          </div>
          <div class="down-icon" @click="specimenInfoFull?specimenInfoFull= false:specimenInfoFull=true">
            <img :src="this.specimenInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'"
                 width="24"/>
          </div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="标本类型" prop="specimen_type">
                <el-input v-model="caseInfoForm.specimen_type" size="small" disabled>
                  <el-option label="常规" value="常规"></el-option>
                  <el-option label="活检" value="活检"></el-option>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标本固定" prop="specimen_fixed">
                <el-input v-model="caseInfoForm.specimen_fixed" size="small" disabled>
                  <el-option label="10%中性缓冲福尔马林" value="10%中性缓冲福尔马林"></el-option>
                  <el-option label="95%酒精" value="95%酒精"></el-option>
                  <el-option label="其他固定" value="其他固定"></el-option>
                  <el-option label="未固定" value="未固定"></el-option>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="固定时间" prop="fixed_at">
                <el-input
                  v-model="caseInfoForm.fixed_at"
                  size="small" disabled>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="fullRegister||specimenInfoFull" v-show="specimenInfoFull">
            <el-col :span="8">
              <el-form-item label="标本件数" prop="specimen_num">
                <el-input v-model="caseInfoForm.specimen_num" size="small" disabled>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采取部位" prop="specimen_spot">
                <el-input v-model="caseInfoForm.specimen_spot" size="small" disabled>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="离体时间" prop="leave_body_at">
                <el-input
                  v-model="caseInfoForm.leave_body_at"
                  size="small" disabled>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table
            :data="caseInfoForm.specimen.data"
            style="width: 100%;margin-bottom: 15px;">
            <el-table-column
              type="index"
              label="序号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="part"
              label="位置"
              align="center">
            </el-table-column>
            <el-table-column
              prop="specimen_name"
              label="标本名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center">
            </el-table-column>
          </el-table>
          <el-form-item label="临床诊断">
            <el-input type="textarea" v-model="caseInfoForm.ext.clinical_opinions" prop="ext" size="small"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="病史摘要">
            <el-input type="textarea" v-model="caseInfoForm.ext.medical_history_summary"
                      prop="ext.medical_history_summary" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="手术所见">
            <el-input type="textarea" v-model="caseInfoForm.ext.operation_findings" prop="ext.operation_findings"
                      size="small" disabled></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="标本接收时间" prop="receive_at" class="longLabel">
                <el-input v-model="caseInfoForm.receive_at" size="small" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="标本接收员" prop="receive_doctor" class="longLabel">
                <el-input v-model="caseInfoForm.receive_doctor" size="small" disabled>

                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--细胞标本信息-->
      <div v-if="caseType === '细胞'">
        <div class="register-block">
          <div class="top-title">
            <p>标本信息</p>
            <div class="blue-line"></div>
          </div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="标本类型" prop="specimen_type">
                <el-input v-model="caseInfoForm.specimen_type" size="small" disabled>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="取样日期" prop="take_cell_at">
                <el-input
                  v-model="caseInfoForm.take_cell_at"
                  size="small" disabled>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-table
                :data="caseInfoForm.specimen.data"
                style="width: 100%;margin-bottom: 15px;">
                <el-table-column
                  type="index"
                  label="序号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="specimen_name"
                  label="标本名称"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-form-item label="病史摘要">
            <el-input type="textarea" v-model="caseInfoForm.ext.medical_history_summary"
                      prop="ext.medical_history_summary" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作所见">
            <el-input type="textarea" v-model="caseInfoForm.ext.operation_findings" prop="ext.operation_findings"
                      size="small" disabled></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="标本接收时间" class="longLabel" prop="receive_at">
                <el-input
                  v-model="caseInfoForm.receive_at"

                  size="small" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="标本接收员" class="longLabel" prop="receive_doctor">
                <el-input v-model="caseInfoForm.receive_doctor" size="small" disabled>
                  <el-option label="d1" value="d1"></el-option>
                  <el-option label="d2" value="d2"></el-option>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fullRegister: false,
        registerInfoFull: false,
        sendInfoFull: false,
        specimenInfoFull: false,
        btnDisabled: false,
      };
    },
    watch: {
      fullRegister:function () {
        if(this.fullRegister === true) {
          this.registerInfoFull = true;
          this.sendInfoFull = true;
          this.specimenInfoFull = true;
        }else{
          this.registerInfoFull = false;
          this.sendInfoFull = false;
          this.specimenInfoFull = false;
        }
      }
    },
    props: {
      caseType: '',
      caseInfoForm: Object,
    },
    created() {

    },
  }
</script>

<style scoped lang="scss">
  .register-container {
  }

  .diagnosis-register {
    padding: 10px 10px 0;
    hr {
      width: 100%;
      margin: 0 auto 20px;
      border: none;
      border-top: 1px solid #e2e2e2;
    }
  }

  .register-block {
    margin-top: 10px;
    background-color: #ffffff;
    padding: 10px 10px 15px 10px;
    border-radius: 5px;
    position: relative;
    .down-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    .top-title {
      width: 70px;
      margin-left: 15px;
      margin-bottom: 15px;
      p {
        text-align: center;
        font-size: 16px;
        color: rgba(34, 34, 34, 1);
        font-weight: bolder;
      }
      .blue-line {
        width: 40px;
        margin: 8px auto;
        height: 2px;
        background-color: #01d0b0;
      }
    }
  }

  .el-form-item {
    margin-bottom: 10px !important;
  }

  .pathology-id-item {
    width: 250px;
    margin-bottom: 0px !important;
  }

  .el-form-item__label {
    width: 80px !important;
  }

  .el-form-item__content {
    margin-left: 80px !important;
  }

  .el-date-editor.el-input, .el-cascader {
    width: 100%;
  }

  .add-specimen-btn {
    margin: 15px 0 20px 15px;
  }

  .specimenNormalList li {
    margin: 10px 0;
  }

  .specimenCellList li {
    margin: 10px 0;
  }

  .longLabel {
    .el-form-item__label {
      width: 120px !important;
    }
    .el-form-item__content {
      margin-left: 120px !important;
    }
  }

  .input-for-female {
    .el-form-item__content {
      margin-left: 0 !important;
      width: 140px;
    }
  }

  .radio-for-female {
    .el-form-item__content {
      margin-left: 0 !important;
      width: 70px;
    }
  }

  .el-radio + .el-radio {
    margin-left: 10px;
  }
</style>
