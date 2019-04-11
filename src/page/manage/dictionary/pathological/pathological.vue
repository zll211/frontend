<template>
  <main class="main-container">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="data"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="100px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="case_name"
        label="病理类型">
      </el-table-column>
      <el-table-column
        align="center"
        prop="prefix"
        label="默认前缀字母">
        <template slot-scope="scope">
          <el-input style="width: 100px" size="mini"
                    v-model="scope.row.prefix"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="date"
        label="默认中间数">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.date">
            <el-option label="年（yyyy）" value="YYYY"></el-option>
            <el-option label="年月（yyyyMM）" value="YYYYMM"></el-option>
            <el-option label="年月日（yyyyMMdd）" value="YYYYMMDD"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="digit"
        label="可配置数字长度">
        <template slot-scope="scope">
          <el-input style="width: 100px" size="mini"
                    v-model="scope.row.digit"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="operate"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="savePathological(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script src="./pathological.component.js"></script>

<style scoped>

</style>
