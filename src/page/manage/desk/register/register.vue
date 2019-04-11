<template>
  <div class="register-page">
    <div class="register left">
      <!--登记表头-->
      <div class="register-head" v-bind:style="{top:changeTop}">
        <el-tabs v-model="registerTypeTab" type="card" @tab-click="registerTabClick" v-if="registerFormRadio === '本院'">
          <el-tab-pane label="常规病理" name="常规" ></el-tab-pane>
          <el-tab-pane label="冰冻" name="冰冻"></el-tab-pane>
          <el-tab-pane label="细胞学" name="细胞"></el-tab-pane>
        </el-tabs>
        <el-tabs v-model="registerTypeTab" type="card" @tab-click="registerTabClick" v-if="registerFormRadio === '外院'">
          <el-tab-pane label="标本" name="标本"></el-tab-pane>
          <el-tab-pane label="蜡块" name="蜡块"></el-tab-pane>
          <el-tab-pane label="玻片" name="玻片"></el-tab-pane>
        </el-tabs>
        <h3 calss="left">登记表</h3>
        <div class="choose-type-radio">
          <el-radio-group v-model="registerFormRadio" @change="registerFormRadioChange">
            <el-radio label="本院">本院</el-radio>
            <el-radio label="外院">外院</el-radio>
          </el-radio-group>
        </div>
        <pis-star v-if="this.pageState === 'edit' " style="position: absolute;right: 160px;top: 12px;" @collect="doCollect" @cancelCollect="cancelCollect" :isCollect="isCollect"></pis-star>
        <el-button class="right reset-register-btn" type="danger" @click="resetForm('registerForm')" v-if="this.pageState === 'add' " size="small" >重置</el-button>
        <el-button class="right delete-register-btn" type="danger" @click="deleteRegister" v-if="this.pageState === 'edit'" size="small">删除</el-button>
        <el-button class="right" type="primary" @click="submitForm('registerForm')" size="small">保存病例</el-button>
      </div>
      <!--登记表-->
      <div class="register-form" v-loading="formLoading">
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
          <!--病理号等信息-->
          <el-row :gutter="0" class="flex align-items-center register-block">
            <el-col :span="8" class="flex align-items-center justify-content-start">
              <el-form-item label="病理号" prop="id" class="pathology-id-item">
                <el-input v-model="registerForm.id" size="small">
                  <el-button slot="append" @click="refreshCaseNo" size="small"><i class="el-icon-refresh refreshIcon"></i></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="HIS导入" class="pathology-id-item">
                <el-input v-model="fromHis" size="small" autofocus>
                  <el-button slot="append" size="small" @click="infoFromHis">导入</el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="加做常规" class="pathology-id-item" v-if="registerTypeTab === '冰冻'&&this.pageState==='add'">
                <el-checkbox v-model="registerForm.and_routine"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="flex align-items-center justify-content-end">
              <el-button size="small" style="margin-right: 0px" v-if="!fullRegister" @click="fullRegister = true"><i class="el-icon-plus"></i> 显示完整登记表</el-button>
              <el-button size="small" style="margin-right: 0px" v-if="fullRegister" @click="fullRegister = false"><i class="el-icon-minus"></i> 显示快捷登记表</el-button>
            </el-col>
          </el-row>
          <!--基本信息-->
          <div class="register-block">
            <div class="top-title">
              <p>基本信息</p>
              <div class="blue-line"></div>
            </div>
            <div class="down-icon" @click="registerInfoFull?registerInfoFull= false:registerInfoFull=true">
              <img :src="this.registerInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'" width="24"/>
            </div>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="姓名" prop="patient_name">
                  <el-input v-model="registerForm.patient_name" size="small" @blur="patientNameBlur()">
                    <el-button slot="append" @click="sameNameSearch">同名</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="registerForm.gender" placeholder="" size="small" clearable>
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                    <el-option label="未知" value="未知"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model.number="registerForm.age" size="small" clearable>
                    <el-select v-model="registerForm.age_unit" style="width: 60px" slot="append" prop="age_unit">
                      <el-option label="岁" value="岁"></el-option>
                      <el-option label="月" value="月"></el-option>
                      <el-option label="天" value="天"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||registerInfoFull" v-show="registerInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="婚否" prop="is_married">
                  <el-radio-group v-model="registerForm.is_married" size="small" clearable>
                    <el-radio label="已婚"></el-radio>
                    <el-radio label="未婚"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="民族" prop="nation">
                  <el-select v-model="registerForm.nation" filterable clearable placeholder="请选择民族" size="small">
                    <el-option
                      v-for="item in nationOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="籍贯" prop="origin">
                  <el-cascader
                    class="origin-cascader"
                    placeholder="请选择籍贯"
                    :options="area"
                    change-on-select
                    filterable
                    v-model="registerForm.origin"
                    expand-trigger="click"
                    separator=""
                    clearable
                    size="small"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||registerInfoFull" v-show="registerInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="职业" prop="career">
                  <el-input v-model="registerForm.career" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="registerForm.phone" size="small" clearable ></el-input>
                </el-form-item>
              </el-col>
              <div v-if="registerForm.gender === '女'">
                <el-col :span="screenWidth > 1228?6:7">
                  <el-form-item prop="last_menses" label="末次月经">
                    <el-date-picker
                      v-model="registerForm.last_menses"
                      type="date"
                      placeholder="请选择"
                      default-time="12:00:00"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                      size="small"
                      clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="radio-for-female">
                    <el-checkbox v-model="registerForm.have_menses_check" size="small" clearable>绝经</el-checkbox>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
          </div>
          <!--本院送检信息-->
          <div class="register-block" v-if="registerTypeTab === '细胞' || registerTypeTab === '冰冻' || registerTypeTab === '常规'">
            <div class="top-title">
              <p>送检信息</p>
              <div class="blue-line"></div>
            </div>
            <div class="down-icon" @click="sendInfoFull?sendInfoFull= false:sendInfoFull=true">
              <img :src="this.sendInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'" width="24"/>
            </div>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="送检医院" prop="inspection_hospital">
                  <el-select v-model="registerForm.inspection_hospital" clearable size="small">
                    <el-option v-for="hospital in hospitalList" :label="hospital.name" :value="hospital.name" :key="hospital.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="送检科室" prop="inspection_department">
                  <el-select v-model="registerForm.inspection_department" clearable size="small">
                    <el-option v-for="department in departmentList" :label="department.name" :value="department.name" :key="department.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="送检医生" prop="inspection_doctor">
                  <el-select v-model="registerForm.inspection_doctor" clearable size="small">
                    <el-option v-for="doctor in doctorList" :label="doctor.name" :value="doctor.name" :key="doctor.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="病理分类" prop="case_type">
                  <el-select v-model="registerForm.case_type" clearable size="small" disabled>
                    <el-option label="常规" value="常规"></el-option>
                    <el-option label="冰冻" value="冰冻"></el-option>
                    <el-option label="细胞" value="细胞"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="就诊类别" prop="treat_type">
                  <el-select v-model="registerForm.treat_type" clearable size="small">
                    <el-option v-for="(item,index) in treatTypeList" :key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="送检时间" prop="inspection_date">
                  <el-date-picker
                    v-model="registerForm.inspection_date"
                    type="datetime"
                    placeholder="送检时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    clearable
                    size="small">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="门诊号" prop="outpatient_number">
                  <el-input v-model="registerForm.outpatient_number" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="病历号" prop="anamnesis_no">
                  <el-input v-model="registerForm.anamnesis_no" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="住院号" prop="admission_number">
                  <el-input v-model="registerForm.admission_number" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="床号" prop="bed_number">
                  <el-input v-model="registerForm.bed_number" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="费别" prop="money_type">
                  <el-select v-model="registerForm.money_type" clearable size="small">
                    <el-option label="自费" value="自费"></el-option>
                    <el-option label="合作医疗" value="合作医疗"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="金额" prop="money">
                  <el-input v-model="registerForm.money" size="small" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||sendInfoFull" v-show="sendInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="病人隐私" prop="secret">
                  <el-select v-model="registerForm.secret" clearable size="small">
                    <el-option label="普通" value="普通"></el-option>
                    <el-option label="隐私" value="隐私"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="传染性标本" class="longLabel" prop="laboratory_tests">
                  <el-radio-group v-model="registerForm.laboratory_tests" size="small" clearable>
                    <el-radio label="是" value="是"></el-radio>
                    <el-radio label="否" value="否"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--外院送检信息-->
          <div class="register-block"  v-if="registerTypeTab === '标本' || registerTypeTab === '蜡块' || registerTypeTab === '玻片' ">
            <div class="top-title">
              <p>送检信息</p>
              <div class="blue-line"></div>
            </div>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="8">
                <el-form-item label="原病理号" prop="original_id">
                  <el-input v-model="registerForm.original_id" clearable size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="病理分类" prop="case_type">
                  <el-select v-model="registerForm.case_type" clearable size="small">
                    <el-option label="常规" value="常规"></el-option>
                    <el-option label="细胞" value="细胞"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="就诊类别" prop="treat_type">
                  <el-select v-model="registerForm.treat_type" clearable size="small" disabled>
                   <!-- <el-option label="门诊" value="门诊"></el-option>-->
                    <el-option label="外院" value="外院"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="8">
                <el-form-item label="送检医院" prop="inspection_hospital">
                  <el-select v-model="registerForm.inspection_hospital" clearable size="small">
                    <el-option v-for="hospital in hospitalList" :label="hospital.name" :value="hospital.name" :key="hospital.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="送检时间" prop="inspection_date">
                  <el-date-picker
                    v-model="registerForm.inspection_date"
                    type="datetime"
                    placeholder="送检时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    clearable
                    size="small">
                  </el-date-picker>
                </el-form-item>
              </el-col>

            </el-row>
            <div v-if="registerTypeTab === '蜡块'">
              <el-row :gutter="screenWidth > 1228?15:5" class="paraffin-form-head">
                <el-col :span="2">
                  <p>序号</p>
                </el-col>
                <el-col :span="4">
                  <p>原蜡块号</p>
                </el-col>
                <el-col :span="5">
                  <p>取材名称</p>
                </el-col>
                <el-col :span="4">
                  <p>取材部位</p>
                </el-col>
                <el-col :span="4">
                  <p>补充描述</p>
                </el-col>
                <el-col :span="5">
                  <span>操作</span>
                  <el-button class="right" size="small" type="primary" @click="addParaffinBlock">增加蜡块</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="screenWidth > 1228?15:5" class="paraffin-form-body"
                      v-for="(item, index) in paraffinBlockList" :key="index">
                <el-col :span="2">
                  <span style="line-height: 32px">{{index+1}}</span>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="item.original_id" size="small"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="item.sample_name" size="small"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="item.sample_source" size="small"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="item.summary" size="small"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-button type="danger" class="el-button--primary"
                             @click="delParaffinBlock(index)" size="small">删除
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <div v-if="registerTypeTab === '玻片'">
              <el-row :gutter="screenWidth > 1228?15:5" class="paraffin-form-head">
                <el-col :span="2">
                  <p>序号</p>
                </el-col>
                <el-col :span="5">
                  <p>原切片号</p>
                </el-col>
                <el-col :span="5">
                  <p>补充描述</p>
                </el-col>
                <el-col :span="5">
                  <span>操作</span>
                  <el-button class="right" size="small" type="primary" @click="addParaffinSection">增加切片</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="screenWidth > 1228?15:5" class="paraffin-form-body"
                      v-for="(item, index) in paraffinSectionList" :key="index">
                <el-col :span="2">
                  <span style="line-height: 32px;">{{index+1}}</span>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="item.original_id" size="small"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="item.summary" size="small"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-button type="danger" class="el-button--primary"
                             @click="delParaffinSection(index)" size="small">删除
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--常规冰冻标本信息-->
          <div v-if="(registerTypeTab === '标本'&&registerForm.case_type === '常规') || registerTypeTab === '常规' || registerTypeTab === '冰冻'">
            <div class="register-block">
              <div class="top-title">
                <p>标本信息</p>
                <div class="blue-line"></div>
              </div>
              <div class="down-icon" @click="specimenInfoFull?specimenInfoFull= false:specimenInfoFull=true">
                <img :src="this.specimenInfoFull?'../../../../assets/img/up.png':'../../../../assets/img/down.png'" width="24"/>
              </div>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="标本类型" prop="specimen_type">
                  <el-select v-model="registerForm.specimen_type" clearable size="small">
                    <el-option label="小标本" value="小标本"></el-option>
                    <el-option label="大标本" value="大标本"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标本固定" prop="specimen_fixed">
                  <el-select v-model="registerForm.specimen_fixed" clearable size="small">
                    <el-option label="10%中性缓冲福尔马林" value="10%中性缓冲福尔马林"></el-option>
                    <el-option label="95%酒精" value="95%酒精"></el-option>
                    <el-option label="其他固定" value="其他固定"></el-option>
                    <el-option label="未固定" value="未固定"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="固定时间" prop="fixed_at">
                  <el-date-picker
                    v-model="registerForm.fixed_at"
                    type="datetime"
                    placeholder="固定时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    clearable
                    size="small">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="screenWidth > 1228?15:0" v-if="fullRegister||specimenInfoFull" v-show="specimenInfoFull">
              <el-col :span="screenWidth > 1228?8:7">
                <el-form-item label="标本件数" prop="specimen_num">
                  <el-input v-model="registerForm.specimen_num" size="small" clearable>

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采取部位" prop="specimen_spot">
                  <el-input v-model="registerForm.specimen_spot" size="small" clearable>

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1228?8:9">
                <el-form-item label="离体时间" prop="leave_body_at">
                  <el-date-picker
                    v-model="registerForm.leave_body_at"
                    type="datetime"
                    placeholder="离体时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    clearable
                    size="small">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <ul class="specimenNormalList">
              <li v-for="(item, index) in specimenNormalItems" :key="index">
                <el-row :gutter="10">
                  <el-col :span="1">
                    <p style="text-align: center;line-height: 32px">{{index+1}}.</p>
                  </el-col>
                  <el-col :span="3">
                    <el-select v-model="item.part" placeholder="通用" prop="item.part" clearable size="small">
                      <el-option label="左侧" value="左侧"></el-option>
                      <el-option label="右侧" value="右侧"></el-option>
                      <el-option label="双侧" value="双侧"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <input @click="cascaderClick(index, $event)" class='cascader-input' v-model="item.specimen_name" placeholder="请选择标本名称" size="small" />
                    <el-cascader
                        class="specimen-name-cascader"
                        expand-trigger="click"
                        :options="normalSpecimenNameList"
                        v-model="item.dict_specimen_id"
                        placeholder="标本名称"
                        prop="specimen_name"
                        @change="cascarderChange(index, $event)"
                        clearable
                        size="mini">
                    </el-cascader>
                  </el-col>
                  <el-col :span="5">
                    <el-input v-model="item.remark" placeholder="备注" prop="remark" size="small" clearable></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" @click="copyNormalSpecimen(index)" size="small">复制</el-button>
                    <el-button type="danger" @click="delNormalSpecimen(index)" size="small">删除</el-button>
                    <el-button type="warning" @click="rejectNormalSpecimen(index)" size="small" v-if="!specimenNormalItems[index].status || specimenNormalItems[index].status === '未取材'">拒收</el-button>
                    <el-button type="warning" @click="cancalRejectNormalSpecimen(index)" size="small" v-if="specimenNormalItems[index].status === '不合格'">撤销拒收</el-button>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <el-button type="primary" class="add-specimen-btn" @click="addSpecimenNormal" size="small">添加标本</el-button>
            <el-form-item label="临床诊断">
              <el-input type="textarea" v-model="registerForm.ext.clinical_opinions" prop="ext" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="病史摘要">
              <el-input type="textarea" v-model="registerForm.ext.medical_history_summary" prop="ext.medical_history_summary" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="手术所见">
              <el-input type="textarea" v-model="registerForm.ext.operation_findings" prop="ext.operation_findings" size="small" clearable></el-input>
            </el-form-item>
            <el-row :gutter="screenWidth > 1228?15:0">
              <el-col :span="screenWidth > 1228?9:11">
                <el-form-item label="标本接收时间" prop="receive_at" class="longLabel">
                  <el-date-picker
                    v-model="registerForm.receive_at"
                    type="datetime"
                    placeholder="接收时间"
                    default-time="12:00:00"
                    :default-value="defaultValueShow"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    clearable
                    size="small">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="标本接收员" prop="receive_doctor" class="longLabel">
                  <el-select v-model="registerForm.receive_doctor" clearable size="small">
                    <el-option v-for="user in userList" :label="user.realname" :value="user.name" :key="user.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          </div>
          <!--细胞标本信息-->
          <div v-if="(registerTypeTab === '标本'&&registerForm.case_type === '细胞')||registerTypeTab === '细胞'">
            <div class="register-block">
              <div class="top-title">
                <p>标本信息</p>
                <div class="blue-line"></div>
              </div>
              <el-row :gutter="screenWidth > 1228?15:0">
                <el-col :span="8">
                  <el-form-item label="标本类型" prop="specimen_type">
                    <el-select v-model="registerForm.specimen_type" @change="cellSpecimenNameChange" clearable size="small">
                      <el-option  v-for="cell in cellSpecimenList" :value="cell.label" :label="cell.label" :id="cell.id" :key="cell.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="取样日期" prop="take_cell_at" >
                    <el-date-picker
                      v-model="registerForm.take_cell_at"
                      type="datetime"
                      placeholder="取样日期"
                      default-time="12:00:00"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                      prop="take_cell_at"
                      clearable
                      size="small">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <ul class="specimenCellList">
                <li v-for="(item, index) in specimenCellItems" :key="index">
                  <el-row :gutter="screenWidth > 1228?15:0">
                    <el-col :span="1">
                      <p style="text-align: center;line-height: 40px">{{index+1}}.</p>
                    </el-col>
                    <el-col :span="7">
                      <el-select v-model="item.specimen_name" placeholder="标本名称" prop="specimen_name" clearable size="small">
                        <el-option  v-for="(cellname,index) in cellNameBySpecimenList" :value="cellname.label" :label="cellname.label" :key="index"></el-option>
                      </el-select>
                    </el-col>

                    <el-col :span="7">
                      <el-input v-model="item.remark" placeholder="备注" prop="remark" size="small" clearable></el-input>
                    </el-col>
                    <el-col :span="5">
                      <el-button type="danger" @click="delCellSpecimen(index)" size="small">删除</el-button>
                      <el-button type="warning" @click="rejectNormalSpecimen(index)" size="small" v-if="!specimenCellItems[index].status || specimenCellItems[index].status !== '不合格'">拒收</el-button>
                      <el-button type="warning" @click="cancalRejectNormalSpecimen(index)" size="small" v-if="specimenCellItems[index].status === '不合格'">撤销拒收</el-button>
                    </el-col>
                  </el-row>
                </li>
              </ul>
              <el-button type="primary" class="add-specimen-btn" @click="addSpecimenCell" size="small">添加标本</el-button>

              <el-form-item label="病史摘要">
                <el-input type="textarea" v-model="registerForm.ext.medical_history_summary" prop="ext.medical_history_summary" size="small" clearable></el-input>
              </el-form-item>
              <el-form-item label="操作所见">
                <el-input type="textarea" v-model="registerForm.ext.operation_findings" prop="ext.operation_findings" size="small" clearable></el-input>
              </el-form-item>
              <el-row :gutter="screenWidth > 1228?15:0">
                <el-col :span="screenWidth > 1228?9:11">
                  <el-form-item label="标本接收时间" class="longLabel" prop="receive_at">
                    <el-date-picker
                      v-model="registerForm.receive_at"
                      type="datetime"
                      placeholder="接收时间"
                      default-time="12:00:00"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                      clearable
                      size="small">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="标本接收员" class="longLabel" prop="receive_doctor">
                    <el-select v-model="registerForm.receive_doctor" clearable size="small">
                      <el-option v-for="user in userList" :label="user.realname" :value="user.name" :key="user.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-button class="right" type="primary" @click="submitForm('registerForm')" size="small" style="margin: 10px 10px">保存病例</el-button>
          <el-button class="right" @click="receiptPrint" size="small" style="margin: 10px 10px">打印回执单</el-button>
        </el-form>
      </div>
    </div>
    <!--已登记表格-->
    <div class="register-table right" v-bind:style="{top:changeTop}" >
      <el-form>
        <el-input v-model="registerSearchInput" placeholder="病理号/姓名" class="register-search-input" size="small" clearable>
          <el-button slot="append" @click="searchRegisterTable">搜索</el-button>
        </el-input>
      </el-form>
      <el-table
        :data="registerTable"
        v-loading="loading"
        highlight-current-row
        header-row-class-name = "register-table-header">
        <el-table-column
          prop="id"
          label="病理号"
          width="120"
          align="center">
          <template slot-scope="scope">
            <a @click="getInfo(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="姓名"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.screenWidth > 1180"
          prop="gender"
          label="性别"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          v-if="this.screenWidth > 1228"
          prop="age"
          label="年龄"
          width="50"
          align="center">
        </el-table-column>
      </el-table>
      <pis-pagination
        :pis-pagination="pisPagination"
        @nextPage = "pisNextPage"
        @prePage = "pisPrePage">
      </pis-pagination>
    </div>
    <!--同名病例匹配dialog-->
    <el-dialog title="同名病例" :visible.sync="sameNameDialog" center width="70%">
      <el-table
        v-loading="sameNameTableloading"
        ref="sameNameTable"
        highlight-current-row
        :data="sameNameTableData"
        tooltip-effect="dark"
        @row-click="sameNameTableRowClick"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column
          prop="id"
          label="病理号"
          align="center"
          fixed>
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop='age'
          label="年龄"
          align="center">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center">
        </el-table-column>
        <el-table-column
          prop="admission_number"
          label="住院号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align="center">
        </el-table-column>
        <!--<el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <div class="flex justify-content-center">
              <el-button type="primary" @click="bindHistoryPathology(scope.row.id)" size="mini">绑定</el-button>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindHistoryPathology" size="small">绑定</el-button>
        <el-button @click="cancelSameNameDialog" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!--打印登记回执单dialog-->
    <el-dialog title="打印登记回执单" :visible.sync="receiptDialog" center width="400px">
      <el-form v-model="receiptForm" label-width="100px">
        <el-form-item label="取报告时间" prop="receipt_date">
          <el-date-picker
            v-model="receiptForm.receipt_date"
            type="date"
            placeholder="请选择"
            value-format="yyyy-MM-dd"
            align="right"
            size="small"
            clearable
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="取报告地点" prop="receipt_add">
          <el-input v-model="receiptForm.receipt_add" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="printer">
          <el-input v-model="receiptForm.printer" size="small" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="receiptPrintBtn" size="small">打印</el-button>
        <el-button @click="cancelReceiptDialog" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!--填写拒收标本原因dialog-->
    <el-dialog title="标本拒收原因" :visible.sync="rejectDialog" center width="400px">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5}"
        placeholder="请输入拒收该标本原因"
        v-model="rejectReason">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmRejectBtn" size="small">确定</el-button>
        <el-button @click="cancelRejectBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!--回执单pdf打印iframe-->
    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
  </div>
</template>

<script src="./register.component.js"></script>
<style src="./register.scss"></style>
