
import {messageBoxService} from '../../../../common/service/message.service';
import {nSpecimenService} from "./normal.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';

export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {},
      multipleSelection: [],
      activeName: 'first',
      specimenSearchInput: '',
      tablePageSize: 10,
      tableStatus: '未取材',
      countList:{},
    };
  },
  created() {
    this.getTable();
  },
  methods: {
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    takeSpecimen() {  //取材按钮
      if(this.tableData.length === 0) {
        this.$message.warning('当前没有需要重补取的标本。');
        return false;
      }
      if(this.$refs.specimenTable.selection.length > 1) {
        this.$message.warning('请仅选择一条取材信息。');
        return false;
      }else if(this.$refs.specimenTable.selection.length === 1) {
        this.$router.push(`/specimen/takespecimen/${this.$refs.specimenTable.selection[0].id}`);
      }else if(this.$refs.specimenTable.selection.length === 0) {
        if(this.tableData[0].id){
          this.$router.push(`/specimen/takespecimen/${this.tableData[0].id}`);
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {  // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val) {  // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    editSpecimen(id) {
      this.$router.push(`/specimen/takespecimen/${id}`);
    },
    deleteSpecimen(id) {
      messageBoxService.delete('是否删除该条记录?','删除后不可恢复')
        .then(() => {
          nSpecimenService.delRegister(id).then((res) =>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTable();
          });
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClick(tab, event) {
      if (tab.label === "未取材"){
        this.tableStatus = "未取材";
      }
      if (tab.label === "已取材"){
        this.tableStatus = "已取材";
      }
      if (tab.label === "重补取/脱钙"){
        this.tableStatus = "重补取";
      }
      if (tab.label === "全部"){
        this.tableStatus = ["未取材","重补取","已取材"];
      }
      this.getTable();
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize,
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      nSpecimenService.getRegisterTable(Object.assign({
        page: page,
        page_size: page_size,
        case_type: '常规',
        /*include: 'drawMaterial',*/
        draw_status: this.tableStatus,
        outside_register_type: ['默认','标本'],
        search: this.specimenSearchInput
      }, rest, this.searchParams)).then((res) => {
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
              draw_status: item.draw_status,
              status: item.status,
              specimen_num: item.specimen_num,
              age: item.age + item.age_unit,
              draw_materialer: item.draw_material?item.draw_material.draw_materialer:'',
              recorder: item.draw_material?item.draw_material.recorder:'',
              draw_material_at: item.draw_material?item.draw_material.draw_material_at:'',
            }
          });
        }).finally(() => {
          this.getTableCount();
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
    getTableCount () {
      nSpecimenService.getTableCount().then((res) =>{
        this.countList = res.body.data;
      })
    },
    rowClick(row) {
      this.$refs.specimenTable.toggleRowSelection(row);
    },
    rowDbClick(row) {
      this.editSpecimen(row.id)
    }
  },
};
