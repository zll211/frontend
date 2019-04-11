<template>
  <el-dialog class="section-dialog" title="切片处理" width="600px"
             :visible.sync="sectionViewVisible"
             :before-close="beforeClose">
    <el-transfer v-model="sectionValue" :data="data" filterable
                 :titles="['切片方式', '已选方式']"></el-transfer>
    <div slot="footer" class="dialog-footer flex row justify-content-end">
      <el-button type="primary" size="mini" @click="confirmSection">确定
      </el-button>
      <el-button type="info" size="mini" plain
                 @click="beforeClose()">取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import pisTransfer from '../../../../../common/components/pisTransfer';
  export default {
    components: {pisTransfer},
    data() {
      return {
        sectionList: [{key: 1, label: '重切'}, {key: 2, label: '深切'}, {
          key: 3,
          label: '薄切'
        }],
        sectionViewVisible: false,
        sectionValue: [],
      }
    },
    props: {
      title: '',
      visible: false,
      list: Array,
      data:{
        type: Array,
        default: () => [],
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.sectionValue = this.list;
        }
        this.sectionViewVisible = val;
      },
    },
    methods: {
      confirmSection() {
        this.$emit('confirm', this.sectionValue.map((id) => this.data.find((item) => item.key === id)));
      },
      beforeClose(done) {
        if (done) done();
        else this.sectionViewVisible = false;
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style lang="scss">
  .section-dialog {
    .el-dialog__body {
      padding: 10px 20px;
      .el-transfer {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-transfer-panel {
          width: auto;
        }
      }
    }
  }
</style>
