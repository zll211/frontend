
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {specialService} from '../../special/special.service';
import {specialResultService} from '../../dictionary/specialresult/special.service';

export default {
  created() {
    this.prodList();
    this.getSpecialResult();
  },
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab,
  },
  mounted() {
    setTimeout(() => {
      this.resize()
    });
    this.$root.$on('size-change', this.resize);
  },
  beforeDestroy() {
    this.$root.$off('size-change', this.resize);
  },
  data() {
    return {
      prods: [],
      specialResultList:[],
      loading: false,
      tabList: [{label: '常规', name: 'routine', number: 0}, {label: '细胞', name: 'cell', number: 0}],
      activeTabName: 'routine',
      pagination: {total: 0, current_page: 1, per_page: 10},
      searchParams: {},
      searchFormList: [
        {
          type: 'select',
          placeholder: '请选择医嘱类型',
          model: '',
          name: 'special_type',
        },
      ],
      tableHeight: undefined,
      tableHeaderList: [{
        'fixed': 'left',
        'label': '病理号',
        'prop': 'pathological_id',
        'align': 'center',
        'min-width': 130,
      }, {
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
      }, {
        'prop': 'section_number',
        'label': '切片号',
        'min-width': 80,
        'align': 'center',
      }, {
        'prop': 'advice',
        'label': '医嘱内容',
        'min-width': 80,
        'align': 'center',
      }, {
        'prop': 'special_type',
        'label': '医嘱类型',
        'min-width': 80,
        'align': 'center',
      }]
    };
  },
  methods: {
    resize() {
      const table = this.$refs.pTable.$el;
      const {top} = table.getBoundingClientRect();
      const {height} = document.body.getBoundingClientRect();
      this.tableHeight = height - top - 130;
    },
    rowClick(row) {
      this.prods.filter((prod) => prod.pathological_id === row.pathological_id)
        .forEach((prod) => this.$refs.pTable.toggleRowSelection(prod));
    },
    handleSelect(selection, row) {
      this.prods.filter((prod) => prod.pathological_id === row.pathological_id&&prod!==row)
        .forEach((prod) => this.$refs.pTable.toggleRowSelection(prod));
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
    handleClick(tab) {
      this.prodList();
    },
    refreshPage() {
      this.searchParams = {};
      this.prodList();
    },
    selectChange(params) {
      this.searchParams = params;
      this.prodList();
    },
    searchList(searchInput) {
      this.searchParams.search = searchInput;
      this.prodList();
    },
    currentChange(page) {
      this.prodList({
        page: page,
        page_size: this.pagination.per_page,
      });
    },
    pageSizeChange(size) {
      this.prodList({page_size: size});
    },
    prodList({page = 1, page_size = this.pagination.per_page, status = '完成'} = {
      page: 1,
      status: '完成',
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.prods = [];
      specialService.prodList(this.activeTabName, Object.assign({
        page,
        status,
        page_size,
      }, this.searchParams))
        .then((res) => {
          let prods = [];
          res.body.data.forEach((prod) => {
            prods = [...prods, ...prod.special_production.map((item, index) => {
              if (index === 0) item.count = prod.special_production.length;
              item.pathological_id = prod.id;
              item.patient_name = prod.patient_name;
              item.age = prod.age + prod.age_unit;
              item.gender = prod.gender;
              return item;
            })];
          });
          this.prods = [...prods];
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.prods.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.getTableCount();
        this.loading = false;
      });
    },
    changeResult(row, result) {
      specialService.changeSocialResult(this.activeTabName,{
        id: [row.id],
        result: result
      }).then((res) => {
        this.$message.success('保存成功');
      }).catch(() => {
        this.$message.success('保存失败');
      })
    },
    async getTableCount () {
      let routineCount = 0;
      try {
        routineCount = (await specialService.getTableCount('routine'))?.body?.data?.finish;
      } catch (e) {
        routineCount = 0;
      }
      specialService.getTableCount('cell').then((res) =>{
        const cellCount = res.body.data?.finish;
        this.tabList[0].number = routineCount;
        this.tabList[1].number = cellCount;
      })
    },
    getSpecialResult() {
      specialResultService.getSpecialResult({settings_key: ['specialResult']}).then((res)=>{
        this.specialResultList = res.body.data.specialResult?res.body.data.specialResult:[];
      })
    },
  },
};
