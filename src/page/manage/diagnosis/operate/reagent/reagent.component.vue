<template>
  <el-dialog class="reagent-dialog" :title="title" width="600px"
             :visible.sync="reagentVisible"
             :before-close="beforeClose">
    <pis-transfer
      v-loading="reagentLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      v-model="reagentValue"
      :data="reagents"
      label-width="100%"
      :titles="['试剂列表', '已选试剂']">
      <template slot="leftTitle" slot-scope="scope">
        <el-button type="primary" size="mini" @click="selectPackage">
          选择套餐
        </el-button>
      </template>
    </pis-transfer>
    <el-dialog
      class="reagent-inner-dialog"
      width="600px"
      title="选择套餐"
      :visible.sync="packageVisible"
      append-to-body>
      <el-row class="reagent-package-container flex wrap">
        <div class="reagent-package" v-for="pack in reagentPackages"
             :key="pack.id">
          <p class="package-title">
            <pis-checkbox v-model="pack.checked">{{pack.name}}</pis-checkbox>
          </p>
          <div class="package-list">
            <el-tag v-for="id in pack.idList" :key="id">
              {{getReagentName(id)}}
            </el-tag>
          </div>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" size="mini" @click="confirmPackage">确定
        </el-button>
        <el-button type="info" size="mini" plain
                   @click="packageVisible = false">取消
        </el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer flex row justify-content-end">
      <el-button type="primary" size="mini" @click="confirm">确定
      </el-button>
      <el-button type="info" size="mini" plain
                 @click="beforeClose()">取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {reagentService} from "../../../dictionary/base/reagent/reagent.service";
  import pisTransfer from "../../../../../common/components/pisTransfer";
  import pisCheckbox from "../../../../../common/components/pisCheckbox";

  export default {
    components: {pisTransfer, pisCheckbox},
    data() {
      return {
        reagentValue: [],
        reagentLoading: false,
        reagents: [],
        reagentTotalList: [],
        reagentPackages: [],
        reagentVisible: false,
        packageVisible: false,
      }
    },
    props: {
      title: '',
      visible: false,
      type: '',
      list: Array,
    },
    watch: {
      visible(val) {
        if (val) {
          this.reagentList(this.type);
          this.reagentList(this.type, {enable: 1});
          this.reagentValue = this.list;
        }
        this.reagentVisible = val;
      },
    },
    methods: {
      confirm() {
        this.$emit('confirm', this.reagentValue.map((id) => this.reagents.find((item) => item.key === id)), this.type);
      },
      reagentList(type, params) {
        this.reagentLoading = true;
        reagentService.reagentList(type, params)
          .then((res) => {
            if (params) {
              this.reagents = res.body.data.map((item) => ({
                key: item.id,
                label: item[`dict_name`],
              }));
            } else {
              this.reagentTotalList = res.body.data.map((item) => ({
                key: item.id,
                label: item[`dict_name`],
              }));
            }
          }).finally(() => {
          this.reagentLoading = false;
        })
      },
      beforeClose(done) {
        if (done) done();
        else this.reagentVisible = false;
        this.$emit('update:visible', false)
      },
      selectPackage() {
        this.packageVisible = true;
        this.reagentPackages = [];
        this.reagentPackageList(this.type);
      },
      reagentPackageList(type) {
        reagentService.reagentPackageList(type)
          .then((res) => {
            this.reagentPackages = res.body.data.map((item) => ({
              id: item.id,
              name: item[`package_name`],
              idList: item[`dict_id`],
              checked: false,
            }))
          }).finally(() => {
          // this.loading = false;
        });
      },
      getReagentName(id) {
        return this.reagentTotalList.filter((item) => item.key === id / 1).find((item) => item.key === id / 1).label;
      },
      confirmPackage() {
        let packSet = new Set();
        this.reagentPackages.filter((item) => item.checked).forEach((item) => {
          item.idList.forEach((id) => packSet.add(id));
        });
        const packList = [...packSet];
        this.reagentValue = this.reagents.filter((reagent) => !!~packList.indexOf(reagent.key)).map((item) => item.key);
        this.packageVisible = false;
      },
    },
  }
</script>

<style lang="scss">
  @import "../../../../../style/variables";

  .reagent-dialog {
    .el-dialog__body {
      padding: 10px 20px;
      .pis-transfer {
        display: flex;
        justify-content: center;
        align-items: center;
        .pis-transfer-panel {
          min-width: auto;
          height: 400px;
        }
        .transfer-center {
          width: 80px;
        }
      }
    }
  }

  .reagent-inner-dialog {
    .el-dialog__body {
      padding: 10px 20px;
    }
    .reagent-package-container {
      background: #fff;
      .reagent-package {
        border: 1px solid $_pm-default-border-color;
        min-width: 250px;
        margin: 5px 14px;
        .package-title {
          padding: 0 5px;
          height: 30px;
          display: flex;
          align-items: center;
          font-size: 14px;
          border-bottom: 1px solid $_pm-default-border-color;
          .pis-checkbox {
            margin-bottom: 0;
          }
        }
        .el-tag {
          margin: 5px;
        }
      }
    }
  }

</style>
