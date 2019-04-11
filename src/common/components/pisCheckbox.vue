<template>
  <label class="pis-checkbox"
         :class="{checked: isChecked}">
    <img class="check-img"
         :src="isChecked?'../assets/img/checked.png':'../assets/img/unchecked.png'">
    <input
      v-show="false"
      type="checkbox"
      :value="label"
      v-model="model"
      @change="handleChange">
    <slot></slot>
  </label>
</template>

<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: "pisCheckbox",

    mixins: [Emitter],

    created() {
      this.checked && this.addToStore();
    },
    data() {
      return {
        selfModel: false,
        isLimitExceeded: false
      };
    },
    props: {
      value: {},
      label: {},
      checked: Boolean,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
    },
    computed: {
      model: {
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
              ? this.value : this.selfModel;
        },
        set(val) {
          if (this.isGroup) {
            this.isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true));

            this.isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
            this.selfModel = val;
          }
        }
      },
      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },
      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
    },
    methods: {
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        if (this.isLimitExceeded) return;
        let value;
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel;
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel;
        }
        this.$emit('change', value, ev);
        this.$nextTick(() => {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../style/variables";

  .pis-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    &.checked {
      color: $_pm-base-color;
    }
    .check-img {
      width: 20px;
      height: 20px;
      min-width: 20px;
      margin: 0 10px 0 0;
    }
    & + .pis-checkbox {
      margin-top: 15px;
    }
  }
</style>
