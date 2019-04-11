<template>
  <el-row class="pis-page-size" type="flex" align="middle"
          justify="space-between">
    <span>共找到{{totalCount}}条数据</span>
    <div>
      <span>每页：</span>
      <el-select class="size-select" v-model="size" placeholder="请选择" @change="pageSizeChange">
        <el-option
          v-for="item in sizeOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        size: 10,
        sizeOptions: [{value: 10}, {value: 20}, {value: 50}, {value: 100}, {value: 200}],
      };
    },
    props: {
      pageSize: Number,
      totalCount: Number,
      pageSizeOptions: Array,
    },
    created() {
      this.size = this.pageSize || 10;
      this.sizeOptions = this.pageSizeOptions || [{value: 10}, {value: 20}, {value: 50}, {value: 100}, {value: 200}];
    },
    methods: {
      pageSizeChange: function (value) {
        this.$emit('page-size-change', value);
      }
    }
  }
</script>

<style lang="scss">
  @import "../../style/variables";

  .pis-page-size {
    color: $_pm-default-light-color;
    font-size: 14px;
    padding: 20px 0 20px;
    .size-select {
      background-color: $_pm-default-table-line-color;
      width: 70px;
      input {
        border: none;
        background-color: $_pm-default-table-line-color;
      }
    }
  }
</style>
