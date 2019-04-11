<template>
  <el-row style="height: 100%">
    <pis-search-head
      ref="searchHead"
      :form-id-list="[2,3,4,5,6,7]"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab v-model="activeTabName"
             :tab-list="customTabList"
             @tab-click="handleClick">
      <el-row>
        <el-button type="primary" size="mini"
                   v-show="operateTab&&operateTab.label&&activeTabName !== 'finish'&&activeTabName !== 'total'"
                   @click="confirmOperate(operateTab.name,multipleSelection,'begin')">开始{{operateTab.label}}
        </el-button>
        <el-button type="success" size="mini"
                   v-show="operateTab&&operateTab.label&&activeTabName !== 'finish'&&activeTabName !== 'total'"
                   @click="confirmOperate(operateTab.name,multipleSelection,'done')">结束{{operateTab.label}}
        </el-button>
        <el-button type="danger" size="mini"
                   @click="backOperate()"
                   v-show="activeTabName !== 'finish'&&activeTabName !== 'total'&&activeTabName!==tabList[0].name">
          回退
        </el-button>
        <el-button style="margin: 5px" type="primary" size="mini"
                   @click="printLabel()">标签打印
        </el-button>
        <el-button @click="printSection()" type="primary" size="mini" v-show="activeTabName === 'finish'">切片工作单打印</el-button>
        <!--<el-select style="width: 100px" v-model="status" placeholder="执行状态"
                   clearable size="mini" v-show="statusOptions.length>0">
          <el-option
            v-for="item in statusOptions"
            :key="item.name"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" v-show="status"
                   @click="confirmOperate(status)">确定
        </el-button>-->
      </el-row>
    </pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="size"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      ref="pTable"
      v-loading="loading"
      :data="prodList"
      :span-method="arraySpanMethod"
      @row-click="rowClick"
      @select="handleSelect"
      border
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column fixed="left" type="selection" align="center">
      </el-table-column>
      <el-table-column fixed="left" prop="pathological_id" align="center" label="病理号" min-width="130">
        <template slot-scope="scope">
          <a @click="viewCollect(scope.row.pathological_id)" class="pathology-id">{{scope.row.pathological_id}}</a>
        </template>
      </el-table-column>
      <el-table-column v-for="(data, index) in tableHeaderList"
                       :key="index"
                       :fixed="data.fixed"
                       :prop="data.prop"
                       :label="data.label"
                       :min-width="data['min-width']"
                       :align="data.align">
      </el-table-column>
      <el-table-column prop="operate" align="center" label="操作" fixed="right"
                       :width="operateWidth">
        <template slot-scope="scope">
          <div class="flex align-items-center justify-content-center wrap">
            <el-button style="margin: 5px" type="primary" size="mini"
                       v-if="operateTab.label&&activeTabName !== 'finish'&&activeTabName !== 'total'&&(!scope.row.status_accomplish||scope.row.status_accomplish==='待开始')"
                       @click.stop="confirmOperate(operateTab.name, [scope.row], 'begin')">
              开始{{operateTab.label}}
            </el-button>

            <el-button style="margin: 5px" type="success" size="mini"
                       v-if="operateTab.label&&activeTabName !== 'finish'&&activeTabName !== 'total'&&scope.row.status_accomplish==='进行中'"
                       @click.stop="confirmOperate(operateTab.name, [scope.row], 'done')">
              结束{{operateTab.label}}
            </el-button>
            <el-button style="margin: 5px" type="danger" size="mini"
                       @click.stop="backOperate(scope.row)"
                       v-if="activeTabName !== 'finish'&&activeTabName !== 'total'&&activeTabName!==tabList[0].name">
              回退
            </el-button>

            <el-button style="margin: 5px" type="primary" size="mini"
                       @click.stop="printLabel(scope.row)" v-if="activeTabName === 'finish'||activeTabName === 'total'">
              标签打印
            </el-button>
            <el-button @click.stop="printSection(scope.row)" type="primary" size="mini" v-show="activeTabName === 'finish'">切片工作单打印</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="flex justify-content-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      :current-page="pagination.current_page"
      @current-change="currentChange">
    </el-pagination>
  </el-row>
</template>

<script>

  import pisPageSize from '../../../common/components/pisPageSize';
  import pisList from '../../../common/components/pisList';
  import pisSearchHead from '../../../common/components/pisSearchHead';
  import pisTab from '../../../common/components/pisTab';

  export default {
    created() {

    },
    components: {
      pisPageSize,
      pisList,
      pisSearchHead,
      pisTab,
    },
    mounted() {
      setTimeout(() => {
        this.resize();
      });
      this.$root.$on('size-change', this.resize);
    },
    beforeDestroy() {
      this.$root.$off('size-change', this.resize);
    },
    data() {
      return {
        status: '',
        multipleSelection: [],
        tab: this.tabList[0],
        activeTabName: this.tabName,
        size: 10,
        params: {status: this.tabList[0].label},
        tableHeight: undefined,
      };
    },
    props: {
      pagination: {},
      loading: false,
      prods: {
        type: Array,
        default: function() {
          return [];
        },
      },
      tabList: Array,
      normalCountList: Object,
      tableHeaderData: {
        type: Object,
        default: () => ({}),
      },
      tabName: '',
      expandInfoData: {
        type: Array,
        default: function() {
          return [];
        },
      },
    },
    computed: {
      customTabList() {
        return this.tabList.map((tab) => {
          if (this.normalCountList[tab.name]) {
            tab.number = this.normalCountList[tab.name];
          } else {
            tab.number = 0;
          }
          return tab;
        });
      },
      operateTab() {
        return this.tabList.find((tab) => tab.name === this.activeTabName);
      },
      operateWidth() {
        if (this.activeTabName === 'dehydration' || this.activeTabName === 'production') {
          return 100;
        } else {
          return 200;
        }
      },
      tableHeaderList() {
        const headList = [
          /*{
          'fixed': 'left',
          'label': '病理号',
          'prop': 'pathological_id',
          'align': 'center',
          'min-width': 130,
        }, */
          {
          'label': '姓名',
          'prop': 'patient_name',
          'align': 'center',
          'min-width': 100,
        }, {
          'label': '年龄',
          'prop': 'age',
          'align': 'center',
          'min-width': 80,
        }, {
          'label': '性别',
          'prop': 'gender',
          'align': 'center',
          'min-width': 80,
        }];
        return [...headList, ...this.tableHeaderData[this.operateTab.name]];
      },
      statusOptions() {
        let index = this.tabList.findIndex((tab) => tab.name === this.activeTabName);
        this.status = '';
        return this.tabList.slice(0, index).concat(this.tabList.slice(index + 1, this.tabList.length));
      },
      prodList() {
        let prods = [];
        this.multipleSelection = [];
        this.prods.forEach((prod) => {
          prods = [...prods, ...prod.special_production.map((item, index) => {
            if (index === 0) item.count = prod.special_production.length;
            item.pathological_id = prod.id;
            item.patient_name = prod.patient_name;
            item.age = prod.age + prod.age_unit;
            item.gender = prod.gender;
            return item;
          })];
        });
        return [...prods];
      },
    },
    methods: {
      rowClick(row) {
        this.prodList.filter((prod) => prod.pathological_id === row.pathological_id)
          .forEach((prod) => this.$refs.pTable.toggleRowSelection(prod));
      },
      handleSelect(selection, row) {
        this.prodList.filter((prod) => prod.pathological_id === row.pathological_id && prod !== row)
          .forEach((prod) => this.$refs.pTable.toggleRowSelection(prod));
      },
      resize() {
        const table = this.$refs?.pTable?.$el;
        const {top} = table.getBoundingClientRect();
        const {height} = document.body.getBoundingClientRect();
        this.tableHeight = height - top - 130;
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          if (row.count) {
            return {
              rowspan: row.count,
              colspan: 1,
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      },
      refreshPage() {
        this.params = {status: this.tab.label};
        this.$emit('prod-list', this.params);
      },
      selectChange(params) {
        this.params = {...params, status: this.tab.label, search: this.params?.search, page_size: this.size};
        this.$emit('prod-list', this.params);
      },
      searchList(searchInput) {
        this.params = {...this.params, search: searchInput, page: 1};
        this.$emit('prod-list', this.params);
      },
      pageSizeChange(size) {
        this.size = size;
        this.params = {...this.params, page_size: size, page: 1};
        this.$emit('prod-list', this.params);
      },
      handleSelectionChange(valObj) {
        let list = [];
        valObj.forEach((item) => {
          const prods = this.prodList.filter((prod) => prod.pathological_id === item.pathological_id);
          if (prods.every((prod) => list.includes(prod))) return;
          list = [...list, ...prods];
        });
        this.multipleSelection = list.concat();
      },
      handleClick(tab, event) {
        let index = this.tabList.findIndex((operate) => operate.name === tab.name);
        this.multipleSelection = [];
        this.tab = this.tabList[index];
        this.$refs.searchHead.clear();
        this.params = {status: this.tab.label, page_size: this.size};
        this.$emit('prod-list', this.params);
      },
      backOperate(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需要操作的行');
          return;
        }
        let status = '';
        if (!this.status) {
          const index = this.tabList.findIndex((tab) => tab.name === this.activeTabName);
          status = this.tabList[index - 1].label;
        } else {
          const tab = this.tabList.find((tab) => tab.name === this.status);
          status = tab.label;
        }
        this.$emit('back-operate', {
          status: status,
          rows: row ? [row] : this.multipleSelection.concat(),
          prodParams: this.params,
        });
      },
      currentChange(page) {
        this.params = {...this.params, page, page_size: this.size};
        this.$emit('prod-list', this.params);
      },
      confirmOperate(status, rows, childStatus) {
        if (rows.length === 0) {
          this.$message.warning('请选择需要操作的行');
          return;
        }
        /*const index1 = this.tabList.findIndex((tab) => tab.name === this.activeTabName);
        const index2 = this.tabList.findIndex((tab) => tab.name === status);
        if (index1 > index2 && this.activeTabName !== 'recut') {
          this.backOperate(rows);
          return;
        }*/
        this.$emit('confirm-operate', {
          status: status,
          rows: [...rows],
          childStatus: childStatus,
          prodParams: this.params,
        });
      },
      printLabel(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需要操作的行');
          return;
        }
        this.$emit('print-label', {
          rows: row ? [row] : this.multipleSelection.concat(),
        });
      },
      printSection(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需要操作的行');
          return;
        }
        this.$emit('print-section', {
          rows: row ? [row] : this.multipleSelection.concat(),
          size: this.size,
        });
      },
      viewCollect(id) {
        this.$router.push(`/desk/collectdetail/${id}`);
      },
    },
  };
</script>

<style scoped lang="scss">
  .el-table {
    overflow-y: auto;
  }
</style>
