<template>
  <div class="remote-container flex align-items-center justify-content-center">
    <p class="flex" v-show="!remoteData">正在诊断中</p>
    <el-button v-show="remoteData" type="primary" size="small" @click="pdfViewVisible=true">查看远程报告</el-button>
    <!--预览诊断报告-->
    <el-dialog
      class="remote-dialog"
      title="预览"
      :visible.sync="pdfViewVisible"
      :fullscreen="true">
      <iframe :src="remoteData" style="width: 100%;height: 100%" frameborder="0"
              marginheight="0" marginwidth="0"></iframe>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <!--<el-button type="primary" @click="download">下载</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {slideViewUrl} from '../../../../../config/utils';

  export default {
    data() {
      return {
        pdfViewVisible: false,
      };
    },
    props: {
      remoteData: null,
    },
    methods: {
      download() {
        window.open(slideViewUrl + '' + this.remoteData);
      },
    },
  };
</script>

<style lang="scss">
  .remote-dialog {
    .el-dialog {
      display: flex;
      flex-direction: column;
      .el-dialog__header {
        padding: 10px 20px;
        padding-bottom: 0;
      }
      .el-dialog__body {
        flex: 1;
        padding: 0 20px 10px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .el-dialog__footer {
        display: none;
      }
    }
  }

  .remote-container {
    min-height: 200px;
    background-color: #ffffff;
    border-radius: 4px;
  }
</style>
