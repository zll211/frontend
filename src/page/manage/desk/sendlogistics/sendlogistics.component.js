
import {mapState} from 'vuex'
import {sendLogiscticsService} from "./sendlogistics.service";
import { formatDateTime, formatDate } from "@/config/utils";
import pisPageSize from '../../../../common/components/pisPageSize';

export default {
  components: {
    pisPageSize,
  },
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `送检医院 ${ i }`,
        });
      }
      return data;
    };
    return {
      loading: false,
      pagination: {},
      tablePageSize: 10,
      logisticsDialogVisible: false,
      sendData: generateData(),
      sendValue:[],
      receiverList:[],
      remark:'',
      activeInputWay:'手动输入',
      sendLogisticsForm:{
        send_content:[
          {content:'',number:'',remark:''}
        ],
      },

      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      rules: {

      },
      sendTableData:[],
    }
  },
  mounted() {
    this.getTable('10','1','未派发');
    this.getOrganization();
  },
  computed: mapState({

  }),
  methods: {
    submitForm(formName) { // 提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLogisticeInfo();
        } else {
          return false;
        }
      });
    },
    sendLogiscticsForm(formName) { // 派发物流
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendLogisctics();
        } else {
          return false;
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.getTable(val,'1','未派发');
    },
    handleCurrentChange(val) {
      this.getTable('10',val,'未派发');
    },
    handleClick() {
      this.resetForm('sendLogisticsForm');
      this.getTable('10','1','未派发');
    },
    addSendItem() {
      this.sendLogisticsForm.send_content.push({content:'',number:'',remark:''})
    },
    delSendItem(index) {
      this.sendLogisticsForm.send_content.splice(index,1)
    },
    handleChange(value, direction, movedKeys) {
    },
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields();
      this[formName] = {
        send_content:[
          {content:'',number:'',remark:''}
        ],
      }
    },
    saveLogisticeInfo() {  // 保存物流信息
      if(!this.sendLogisticsForm.id) {
        let params = this.sendLogisticsForm;
        params.status = '未派发';
        params.sender = this.$store.state.user.organization.data.organization_name;
        sendLogiscticsService.submitHandForm(params).then((res) => {
          this.$message({
            type:'success',
            message: '保存成功',
          })
          this.resetForm('sendLogisticsForm');
          this.getTable('10','1','未派发');
        }).catch((err) => {
        })
      }else{
        let params = this.sendLogisticsForm;
        sendLogiscticsService.editLogistics(this.sendLogisticsForm.id,params).then((res) =>{
          this.$message({
            type:'success',
            message: '保存成功',
          })
          this.resetForm('sendLogisticsForm');
          this.getTable('10','1','未派发');
        }).catch((err) => {
        })
      }

    },
    sendLogisctics() { // 派发物流
      if(!this.sendLogisticsForm.id) {
        let params = this.sendLogisticsForm;
        params.send_at = formatDateTime(new Date());
        params.status = '已派发';
        params.sender = this.$store.state.user.organization.data.organization_name;
        sendLogiscticsService.submitHandForm(params).then((res) => {
          this.$message({
            type:'success',
            message: '保存成功',
          })
          this.resetForm('sendLogisticsForm');
          this.getTable('10','1','未派发');
        }).catch((err) => {
        })
      }else{
        let params = this.sendLogisticsForm;
        params.send_at = formatDateTime(new Date());
        params.status = '已派发';
        sendLogiscticsService.editLogistics(this.sendLogisticsForm.id,params).then((res) =>{
          this.$message({
            type:'success',
            message: '保存成功',
          })
          this.resetForm('sendLogisticsForm');
          this.getTable('10','1','未派发');
        }).catch((err) => {
        })
      }
    },
    getTable(pageSize,page,status) {
      this.loading = true;
      let contentArr = [];
      let newContentArr = [];
      sendLogiscticsService.getLogisticsTable(pageSize,page,status).then((res) => {
        contentArr =  res.body.data.map((item) => {
          if (item.send_content != null){
            return{
              send_content:item.send_content.map((con) => {
                if(con.content == null && con.number == null){
                  return ' ';
                }else if (con.content != null && con.number == null ) {
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
          if(contentArr[i] != undefined){
            newContentArr.push(contentArr[i].send_content.join(','))
          }
        }
        this.sendTableData =res.body.data;
        for(let j=0 ;j<this.sendTableData.length;j++) {
          this.sendTableData[j].send_content = newContentArr[j];
        }
        this.pagination = res.body.meta.pagination;
        this.loading = false;
      }).catch((err) => {
      })
    },
    send(id) {  // 表单中派发
      let params = {};
      params.status = '已派发';
      params.send_at = formatDateTime(new Date());
      sendLogiscticsService.editLogistics(id,params).then((res) =>{
        this.$message({
          type:'success',
          message: '派发成功',
        })
        this.getTable('10','1','未派发');
        this.resetForm('sendLogisticsForm');
      })
    },

    deleteLogistics(val) { // 表单中删除
      let params = {};
      params.id = val;
      sendLogiscticsService.delLogistics(params).then((res) => {
        this.$message({
          type:'success',
          message: '删除成功',
        })
        this.getTable('10','1','未派发');
      })
    },
    rowClick(row,event,column) {
      sendLogiscticsService.getLogisticsInfo(row.id).then((res)=>{
        this.sendLogisticsForm = res.body.data;
      })
    },
    getOrganization() {
      sendLogiscticsService.organizationList().then((res)=>{
        this.receiverList = res.body.data;
      })
    }
  },
};

