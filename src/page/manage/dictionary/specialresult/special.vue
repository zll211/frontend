<template>
    <div class="special-result-page main-container">
      <div class="special-result-wrapper">
        <pis-title label="特检结果配置"></pis-title>
        <ul class="special-list" v-loading="loading">
          <li v-for="(item, index) in specialList" :key="index">
            <el-input v-model="specialList[index]" size="small" style="width: 200px"></el-input>
            <el-button type="danger" size="small" @click="deleteSpecial(index)">删除</el-button>
          </li>
        </ul>
        <el-button size="small" type="primary" @click="addSpecial">增加</el-button>
        <el-button size="small" type="primary" @click="setSpecialResult">保存</el-button>
      </div>
    </div>
</template>

<script src="./special.component.js"></script>

<style scoped lang="scss">
  .special-result-wrapper{
    width: 280px;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
  }
  .special-list{
    margin: 20px 0;
    li{
      margin: 5px 0;
      .el-input--small .el-input__inner{
        padding-left: 20px;
      }
    }
  }
</style>
