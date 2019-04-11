import {searchService} from "./search.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import {caseService} from "../../log/case/case.service";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
  },
  data() {
    return {
      loading: false,
      caseLogDialog: false,
      dialoagLoading: false,
      tableData: [],
      pagination: {},
      multipleSelection: [],
      specimenSearchInput: '',
      tablePageSize: 10,
      logs: [],
    };
  },
  mounted: function () {
    this.getTable();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      searchService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        search: this.specimenSearchInput,
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data.map((item)=>{
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
            }
          });
        }).finally(() => {
        this.loading = false;
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
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    getCaseLog(id) {
      this.caseLogDialog = true;
      this.dialoagLoading = true;
      this.logList({search:id})
    },
    logList({page_size = '', page = 1, ...rest} = {
      page_size: '',
      page: 1
    }) {
      this.logs = [];
      caseService.logList(Object.assign({
        page_size: page_size,
        page: page,
      }, rest))
        .then((res) => {
          const logs = [];
          res.body.data.forEach((item) => {
            item.production.forEach((production) => {
              logs.push({...item, ...production});
            });
            if (item.production.length===0)  logs.push({...item});
          });
          this.logs = [...this.logs, ...logs.map((item) => ({
            id: item.id,
            case_type: item.case_type,
            register: {
              title: '登记',
              content: `<p>登记医生：${item.registor || '无'}</p><p>登记时间：${item.register_at || '无'}</p>`,
              status: (!item.registor && !item.register_at) ? 'wait' : 'finish',
              show: true,
              index: 1,
            },
            draw_material: {
              title: '取材',
              index: 2,
              content: `<p>取材医生：${item.draw_materialer || '无'}</p><p>取材时间：${item.draw_material_time || '无'}</p><p>记录员：${item.recorder || '无'}</p>`,
              status: (!item.draw_materialer && !item.draw_material_time && !item.recorder) ? 'wait' : 'finish',
              show: item.case_type !== '玻片' && item.case_type !== '蜡块' && item.case_type !== '细胞',
            },
            dehydration: {
              title: '脱水',
              content: `<p>脱水操作员：${item.dehydration_operator || '无'}</p><p>脱水时间：${item.dehydration_time || '无'}</p>`,
              status: (!item.dehydration_operator && !item.dehydration_time) ? 'wait' : 'finish',
              show: item.case_type === '常规',
              index: 3,
            },
            entrapment: {
              title: '包埋',
              content: `<p>包埋操作员：${item.entrapment_operator || '无'}</p><p>包埋时间：${item.entrapment_time || '无'}</p>`,
              status: (!item.entrapment_operator && !item.entrapment_time) ? 'wait' : 'finish',
              show: item.case_type === '常规',
              index: 4,
            },
            section: {
              title: '切片',
              content: `<p>切片操作员：${item.section_operator || '无'}</p><p>切片时间：${item.section_time || '无'}</p>`,
              status: (!item.section_operator && !item.section_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片' && item.case_type !== '细胞',
              index: 5,
            },
            dyeing: {
              title: '染色',
              content: `<p>染色操作员：${item.dyeing_operator || '无'}</p><p>染色时间：${item.dyeing_time || '无'}</p>`,
              status: (!item.dyeing_operator && !item.dyeing_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片',
              index: 6,
            },
            seal: {
              title: '封片',
              content: `<p>封片操作员：${item.seal_operator || '无'}</p><p>封片时间：${item.seal_time || '无'}</p>`,
              status: (!item.seal_operator && !item.seal_time) ? 'wait' : 'finish',
              show: item.case_type !== '玻片',
              index: 7,
            },
            diagnosis: {
              title: '诊断',
              content: `<p>诊断医生：${item.clinical_doctor || '无'}</p><p>诊断时间：${item.clinical_time || '无'}</p>`,
              status: (!item.clinical_doctor && !item.clinical_time) ? 'wait' : 'finish',
              show: true,
              index: 8,
            },
            review: {
              title: '审核',
              content: `<p>审核医生：${item.review_doctor || '无'}</p><p>审核时间：${item.review_time || '无'}</p>`,
              status: (!item.review_doctor && !item.review_time) ? 'wait' : 'finish',
              show: true,
              index: 9,
            },
          }))];
          this.logs.forEach((item) => {
            let index = 0;
            item.active = 1;
            for (let prop in item) {
              if (item[prop]::Object.prototype.toString() === "[object Object]" && item[prop].show && item[prop].status === 'finish') {
                index = item[prop].index;
              }
            }
            for (let prop in item) {
              if (item[prop]::Object.prototype.toString() === "[object Object]" && item[prop].show && item[prop].index < index) {
                item.active += 1;
                item[prop].status = 'finish';
              }
            }
          });
        }).finally(() => {
        this.dialoagLoading = false;
      })
    },
    rowClick(row) {
      this.$refs.caseTable.toggleRowSelection(row);
    },
    exportListBtn() {
      let params = Object.assign({
        search:this.specimenSearchInput
      },this.searchParams);
      searchService.exportExcel(params).then((res)=>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', res.body.data.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', '表格统计.xls');
        anchor.click();
        URL.revokeObjectURL(res.body.data.url);
      }).catch((err) =>{
      }).finally((e) =>{

      })
    },
  },
};
