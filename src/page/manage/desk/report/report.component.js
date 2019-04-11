import pisPageSize from '../../../../common/components/pisPageSize';
import {reportService} from "./report.service";
import {formatDateTime, formatDate} from "@/config/utils";
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import {mapState} from "vuex";

export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab
  },
  data() {
    return {
      loading: false,
      pdfLoading: false,
      pageLoading: false,
      isDeleteRole: false,
      pdfViewVisible: false,
      archiveDialog: false,
      exportPdfPath: '',
      archiveId: '',
      archiveProList: [],
      pagination: {},
      selectId: [],
      updateId: [],
      hospitalOptions: [],
      departmentOptions: [],
      searchReportInput: '',
      viewPdf: '',
      printPdf: '',
      tableData: [],
      startDate: '',
      endDate: '',
      tablePageSize: 10,
      notPutoutList: [],
      tableStatus: '已签发',
      activeReportName: 'notPrint',
      countList: {},
    };
  },
  created() {

  },
  mounted() {
    this.getTable();
  },
  computed: {
    ...mapState(['user']),
    searchFormList: function () {
      if (this.tableStatus === "已签发") {
        return [
          {
            type: 'datetime',
            placeholder: '请选择签发时间',
            model: '',
            name: 'filed_begin_at',
          },
        ]
      }
      if (this.tableStatus === "已打印") {
        return [
          {
            type: 'datetime',
            placeholder: '请选择打印时间',
            model: '',
            name: 'report_print_begin_at',
          },
        ]
      }
      if (this.tableStatus === "已发放") {
        return [
          {
            type: 'datetime',
            placeholder: '请选择发放时间',
            model: '',
            name: 'report_grant_begin_at',
          },
        ]
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.label === "待打印") {
        this.tableStatus = '已签发',
          this.notPutoutList = []
        this.tableData = this.notPrintData;
      }
      if (tab.label === "待发放") {
        this.tableStatus = '已打印',
          this.notPutoutList = [{prop: 'report_printed_at', label: '打印时间'}];
        this.tableData = this.notPutoutData;
      }
      if (tab.label === "已发放") {
        this.tableStatus = '已发放',
          this.notPutoutList = [{prop: 'report_printed_at', label: '打印时间'}, {prop: 'report_granted_at', label: '发放时间'}];
      }
      this.getTable();
    },

    handleCurrentChange(val) {  // 当前页数改变
      this.getTable({page: val, page_size: this.tablePageSize});
    },
    handleSizeChange(val) {  // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    viewCollect(id) {
      this.$router.push(`/desk/collectdetail/${id}`);
    },
    getTable({page = 1, page_size = this.tablePageSize, ...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      let contentArr = [];
      let newContentArr = [];
      this.loading = true;
      this.tablePageSize = page_size;
      reportService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        status: this.tableStatus,
        search: this.searchReportInput,
        file_status: '未归档',
      }, rest, this.searchParams))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data.map((item) => {
            return {
              id: item.id,
              case_type: item.case_type,
              treat_type: item.treat_type,
              patient_name: item.patient_name,
              gender: item.gender,
              inspection_hospital: item.inspection_hospital,
              inspection_department: item.inspection_department,
              //inspection_date: item.inspection_date,
              filed_at: item.filed_at,
              status: item.status,
              specimen_num: item.specimen_num,
              age: item.age + item.age_unit,
              report_printed_at: item.report_printed_at,
              report_granted_at: item.report_granted_at,
            }
          });
        }).finally(() => {
        this.loading = false;
        this.getTableCount();
      });
    },
    viewReport(id) { // 预览报告
      this.pdfViewVisible = true;
      this.pdfLoading = true;
      return reportService.printReportPath(id).then((res) => {
        return this.viewPdf = URL.createObjectURL(res.data);
      }).catch((err) => {

      }).finally((e) => {
        this.pdfLoading = false;
        this.pageLoading = false;
      });
    },
    pdfDialogClose() { // 关闭预览报告dialog
      this.viewPdf = '';
    },
    async printReportBtn() {  // 批量打印
      if (this.selectId.length === 0) {
        this.$message({
          message: '请选择需要打印的报告',
          type: 'warning'
        });
      } else {
        this.pageLoading = true;
        if (this.tableStatus === '已签发') {
          let paramsArr = [];
          let idArr = [];
          let paramsStr = '';
          for (let i = 0; i < this.selectId.length; i++) {
            paramsArr.push('ids[]=' + this.selectId[i]);
            idArr.push(this.selectId[i]);
          }
          reportService.updateStatus({
            id: idArr, status: '已打印', report_printed_at: formatDateTime(new Date())
          }).then((res) => {
            this.getTable();
          })
          paramsStr = paramsArr.join('&');
          await this.multiReportPrint(paramsStr);
          this.$el.getElementsByClassName('printIfr')[0].onload = () => {
            setTimeout(() => {
              this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
            }, 100);
          }
        } else {
          let paramsArr = [];
          let paramsStr = '';
          for (let i = 0; i < this.selectId.length; i++) {
            paramsArr.push('ids[]=' + this.selectId[i]);
          }
          paramsStr = paramsArr.join('&');
          await this.multiReportPrint(paramsStr);
          this.$el.getElementsByClassName('printIfr')[0].onload = () => {
            setTimeout(() => {
              this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
            }, 100);
          }
        }
      }
    },
    async printReportSingle(id) {  // 打印报告
      this.pageLoading = true;
      if (this.tableStatus === '已签发') {
        await this.printReport(id);
        this.$el.getElementsByClassName('printIfr')[0].onload = () => {
          setTimeout(() => {
            this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
          }, 100);
        }
        reportService.updateStatus({
          id: id, status: '已打印', report_printed_at: formatDateTime(new Date())
        }).then((res) => {
          this.getTable();
        })
      } else {
        await this.printReport(id);
        this.$el.getElementsByClassName('printIfr')[0].onload = () => {
          setTimeout(() => {
            this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
          }, 100);
        }
      }
    },
    /* afterPrint () {
       alert('print completed...')
     },*/
    sendReportBtn() { // 发放报告
      if (this.selectId.length === 0) {
        this.$message({
          message: '请选择需要发放的报告',
          type: 'warning'
        });
      } else {
        let idArr = [];
        for (let i = 0; i < this.selectId.length; i++) {
          idArr.push(this.selectId[i])
        }
        reportService.updateStatus({
          id: idArr, status: '已发放', report_granted_at: formatDateTime(new Date())
        }).then((res) => {
          this.getTable();
          this.$message.success('报告发放成功。');
        }).catch((err) => {
          this.$message.error('报告发放失败。');
        })
      }
    },
    exportReportBtn() { //导出报告
      if (this.selectId.length === 0) {
        this.$message({
          message: '请选择需要导出的报告',
          type: 'warning'
        });
      } else {
        let paramsArr = [];
        let paramsStr = '';
        for (let i = 0; i < this.selectId.length; i++) {
          paramsArr.push('ids[]=' + this.selectId[i]);
        }
        paramsStr = paramsArr.join('&');
        reportService.multiExportReportPath(paramsStr).then((res) => {
          let anchor = document.createElement('a'), objectUrl = URL.createObjectURL(res.data);
          anchor.setAttribute('href', objectUrl);
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('download', '病理报告.pdf');
          anchor.click();
          URL.revokeObjectURL(objectUrl);
        })
      }
    },
    handleSelectionChange(row) {
      this.selectId = row.map((item) => {
        return item.id
      })
    },

    async printReport(id) { // 获取单个报告打印地址
      return reportService.printReportPath(id).then((res) => {
        return this.printPdf = URL.createObjectURL(res.data);
      }).catch((err) => {

      }).finally((e) => {
        this.pdfLoading = false;
        this.pageLoading = false;
      });
    },
    async multiReportPrint(params) {  // 获取批量报告打印地址
      return reportService.multiPrintReportPath(params).then((res) => {
        return this.printPdf = URL.createObjectURL(res.data);
      }).catch((err) => {

      }).finally((e) => {
        this.pdfLoading = false;
        this.pageLoading = false;
      });
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.searchReportInput = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.searchReportInput = searchInput;
      this.getTable();
    },
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },
    rowClick(row) {
      this.$refs.reportTable.toggleRowSelection(row);
    },
    getTableCount() {
      reportService.reportStatusCount().then((res) => {
        this.countList = res.body.data;
      })
    },
  },
};
