<template>
  <main class="pis-transfer flex">
    <pis-transfer-panel v-model="selfLeftCheck" class="flex column flex-1"
                        :title="titles[0]"
                        :data="leftList" :loading="loading">
      <slot name="leftTitle" :check-list="selfLeftCheck"></slot>
    </pis-transfer-panel>
    <div
      class="transfer-center flex column align-items-center justify-content-center">
      <el-button :type="selfLeftCheck.length!==0?'primary':''"
                 icon="el-icon-arrow-right"
                 :disabled="selfLeftCheck.length===0"
                 @click="toRight"></el-button>
      <el-button :type="selfRightCheck.length!==0?'primary':''"
                 icon="el-icon-arrow-left"
                 :disabled="selfRightCheck.length===0"
                 @click="toLeft"></el-button>
    </div>
    <pis-transfer-panel v-model="selfRightCheck" class="flex column flex-1"
                        :title="titles[1]"
                        :data="rightList" :loading="loading">
      <slot name="rightTitle"></slot>
    </pis-transfer-panel>
  </main>
</template>

<script>
  import pisCheckbox from './pisCheckbox';
  import PisTransferPanel from "./pisTransferPanel";

  export default {
    name: "transfer",
    components: {
      PisTransferPanel,
      pisCheckbox,
    },
    data() {
      return {
        selfRightCheck: [],
        selfLeftCheck: [],
      };
    },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      labelWidth: {
        type: String,
        default: '100%',
      },
      value: {
        type: Array,
        default: () => [],
      },
      loading: false,
      titles: {
        type: Array,
        default: () => ['列表1', '列表2'],
      },
      leftDefaultChecked: {
        type: Array,
        default: () => [],
      },
      rightDefaultChecked: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      leftList() {
        return this.data.filter((item) => !~this.value.indexOf(item.key)).map((item) => ({
          label: item.label,
          key: item.key,
          width: this.labelWidth,
        }));
      },
      rightList() {
        return this.data.filter((item) => !!~this.value.indexOf(item.key)).map((item) => ({
          label: item.label,
          key: item.key,
          width: this.labelWidth,
        }));
      },
    },
    watch: {
      leftDefaultChecked(val) {
        this.selfLeftCheck = val;
      },
      rightDefaultChecked(val) {
        this.selfRightCheck = val;
      }
    },
    methods: {
      toRight() {
        this.$emit('input', this.selfLeftCheck.concat(this.value));
        this.selfLeftCheck = [];
        this.selfRightCheck = [];
        this.$emit('change', 'right');
      },
      toLeft() {
        this.$emit('input', this.value.filter((item) => !~this.selfRightCheck.indexOf(item)));
        this.selfRightCheck = [];
        this.selfLeftCheck = [];
        this.$emit('change', 'left');
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '../../style/variables';

  .pis-transfer {
    position: relative;
  }

  .transfer-center {
    width: 150px;
    .el-button {
      border-radius: 50%;
      font-size: 17px;
      height: 40px;
      padding: 5px;
      width: 40px;
      & + .el-button {
        margin: 10px 0 0;
      }
    }
  }
</style>
