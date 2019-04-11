<template>
  <main class="reagent-component">
    <pis-title label="试剂配置"></pis-title>
    <pis-transfer
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      v-model="selectList"
      :data="reagents"
      label-width="33.3333%"
      :titles="['平台染色试剂', '本站可配置染色试剂']"
      @change="configReagent(type)">
      <template slot="leftTitle" slot-scope="scope">
        <el-button type="primary" size="mini" @click="addReagent(type)">
          新增
        </el-button>
        <el-button type="primary" size="mini"
                   @click="editReagent(type, scope.checkList)">编辑
        </el-button>
        <el-button type="danger" size="mini"
                   @click="deleteReagent(type, scope.checkList)">删除
        </el-button>
      </template>
    </pis-transfer>
    <div class="flex justify-content-between align-items-center">
      <pis-title label="套餐配置"></pis-title>
      <div>
        <el-button type="primary" size="mini" @click="addReagentPackage(type)">
          新增
        </el-button>
        <el-button type="primary" size="mini"
                   @click="editReagentPackage(type)">编辑
        </el-button>
        <el-button type="danger" size="mini"
                   @click="deleteReagentPackage(type)">删除
        </el-button>
      </div>
    </div>
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
    <el-dialog width="500px" title="新增套餐" :visible.sync="packageView">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="套餐名称">
          <el-input v-model="pack.name" placeholder="请输入套餐名称"></el-input>
        </el-form-item>
        <el-form-item label="套餐试剂">
          <el-select style="width: 100%" v-model="pack.idList" multiple placeholder="请选择套餐试剂" filterable>
            <el-option
              v-for="item in reagents"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="packageView = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm(type)" size="small">确 定
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script>
  import {messageBoxService} from '../../../../../common/service/message.service';
  import {reagentService} from "./reagent.service";
  import pisTransfer from '../../../../../common/components/pisTransfer';
  import pisTitle from '../../../../../common/components/pisTitle';
  import pisCheckbox from "../../../../../common/components/pisCheckbox";

  export default {
    name: "reagent",
    data() {
      return {
        loading: false,
        reagents: [],
        selectList: [],
        reagentPackages: [],
        pack: {
          id: '',
          idList: [],
          name: '',
        },
        packageView: false,
      }
    },
    props: {
      type: String,
    },
    components: {
      pisCheckbox,
      pisTransfer,
      pisTitle,
    },
    mounted() {
      this.reagentList(this.type);
      this.reagentList(this.type, {enable: 1});
      this.reagentPackageList(this.type);
    },
    methods: {
      reagentList(type, params) {
        this.loading = true;
        reagentService.reagentList(type, params)
          .then((res) => {
            if (params) {
              this.selectList = res.body.data.map((item) => item.id);
            } else {
              this.reagents = res.body.data.map((item) => ({
                key: item.id,
                label: item[`dict_name`],
              }));
            }
          }).finally(() => {
          this.loading = false;
        });
      },
      addReagent(type) {
        messageBoxService.prompt(`新增${this.getTypeValue(type)}`, `${this.getTypeValue(type)}`, `请输入${this.getTypeValue(type)}`, '')
          .then(({value}) => {
            let params = {};
            params[`dict_name`] = value;
            reagentService.createReagent(type, params)
              .then((res) => {
                this.reagentList(type);
                this.reagentList(type, {enable: 1});
                this.$message.success(`新增${this.getTypeValue(type)}成功`);
              }).catch(() => {
              this.$message.error(`新增${this.getTypeValue(type)}失败`);
            });
          }).catch(() => {
        })
      },
      editReagent(type, list) {
        if (list.length === 0) {
          this.$message.warning(`请选择修改的${this.getTypeValue(type)}`);
          return;
        }
        if (list.length > 1) {
          this.$message.warning(`只可选择一个${this.getTypeValue(type)}进行修改`);
          return;
        }
        const row = this.reagents.find((item) => item.key === list[0]);
        messageBoxService.prompt(`新增${this.getTypeValue(type)}`, `${this.getTypeValue(type)}`, `请输入${this.getTypeValue(type)}`, row.label)
          .then(({value}) => {
            let params = {};
            params[`dict_name`] = value;
            reagentService.patchReagent(type, row.key, params)
              .then((res) => {
                this.reagentList(type);
                this.reagentList(type, {enable: 1});
                this.$message.success(`修改${this.getTypeValue(type)}成功`);
              }).catch(() => {
              this.$message.error(`修改${this.getTypeValue(type)}失败`);
            });
          }).catch(() => {

        })
      },
      deleteReagent(type, list) {
        if (list.length === 0) {
          this.$message.warning(`请选择删除的${this.getTypeValue(type)}`);
          return;
        }
        if (list.length > 1) {
          this.$message.warning(`只可选择一个${this.getTypeValue(type)}进行删除`);
          return;
        }
        const row = list[0];
        messageBoxService.delete(`是否删除该${this.getTypeValue(type)}`, '')
          .then(() => {
            reagentService.deleteReagent(type, row)
              .then((res) => {
                this.reagentList(type);
                this.reagentList(type, {enable: 1});
                this.$message.success(`删除${this.getTypeValue(type)}成功`);
              }).catch(() => {
              this.$message.error(`删除${this.getTypeValue(type)}失败`);
            });
          }).catch(() => {

        });
      },
      configReagent(type) {
        reagentService.configReagent(type, this.selectList)
          .then((res) => {

          });
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
          this.loading = false;
        });
      },
      addReagentPackage() {
        this.pack = {
          id: '',
          idList: [],
          name: '',
        };
        this.packageView = true;
      },
      editReagentPackage(type) {
        const list = this.reagentPackages.filter((item) => item.checked);
        if (list.length === 0) {
          this.$message.warning(`请选择修改的${this.getTypeValue(type)}套餐`);
          return;
        }
        if (list.length > 1) {
          this.$message.warning(`只可选择一个${this.getTypeValue(type)}套餐进行编辑`);
          return;
        }
        this.pack = Object.assign({}, list[0]);
        this.packageView = true;
      },
      deleteReagentPackage(type) {
        const list = this.reagentPackages.filter((item) => item.checked);
        if (list.length === 0) {
          this.$message.warning(`请选择删除的${this.getTypeValue(type)}套餐`);
          return;
        }
        if (list.length > 1) {
          this.$message.warning(`只可选择一个${this.getTypeValue(type)}套餐进行删除`);
          return;
        }
        const row = list[0];
        messageBoxService.delete(`是否删除该${this.getTypeValue(type)}套餐`, '')
          .then(() => {
            reagentService.deleteReagentPackage(type, row.id)
              .then((res) => {
                this.reagentPackageList(type);
                this.$message.success(`删除${this.getTypeValue(type)}套餐成功`);
              }).catch(() => {
              this.$message.error(`删除${this.getTypeValue(type)}套餐失败`);
            });
          }).catch(() => {

        });
      },
      submitForm(type) {
        if (this.pack.id) {
          reagentService.patchReagentPackage(type, this.pack.id, {
            [`package_name`]: this.pack.name,
            [`dict_id`]: this.pack.idList
          })
            .then((res) => {
              this.reagentPackageList(type);
              this.packageView = false;
              this.$message.success(`修改${this.getTypeValue(type)}套餐成功`);
            }).catch(() => {
            this.$message.error(`修改${this.getTypeValue(type)}套餐失败`);
          });
        } else {
          reagentService.createReagentPackage(type, {
            [`package_name`]: this.pack.name,
            [`dict_id`]: this.pack.idList
          })
            .then((res) => {
              this.packageView = false;
              this.reagentPackageList(type);
              this.$message.success(`新增${this.getTypeValue(type)}套餐成功`);
            }).catch(() => {
            this.$message.error(`新增${this.getTypeValue(type)}套餐失败`);
          });
        }
      },
      getReagentName(id) {
        return this.reagents.find((item) => item.key === id / 1) ? this.reagents.find((item) => item.key === id / 1).label : '';
      },
      getTypeValue(type) {
        return do {
          if (type === 'immunohistochemical') {
            '免疫组化试剂';
          } else if (type === 'dye') {
            '特殊染色试剂';
          }else if (type === 'molecular') {
            '分子病理';
          }
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../../style/variables";

  .reagent-component {
    .el-transfer {
      .el-transfer-panel {
        flex: 1;
      }
    }
    .pis-title {
      margin: 10px 0;
    }
    .reagent-package-container {
      background: #fff;
      padding: 10px;
    }
    .reagent-package {
      border: 1px solid $_pm-default-border-color;
      width: 18%;
      min-width: 300px;
      margin: 10px 1%;
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
</style>
