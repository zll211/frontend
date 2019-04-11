<template>
  <div class="pis-search-head">
    <el-row class="wrap" type="flex" justify="space-between"
            style="padding-bottom: 15px">
      <div class="flex align-items-center" v-if="showSearchInput">
        <el-input class="pis-search-input"
                  :placeholder="placeholder" size="small"
                  v-model="searchInput" clearable @clear="searchList"></el-input>
        <el-button type="primary" round @click="searchList" size="small">查询
        </el-button>
        <pis-icon
          v-if="formIdList.length>0||searchFormList.length>0"
          :icon-name="iconName"
          class="more-condition"
          icon-text="更多条件"
          @icon-click="showSearch"></pis-icon>
      </div>
      <div v-if="!showSearchInput"></div>
      <div class="flex align-items-center">
        <div class="flex align-items-center wrap">
          <slot></slot>
          <pis-icon
            class="refresh"
            icon-name="el-icon-refresh"
            icon-text="刷新"
            @icon-click="refreshPage"></pis-icon>
        </div>
      </div>
    </el-row>
    <el-collapse-transition>
      <pis-more-search
        ref="moreSearch"
        v-show="showAdvancedQuery&&showMoreSearch"
        @form-change="selectChange"
        :search-form-list="searchFormList"
        :form-id-list="formIdList">
      </pis-more-search>
    </el-collapse-transition>
  </div>
</template>

<script>
  import pisMoreSearch from '../../common/components/pisMoreSearch';
  import pisIcon from '../../common/components/pisIcon';

  export default {
    components: {
      pisMoreSearch,
      pisIcon,
    },
    mounted() {
      if(this.showSearchInput){
        const input = this.$el.getElementsByClassName('pis-search-input')[0];
        this.searchInput = this.keyword;
        input.onkeydown = (e) => {
          let key = window.event.keyCode;
          if (key === 13) {
            this.searchList();
          }
        }
      }
    },
    beforeDestroy() {
      if(this.showSearchInput) {
        const input = this.$el.getElementsByClassName('pis-search-input')[0];
        input.onkeydown = null;
      }
    },
    data() {
      return {
        searchInput: '',
        showAdvancedQuery: false,
        searchParams: {},
        iconName: 'el-icon-d-arrow-right',
      };
    },
    props: {
      placeholder: {
        type: String,
        default: '病理号/姓名',
      },
      searchFormList: {
        type: Array,
        default: () => [],
      },
      formIdList: {
        type: Array,
        default: () => [1, 2, 3, 4, 5, 6, 7],
      },
      keyword: {
        type: String,
        default: '',
      },
      showSearchInput: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      showMoreSearch() {
        if (this.searchFormList.length === 0 && this.formIdList.length === 0) return false;
        else return true;
      },
    },
    methods: {
      refreshPage() {
        this.clear();
        this.$emit('refresh-page');
      },
      showSearch() {
        this.showAdvancedQuery = !this.showAdvancedQuery;
        if (this.showAdvancedQuery) {
          this.iconName = 'el-icon-d-arrow-left';
        } else {
          this.iconName = 'el-icon-d-arrow-right';
        }
        setTimeout(() => {
          this.$root.$emit('size-change');
        }, 300)
      },
      searchList() {
        /*if (!this.searchInput) {
          this.$message.warning('请输入搜索内容');
          return;
        }*/
        this.$emit('search-list', this.searchInput);
      },
      selectChange(params) {
        params['search'] = this.searchInput;
        this.$emit('select-change', params);
      },
      clear() {
        this.searchInput = '';
        this.$refs.moreSearch.clear();
      }
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables';

  .pis-search-head {
    .pis-search-input {
      width: 217px;
      margin-right: 38px
    }
    .more-condition {
      margin: 0 0 0 35px;
      .icon {
        transform: rotate(90deg);
        font-size: 22px;
      }
      &:hover {
        .icon-text {
          color: $_pm-base-color;
        }
      }
    }

    .refresh {
      .icon {
        color: $_pm-fail-color;
      }
    }
  }


</style>
