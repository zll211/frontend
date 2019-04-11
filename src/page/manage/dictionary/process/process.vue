<template>
  <main class="main-container"
        v-loading="loading">
    <div class="flex justify-content-between align-self-center">
      <pis-title label="检查流程"></pis-title>
      <el-button type="primary" size="small" @click="saveProcess">保存</el-button>
    </div>
    <el-row class="process-main flex column">
      <div class="process-table-row">
        <span class="flex-1 table-td bold">名称/流程</span>
        <span class="flex-1 table-td border-left bold"
              v-for="(head, index) in headList"
              :key="index">{{head.name==='切片'?'切片/制片':head.name}}</span>
      </div>
      <div v-for="(process, index) in processList" :key="index"
           class="process-table-row">
        <span class="flex-1 table-td">{{process.label}}</span>
        <el-checkbox class="flex-1 table-td border-left"
                     v-for="(item, index) in process.data"
                     v-model="item.checked"
                     :key="index"
                     :disabled="item.disabled"></el-checkbox>
      </div>
    </el-row>
    <pis-title label="技术医嘱选项"></pis-title>
    <!--<el-row class="process-main flex column">
      <div v-for="(process, index) in processTecList" :key="index"
           class="process-table-row">
        <span class="flex-1 table-td"><el-checkbox v-model="process.checked">{{process.label}}</el-checkbox></span>
        <el-checkbox class="flex-1 table-td border-left"
                     v-for="(item, index) in process.data"
                     v-model="item.checked"
                     :key="index"
                     :disabled="item.disabled"></el-checkbox>
      </div>
    </el-row>-->
    <el-row class="process-main" style="padding: 20px">
      <el-checkbox-group v-model="tecProcess">
        <el-checkbox v-for="(process, index) in columnTecList" :key="index" :label="process.label"></el-checkbox>
      </el-checkbox-group>
    </el-row>
    <pis-title label="特检医嘱选项"></pis-title>

    <el-row class="process-main" style="padding: 20px">
      <el-checkbox-group v-model="specProcess">
        <el-checkbox v-for="(process, index) in columnSpecList" :key="index" :label="process.label"></el-checkbox>
      </el-checkbox-group>
    </el-row>
    <!--<el-row class="process-main flex column">
      <div v-for="(process, index) in processSpecList" :key="index"
           class="process-table-row">
        <span class="flex-1 table-td"><el-checkbox v-model="process.checked">{{process.label}}</el-checkbox></span>
        <el-checkbox class="flex-1 table-td border-left"
                     v-for="(item, index) in process.data"
                     v-model="item.checked"
                     :key="index"
                     :disabled="item.disabled"></el-checkbox>
      </div>
    </el-row>-->

    <pis-title label="诊断附加项"></pis-title>
    <el-row class="process-main" style="padding: 20px">
      <el-checkbox-group v-model="clinicalProcess">
        <el-checkbox label="本地阅片"></el-checkbox>
        <!--<el-checkbox label="科内会诊"></el-checkbox>-->
        <el-checkbox label="远程会诊"></el-checkbox>
      </el-checkbox-group>
    </el-row>
  </main>
</template>

<script src="./process.components.js"></script>

<style scoped lang="scss">
  @import "../../../../style/variables";

  .process-main {
    margin: 20px 0;
    background: #fff;
    .process-table-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border: 1px solid $_pm-default-border-color;
      .table-td {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 14px;
      }
      .el-checkbox {
        & + .el-checkbox {
          margin-left: 0;
        }
      }
      .border-left {
        border-left: 1px solid $_pm-default-border-color;
      }
    }
  }

</style>
