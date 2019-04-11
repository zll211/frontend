import pisPageSize from '../../../../common/components/pisPageSize';
import {sendLogiscticsService} from "../sendlogistics/sendlogistics.service";
import { formatDateTime, formatDate } from "@/config/utils";
import {logiscticsService} from "./logistics.service";
import {userService} from "../../system/users/users.service";
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisTab from '../../../../common/components/pisTab';
import pisTitle from '../../../../common/components/pisTitle';
export default {
  components: {
    pisPageSize,
    pisSearchHead,
    pisTab,
    pisTitle
  },
  data() {
    return {
      userInfo:{},
      loading: false,
      countList:{},
      logisticsDialog: false,
      logisticsDetailDialog: false,
      logisticDetail:{},
      sendLogisticsForm: {
        send_content:[
          {content:'',number:'',remark:''}
        ],
      },
      sendLogisticsFormRules: {},
      searchFormList:[
        {
          span: 5,
          type: 'select',
          placeholder: '请选择接收方',
          model: '',
          selectOptions: [],
          name: 'receiver',
        },
        {
          span: 5,
          type: 'datetime',
          placeholder: '请选择派发日期',
          model: '',
          name: 'send_begin_at',
        },
      ],
      sentColumnList:[
        {
          type:'selection',
        },
        {
          label:'物流公司',
          prop:'logistics_company',
          fixed:true,
        },
        {
          label:'快递单号',
          prop:'logistics_number',
          fixed:true,
        },
        {
          label:'接收方',
          prop:'receiver',
        },
        {
          label:'发送方',
          prop:'sender',
        },
        {
          label:'派发日期',
          prop:'send_at',
          width:'160',
        },
        {
          label:'关联材料',
          prop:'send_content',
        },
      ],
      signedColumnList:[
        {
          type:'selection',
        },
        {
          label:'物流公司',
          prop:'logistics_company',
          fixed:true,
        },
        {
          label:'快递单号',
          prop:'logistics_number',
          fixed:true,
        },
        {
          label:'接收方',
          prop:'receiver',
        },
        {
          label:'发送方',
          prop:'sender',
        },
        {
          label:'签收人',
          prop:'signer',
        },
        {
          label:'签收日期',
          prop:'sign_at',
          width:'160',
        },
        {
          label:'派发日期',
          prop:'send_at',
          width:'160',
        },
        {
          label:'关联材料',
          prop:'send_content',
        },
      ],
      tableStatus: '已派发',
      logisticsTab: '派发中',
      ensureReceiveId: '',
      receiverList: [],
      logistics_number: '',
      receiverChangeVal: '',
      tablePageSize: 10,
      tableData: [],
      pagination: {},
      logisticsCompanyList: [],
    }
  },
  computed:{
    senderLeft:function() {
      if(this.logisticDetail.sender){
        return `-${this.logisticDetail.sender.length/2*14}px`;
      }
    },
    receiverLeft:function() {
      if(this.logisticDetail.receiver){
        return `-${this.logisticDetail.receiver.length/2*14}px`;
      }
    }
  },
  created() {
    this.columnList = this.sentColumnList;
    this.getUserInfo();
  },
  mounted() {
    this.getOrganization();
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
    newSendLogistics() {
      this.$router.push({path:`./sendlogistics`});
    },
    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      let contentArr = [];
      let newContentArr = [];
      this.loading = true;
      this.tablePageSize = page_size;
      logiscticsService.getLogisticsTable(Object.assign({
        page: page,
        page_size: page_size,
        status: this.tableStatus,
        search: this.userInfo.organization.data.organization_name
      }, rest, this.searchParams))
        .then((res) => {
          contentArr =  res.body.data.map((item) => {
            if (item.send_content != null){
              return{
                send_content:item.send_content.map((con) => {
                  if(con.content == null && con.number == null){
                    return ' ';
                  }else if (con.content != null && con.number == null) {
                    return con.content;
                  }else if(con.content == null && con.number != null) {
                    return ' ';
                  }else{
                    return con.content + con.number + '个';
                  }
                })
              }
            }
          })
          for(let i=0;i<contentArr.length;i++){
            if(contentArr[i] !== undefined){
              newContentArr.push(contentArr[i].send_content.join(','))
            }
          }
          this.tableData =res.body.data;
          for(let j=0 ;j<this.tableData.length;j++) {
            this.tableData[j].send_content = newContentArr[j];
          }
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
          this.getTableCount();
          this.loading = false;
      });
    },
    getOrganization() {
      sendLogiscticsService.organizationList().then((res)=>{
        this.receiverList = res.body.data;
        this.searchFormList[0].selectOptions = res.body.data.map((item) => {
          return {
            label:item.organization_name,
            value:item.organization_name,
          }
        });
      })
    },
    ensureReceive(val) {
      this.$confirm('确认签收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {};
        params.status = '已签收';
        params.sign_at = formatDateTime(new Date());
        params.signer = this.userInfo.realname;
        sendLogiscticsService.editLogistics(val,params).then((res) => {
          this.getTable();
          this.$message({
            type: 'success',
            message: '签收成功!'
          });
        })
      }).catch((error) => {
        this.$message({
          type: 'info',
          message: '已取消签收'
        });
      });
    },
    getUserInfo() {
      userService.userInfo(window.sessionStorage.getItem('userId')).then((res) => {
        this.userInfo = res.body.data;
        this.getTable();
      });
    },
    logisticsTabHandleClick(tab) {
      if(tab.name === '已签收'){
        this.tableStatus = '已签收';
        this.columnList = this.signedColumnList;
        this.getTable();
      }
      if(tab.name === '派发中') {
        this.tableStatus = '已派发';
        this.columnList = this.sentColumnList;
        this.getTable();
      }
    },
    viewLogistics(row,id) {
      this.logisticsDetailDialog = true;
      this.logisticDetail = row;
    },
    refreshPage() {
      this.$refs.searchHead.clear();
      this.searchParams = {};
      this.logistics_number = '';
      this.getTable();
    },
    searchList(searchInput) {
      this.logistics_number = searchInput;
      this.getTable({logistics_number: this.logistics_number});
    },
    selectChange(params) {
      this.searchParams = params;
      this.getTable(params);
    },

    resetForm() { // 重置表单
      this.$refs.sendLogisticsForm.resetFields();
      this.sendLogisticsForm = {
        send_content:[
          {content:'',number:'',remark:''}
        ],
      }
    },
    closeLogisticsDialog() {
      this.resetForm();
    },
    cancelLogisticsDialog() {
      this.resetForm();
      this.logisticsDialog = false;
    },
    submitLogisticsDialog() {
      let params = this.sendLogisticsForm;
      params.send_at = formatDateTime(new Date());
      params.status = '已派发';
      params.sender = this.$store.state.user.organization.data.organization_name;
      sendLogiscticsService.submitHandForm(params).then((res) => {
        this.$message({
          type:'success',
          message: '保存成功',
        })
        this.resetForm();
        this.getTable();
        this.logisticsDialog = false;
      }).catch((err) => {
      })
    },
    addSendItem() {
      this.sendLogisticsForm.send_content.push({content:'',number:'',remark:''})
    },
    delSendItem(index) {
      this.sendLogisticsForm.send_content.splice(index,1)
    },
    getTableCount () {
      logiscticsService.getTableCount().then((res) =>{
        this.countList = res.body.data;
      })
    },
  },
};
