<template>
  <el-row type="flex" justify="start" class="wrap pis-more-search">
    <div v-for="(searchForm,index) in formList"
         :key=index>
      <el-form :model="searchForm" label-position='right'
               :ref="searchForm.name">
        <el-form-item :label="searchForm.label"
                      :label-width="searchForm.labelWidth"
                      :label-position="searchForm.position">
          <el-select v-if="searchForm.type==='select'"
                     :class="searchForm.class"
                     :size="searchForm.size"
                     v-model="searchForm.model"
                     :placeholder="searchForm.placeholder||'请选择'"
                     :clearable="searchForm.clearable"
                     @change="selectChange(searchForm)"
                     @visible-change="$forceUpdate()">
            <el-option :class="searchForm.class"
                       v-for="item in searchForm.selectOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-cascader v-if="searchForm.type==='cascader'"
                       :class="searchForm.class"
                       :size="searchForm.size"
                       :options="searchForm.cascaderOptions"
                       v-model="searchForm.model"
                       :placeholder="searchForm.placeholder||'请选择'"
                       :clearable="searchForm.clearable"
                       :change-on-select="searchForm.changeOnSelect"
                       @change="selectChange(searchForm)"
                       @visible-change="$forceUpdate()">
          </el-cascader>
          <el-date-picker v-if="searchForm.type==='daterange'"
                          :class="searchForm.class"
                          :size="searchForm.size"
                          v-model="searchForm.model"
                          :type="searchForm.type"
                          :align="searchForm.align"
                          :clearable="searchForm.clearable"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="searchForm.pickerOptions"
                          @change="selectChange(searchForm)">
          </el-date-picker>
          <el-date-picker v-if="searchForm.type==='date'"
                          :size="searchForm.size"
                          v-model="searchForm.model"
                          :type="searchForm.type"
                          :align="searchForm.align"
                          :clearable="searchForm.clearable"
                          :placeholder="searchForm.placeholder||'请选择日期'"
                          :picker-options="searchForm.pickerOptions"
                          @change="selectChange(searchForm)">
          </el-date-picker>
          <el-date-picker v-if="searchForm.type==='datetimerange'"
                          :size="searchForm.size"
                          v-model="searchForm.model"
                          :type="searchForm.type"
                          :align="searchForm.align||'right'"
                          :clearable="searchForm.clearable"
                          unlink-panels
                          range-separator="至"
                          :start-placeholder="searchForm.start_placeholder"
                          :end-placeholder="searchForm.end_placeholder"
                          :picker-options="searchForm.pickerOptions"
                          @change="selectChange(searchForm)">
          </el-date-picker>
          <el-date-picker v-if="searchForm.type==='datetime'"
                          :size="searchForm.size"
                          v-model="searchForm.model"
                          :type="searchForm.type"
                          :align="searchForm.align"
                          :clearable="searchForm.clearable"
                          :placeholder="searchForm.placeholder||'请选择日期'"
                          :picker-options="searchForm.pickerOptions"
                          @change="selectChange(searchForm)">
          </el-date-picker>
          <el-input v-if="searchForm.type==='input'"
                    :size="searchForm.size"
                    :placeholder="searchForm.placeholder||'请输入内容'"
                    v-model="searchForm.model"
                    :clearable="searchForm.clearable">
          </el-input>
          <el-button v-if="searchForm.type==='button'" @click="searchInfo"
                     :size="searchForm.size">
            {{searchForm.name}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-row>
</template>

<script>

  import {formatDateTime} from '../../config/utils';
  import {mapState} from 'vuex';


  export default {
    created() {
      this.formInnerList.push(this.inspectionList('hospital'));
      this.formInnerList.push(this.inspectionList('department'));
      this.formInnerList.push(this.inspectionList('doctor'));
    },
    computed: {
      ...mapState(['hospitals', 'departments', 'doctors']),
      formList() {
        let formList = [];
        if (this.searchFormList) {
          formList = this.formInnerList.filter((form, index) => !!this.formIdList.find((item) => (item - 1) === index));
          this.searchFormList.forEach((form) => {
            form.placeholder = form.placeholder || '请选择';
            form.label = form.label || '';
            form.labelWidth = form.labelWidth || '0px';
            form.placeholder = form.placeholder || '请选择';
            form.size = form.size || 'small';
            form.position = form.position || 'right';
            form.clearable = form.clearable === false ? false : true;
          });
          formList = formList.concat(this.searchFormList);
        } else {
          formList = this.formInnerList.filter((form, index) => !!this.formIdList.find((item) => (item - 1) === index));
        }
        ['hospital', 'department', 'doctor'].forEach((type) => {
          let inspection = formList.find((form) => form.name === `inspection_${type}`);
          if (inspection) {
            inspection.selectOptions = this[`${type}s`].map((item) => ({
              label: item[`inspection_${type}_name`],
              value: item[`inspection_${type}_name`],
            }));
          }
        });
        return formList;
      },
    },
    data() {
      return {
        formInnerList: [
          {
            span: 5,
            label: '',
            labelWidth: '0px',
            type: 'select',
            placeholder: '请选择病理分类',
            model: '',
            size: 'small',
            clearable: true,
            selectOptions: [{value: '常规', label: '常规'}, {
              value: '冰冻',
              label: '冰冻',
            }, {value: '细胞', label: '细胞'}],
            name: 'case_type',
          }, {
            span: 5,
            label: '',
            labelWidth: '0px',
            type: 'select',
            placeholder: '请选择就诊类别',
            model: '',
            size: 'small',
            clearable: true,
            selectOptions: [{value: '外院', label: '外院'}, {
              value: '门诊',
              label: '门诊',
            }, {
              value: '住院',
              label: '住院',
            }],
            name: 'treat_type',
          }, {
            span: 5,
            label: '',
            labelWidth: '0px',
            type: 'select',
            placeholder: '请选择外院登记类型',
            model: '',
            size: 'small',
            clearable: true,
            selectOptions: [{value: '标本', label: '标本'}, {
              value: '蜡块',
              label: '蜡块',
            }, {
              value: '玻片',
              label: '玻片',
            }],
            name: 'outside_register_type',
          }, {
            span: 12,
            label: '',
            labelWidth: '0',
            type: 'datetimerange',
            start_placeholder: '请选择送检开始时间',
            end_placeholder: '请选择送检结结束时间',
            model: {},
            size: 'small',
            clearable: true,
            name: 'inspection_time',
          }],
      };
    },
    props: {
      searchFormList: {
        type: Array,
        default: function() {
          return [];
        },
      },
      formIdList: {
        type: Array,
        default: function() {
          return [1, 2, 3, 4, 5, 6, 7];
        },
      },
    },
    methods: {
      searchInfo() {
        this.$emit('change');
      },
      selectChange(form) {
        let _form = {};
        this.formList.forEach((form) => {
          if (form.name === 'inspection_time') {
            _form['begin_at'] = form.model ? formatDateTime(form.model[0]) : undefined;
            _form['end_at'] = form.model ? formatDateTime(form.model[1]) : undefined;
          } else {
            _form[form.name] = form.model ? Object.prototype.toString.call(form.model) === '[object Date]' ? formatDateTime(form.model) : form.model : undefined;
          }
        });
        this.$emit('form-change', _form);
      },
      inspectionList(type) {
        return this.formData(this[`${type}s`], type);
      },
      getTypeValue: function(type) {
        if (type === 'hospital') {
          return '送检医院';
        } else if (type === 'department') {
          return '送检科室';
        } else if (type === 'doctor') {
          return '送检医生';
        }
      },
      formData(data, type) {
        return {
          label: '', // this.getTypeValue(type),
          labelWidth: '0',
          span: 5,
          type: 'select',
          placeholder: `请选择${this.getTypeValue(type)}`,
          model: '',
          size: 'small',
          clearable: true,
          selectOptions: data.map((item) => ({
            label: item[`inspection_${type}_name`],
            value: item[`inspection_${type}_name`],
          })),
          name: `inspection_${type}`,
        };
      },
      clear() {
        this.formList.forEach((form) => form.model = undefined);
      },
    },
  };
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 5px;
    margin-right: 10px;
  }
</style>
