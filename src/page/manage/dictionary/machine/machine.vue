<template>
  <div class="machine-page main-container">
    <el-row style="background-color: #ffffff;padding: 20px;border-radius: 5px;">
      <el-row style="margin-bottom: 10px">
        <span style="margin-right: 5px">配置项切换</span>
        <el-select v-model="selectDoctor" auto-complete="on" clearable size="small" placeholder="请选择配置项" @change="selectDoctorChange">
          <el-option label="默认" value="默认"></el-option>
          <el-option v-for="(item,index) in userList" :key="index" :label="item.realname" :value="item.id"></el-option>
        </el-select>
      </el-row>
      <el-form :model="machineForm"  ref="machineForm" label-position="left" label-width="90px" size="small" v-loading="loading">
        <pis-title label="常规制片默认机器配置" style="margin-bottom: 10px;"></pis-title>
        <el-form-item label="脱水机器">
          <el-select v-model="machineForm.normal_dehydrationMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in dehydrationMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包埋机器">
          <el-select v-model="machineForm.normal_entrapmentMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in entrapmentMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="切片机器">
          <el-select v-model="machineForm.normal_sectionMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in sectionMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="染色机器">
          <el-select v-model="machineForm.normal_dyeingMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in dyeingMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封片机器">
          <el-select v-model="machineForm.normal_sealMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in sealMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      <pis-title label="细胞制片默认机器配置" style="margin-bottom: 10px;"></pis-title>

        <el-form-item label="切片机器">
          <el-select v-model="machineForm.cell_sectionMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in sectionMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="染色机器">
          <el-select v-model="machineForm.cell_dyeingMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in dyeingMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封片机器">
          <el-select v-model="machineForm.cell_sealMachine" auto-complete="on" clearable>
            <el-option v-for="(item,index) in sealMachineList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人使用">
          <el-checkbox v-model="self">{{self?'已勾选，配置个人使用机器':'未勾选，配置默认机器'}}</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="saveMachine">保存</el-button>
    </el-row>
  </div>
</template>

<script src="./machine.component.js"></script>
