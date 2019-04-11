<template>
  <el-row class="pis-tab" type="flex" align="middle" justify="space-between">
    <el-tabs v-model="activeTabName" @tab-click="tabClick">
      <el-tab-pane v-for="tab in customTabList" :key="tab.name" :label="tab.label"
                   :name="tab.name" :lazy="true">
        <span slot="label"><i class="count_number" v-if="tab.number || tab.number === 0">{{tab.number}}</i>{{tab.label}}</span>
      </el-tab-pane>
    </el-tabs>
    <div>
      <slot></slot>
    </div>
  </el-row>
</template>

<script>
  export default {
    name: 'pisTab',
    created() {
      this.activeTabName = this.activeTab;
    },
    model: {
      prop: 'activeTab',
      event: 'input',
    },
    props: {
      tabList: {
        type: Array,
        default: () => [],
      },
      activeTab: '',
    },
    computed: {
      customTabList() {
        return this.tabList.map((tab) => ({...tab}));
      },
    },
    data() {
      return {
        activeTabName: '',
      };
    },
    methods: {
      tabClick(tab, event) {
        this.$emit('input', tab.name);
        this.$emit('tab-click', tab, event);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/variables";

  .pis-tab {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__item {
      color: $_pm-default-table-color;
      &:hover {
        color: $_pm-base-color;
      }
      &.is-active {
        color: $_pm-base-color;
      }
      &:last-child {
        margin-right: 5px;
        padding-right: 20px !important;
      }
      .count_number {
        min-width: 14px;
        height: 14px;
        text-align: center;
        position: absolute;
        right: -5px;
        top: 0;
        background-color: #ff6f6f;
        color: #ffffff;
        font-size: 12px;
        line-height: 12px;
        border-radius: 5px;
        padding: 2px;
      }
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
  }
</style>
