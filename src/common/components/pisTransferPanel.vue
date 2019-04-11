<template>
  <div class="pis-transfer-panel flex column flex-1">
    <div class="transfer-title">
      <pis-checkbox v-model="checkTotal"
                    @change="checkedTotal">{{title}}
      </pis-checkbox>
      <div>
        <slot></slot>
        <span
          class="select-info">{{value.length}}/{{data.length}}</span>
      </div>
    </div>
    <div class="filter-input">
      <el-input placeholder="请输入搜索项" size="small"
                type="text" v-model="filterText"></el-input>
    </div>
    <div class="transfer-list flex-1">
      <el-checkbox-group class="flex wrap"
                         v-model="selfCheckList"
                         @change="checkChange">
        <pis-checkbox v-show="showList(item.label)"
                      :style="{width: item.width||'100%'}"
                      v-for="(item,index) in data"
                      :key="index" :label="item.key">
          {{item.label}}
        </pis-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  import pisCheckbox from './pisCheckbox';

  export default {
    name: "pisTransferPanel",
    components: {
      pisCheckbox,
    },
    data() {
      return {
        checkTotal: false,
        filterText: '',
        selfCheckList: [],
      }
    },
    props: {
      value: Array,
      title: String,
      data: {
        type: Array,
        default: () => [],
      },
      loading: false,
    },
    watch: {
      value(val) {
        if (val && val.length > 0) {
          this.selfCheckList = val;
        } else {
          this.selfCheckList = [];
        }
      },
    },
    methods: {
      showList(label) {
        return !!~label.toLocaleUpperCase().indexOf(this.filterText.toLocaleUpperCase());
      },
      checkedTotal(value) {
        if (value) {
          // this.selfCheckList = this.data.map((item) => item.key);
          this.$emit('input', this.data.map((item) => item.key))
        } else {
          this.$emit('input', []);
          // this.selfCheckList = [];
        }
      },
      checkChange(val) {
        this.$emit('input', val);
        // this.selfCheckList = val;
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '../../style/variables';

  .pis-transfer-panel {
    position: relative;
    height: 500px;
    border: 1px solid $_pm-default-border-color;
    background: #fff;
    min-width: 500px;
    .filter-input {
      padding: 10px;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .transfer-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 10px;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .select-info {
      font-size: 12px;
      color: $_pm-default-light-color;
      margin-left: 5px;
    }
    .transfer-list {
      overflow-y: auto;
      padding: 10px;
      .pis-checkbox {
        &:nth-child(1) {
          margin-top: 15px;
        }
      }
    }
  }

  .transfer-loading {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500px;
    i {
      font-size: 48px;
      color: $_pm-base-color;
    }
  }
</style>
