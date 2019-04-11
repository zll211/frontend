<template>
  <main class="pis-template">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleClose">
      <div class="flex">
        <el-checkbox-group v-if="visible" class="flex-1" v-model="modelChecked">
          <pis-checkbox v-for="(model, index) in templates" :label="model"
                        :key="index" @change="checkChange">
            <p style="line-height: 1.8" class="flex align-items-center wrap"
               v-html="model">{{model}}</p>
          </pis-checkbox>
        </el-checkbox-group>
        <div class="config-count flex wrap align-self-start">
          <el-tag v-for="(tag,index) in tagList" :key="index"
                  @click.native="selectCount(tag)">{{tag}}
          </el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeTemplate"
                     size="small">取 消</el-button>
          <el-button type="primary" @click="confirmCheckModel"
                     size="small">确 定</el-button>
        </span>
    </el-dialog>
  </main>
</template>

<script>
  import pisCheckbox from "./pisCheckbox";

  const {forEach} = Array.prototype;

  export default {
    name: "pisTemplate",
    components: {pisCheckbox},
    data() {
      return {
        modelChecked: [],
        resultList: [],
        tagList: [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.2, 1.5, 1.75, 2, 2.5],
      }
    },
    computed: {
      templates() {
        return this.templateList.map((template) => {
          const reg = /(\{\{\s*\}\})/g;
          return template.replace(reg, `<input class="text-input" disabled>`);
        });
      },
    },
    model: {
      prop: 'visible',
      event: 'close'
    },
    props: {
      templateList: {
        type: Array,
        default: () => [],
      },
      title: {
        type: String,
        default: '模板'
      },
      width: {
        type: String,
        default: '1000px'
      },
      visible: Boolean,
    },
    methods: {
      handleClose() {
        this.$confirm('确认关闭？')
          .then(() => {
            this.closeTemplate();
          }).catch(() => {
        });
      },
      closeTemplate() {
        this.modelChecked = [];
        this.resultList = [];
        this.$emit('close', false);
      },
      confirmCheckModel() {
        this.resultList.forEach((result) => {
          result.inputListEl::forEach((input) => {
            result.value = result.value.replace('<input class="text-input" disabled>', input.value);
          });
        });
        this.$emit('confirm', this.resultList.map((result) => result.value).join('\n'));
        this.closeTemplate();
      },
      checkChange(checked, ev) {
        const textValue = ev.target.value;
        const parent = ev.target.parentElement;
        const inputListEl = parent.getElementsByClassName('text-input');
        this.modelChecked = [ev.target.value];
        inputListEl::forEach((input) => {
          input.removeAttribute('disabled');
        });
        const input = {
          inputListEl: inputListEl,
          value: textValue,
        };
        this.resultList.filter((result) => result.inputListEl !== inputListEl).forEach((input) => {
          input.inputListEl::forEach((input) => {
            input.setAttribute('disabled', 'disabled');
          });
        });
        this.resultList = [input];
      },
      selectCount(tag) {
        this.resultList.forEach((result) => {
          for (let input of result.inputListEl) {
            if (!input.value) {
              input.value = tag;
              return;
            }
          }
          /*result.inputListEl::forEach((input) => {

          });*/
        });
      },
    }
  }
</script>

<style lang="scss">
  @import "../../style/variables";

  .pis-template {
    .el-dialog .el-checkbox {
      margin-left: 0;
      margin-bottom: 10px;
      display: block;
      .el-checkbox__label {
        white-space: pre-wrap;
        display: inline;
        line-height: 24px;
      }
    }
    .config-count {
      padding: 0 5px;
      border: 1px solid $_pm-default-border-color;
      width: 200px;
      .el-tag {
        cursor: pointer;
        margin: 5px;
      }
    }
    .text-input {
      width: 40px;
      padding: 0 5px;
      border-bottom: 1px solid #dcdfe6;
      &:focus {
        border-bottom: 1px solid $_pm-base-color;
      }
      &[disabled] {
        background: #fff;
        cursor: not-allowed;
      }
    }
  }
</style>
