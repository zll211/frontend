
import {rejectService} from "./rejectspecimen.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';

export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab,
  },
  data() {
    return {
      loading: false,
      caseLogDialog: false,
      dialoagLoading: false,
      tableData: [],
      pagination: {},
      specimenSearchInput: '',
      tablePageSize: 10,
      countList: {},
      activeName: 'routine',
    };
  },
  mounted: function () {
    this.getTable();
  },
  methods: {
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    handleClick() {
      this.getTable();
    },
    handleCurrentChange(val){  // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val) {  // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      rejectService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.specimenSearchInput,
        case_type: this.activeName,
      }, rest, this.searchParams))
        .then((res) => {
          this.tableData = [];
          let tableData = [];
          this.pagination = res.body.meta.pagination;
          tableData = res.body.data.map((item) => {
            return {
              id: item.id,
              case_type: item.case_type,
              treat_type: item.treat_type,
              patient_name: item.patient_name,
              gender: item.gender,
              inspection_hospital: item.inspection_hospital,
              inspection_department: item.inspection_department,
              inspection_doctor: item.inspection_doctor,
              inspection_date: item.inspection_date,
              status: item.status,
              specimen_num: item.specimen_num,
              age: item.age + item.age_unit,
              specimen: item.specimen
            }
          });
          tableData.forEach((spec) => {
            this.tableData = [...this.tableData, ...spec.specimen.map((item, index) => {
              if (index === 0) item.count = spec.specimen.length;
              item.id = spec.id;
              item.treat_type = spec.treat_type;
              item.patient_name = spec.patient_name;
              item.age = spec.age;
              item.inspection_hospital = spec.inspection_hospital;
              item.inspection_department = spec.inspection_department;
              item.gender = spec.gender;
              return item;
            })];
          });
        }).finally(() => {
        this.loading = false;
        this.getCaseNo();
      });
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.specimenSearchInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.specimenSearchInput = searchInput;
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },
    getCaseNo() {
      rejectService.getCaseNo().then((res) =>{
        this.countList = res.body;
      })
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4|| columnIndex === 5|| columnIndex === 6) {
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
  },
};
