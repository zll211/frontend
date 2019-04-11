<template>
  <div class="timeout-page main-container">
    <pis-title label="超时时间配置"></pis-title>
    <div class="timeout-form" style="width:260px;margin-top:40px; padding:20px;border-radius:5px;background-color: #ffffff;">
      <el-form :model="timeoutForm"  ref="timeoutForm" label-position="left" label-width="90px" size="small" >
        <!--<el-form-item label="常规病理">
          <el-input v-model="timeoutForm.routine_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.routine_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>-->
        <el-form-item label="小标本">
          <el-input v-model="timeoutForm.small_specimen_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.small_specimen_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="大标本">
          <el-input v-model="timeoutForm.big_specimen_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.big_specimen_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="细胞病理">
          <el-input v-model="timeoutForm.cell_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.cell_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="冰冻病理">
          <el-input v-model="timeoutForm.frozen_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.frozen_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="外院蜡块">
          <el-input v-model="timeoutForm.block_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.block_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="外院玻片">
          <el-input v-model="timeoutForm.slide_timeout" clearable style="width: 160px">
            <el-select v-model="timeoutForm.slide_timeout_unit" style="width: 80px" slot="append" prop="age_unit">
              <el-option label="天" value="days"></el-option>
              <el-option label="小时" value="hours"></el-option>
              <el-option label="分钟" value="minutes"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" style="margin:10px 0 0 185px;" @click="saveTimeout">保存</el-button>
    </div>
  </div>
</template>

<script src="./timeout.component.js"></script>
