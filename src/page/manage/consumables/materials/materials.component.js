import pisTitle from '../../../../common/components/pisTitle';
import {materialsService} from "./materials.service";
import pisIcon from '../../../../common/components/pisIcon';
import pisPageSize from '../../../../common/components/pisPageSize';
export default {
  components: {
    pisTitle,
    pisIcon,
    pisPageSize
  },
  data() {
    return {
      loading:false,
      treeLoading:false,
      groupDialog:false,
      materialsFormDialog:false,
      groupName:'',
      materialsData:[],
      groupAction:'增加',
      filterText: '',
      groupData: [],
      defaultExpandedKeys: [],
      pagination:{},
      materialsForm:{},
      currentGroupId:'',
      materialsFormRules:{
        consumables_name:[
          {required: true, message: '请输入物料名称', trigger: 'blur'}
        ],
        category_id:[
          {required: true, message: '请选择物料分类', trigger: 'blur'}
        ]
      },
      materialsFormAbled:false,
      tableData:[],
      tablePageSize:10,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created() {
    this.getGroupData();
    this.getTable();
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleSelectionChange() {

    },
    handleNodeClick(val) {
      this.currentGroupId = val.id;
      this.getTable();
    },
    handleCurrentChange(val){ // 当前页数改变
      this.getTable({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val){ // 每页显示条数改变
      this.tablePageSize = val;
      this.getTable({page: 1, page_size: val});
    },
    refreshGroupData() {
      this.currentGroupId = '';
      this.getGroupData();
      this.getTable();
    },
    refreshPage() {
      this.getTable();
    },
    getGroupData() {
      this.treeLoading = true;
      materialsService.getGroupData().then((res) =>{
        this.groupData = this.resetArray(res.body.data);
        this.materialsData = this.groupData;
      }).catch((err) =>{
      }).finally(() =>{
        this.treeLoading = false;
      })
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            value: item.id,
            label: item.category_name,
            children: this.resetArray(item.children, level + 1),
            level: level,
          }
        } else {
          return {
            id: item.id,
            value: item.id,
            label: item.category_name,
            level: level,
          }
        }
      });
    },
    addGroup() {  //增加分类
      if(this.$refs.groupTree.getCheckedNodes(false,true).length > 1){
        this.$message.warning('请仅选择一个上级分类。');
        return false;
      }
     if(this.$refs.groupTree.getCheckedNodes(false,true).length === 0){
       this.$confirm('您当前没有选择任何分类，确定要创建一级分类吗?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         this.groupDialog = true;
         this.groupAction = '增加';
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '已取消操作'
         });
       });
     }else{
       this.$confirm(`您当前选择的分类是${this.$refs.groupTree.getCheckedNodes(false,true)[0].label}，确定要在此分类下创建新分类吗?`, '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         this.groupDialog = true;
         this.groupAction = '增加';
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '已取消操作'
         });
       });
     }
    },
    delGroup() {  //删除分类
      let checkedNodes = this.$refs.groupTree.getCheckedNodes(false,true);
      if(checkedNodes.length === 1){
        if(checkedNodes[0].children && checkedNodes[0].children.length > 0 ){
          this.$message.warning('该分类下有子分类，不可删除。');
          return false;
        }else{
          this.$confirm(`确定要删除${checkedNodes[0].label}这个分类吗？`,'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() =>{
            materialsService.delGroup(checkedNodes[0].id).then((res) =>{
              this.$message.success('删除成功。');
              this.getGroupData();
            }).catch((err) =>{
              this.$message.error('删除失败。');
            })
          }).catch(() =>{
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          })
        }
      }else{
        this.$message.warning('请选择且仅选择一个需要删除的分类。');
        return false;
      }
    },
    editGroup() {
      if(this.$refs.groupTree.getCheckedNodes(false,true).length === 1){
        this.groupDialog = true;
        this.groupAction = '编辑';
        this.groupName = this.$refs.groupTree.getCheckedNodes(false,true)[0].label;
      }else{
        this.$message.warning('请选择且仅选择一个分类。');
        return false;
      }
    },
    closeGroupDialog() {
      this.groupDialog = false;
      this.groupName = '';
    },
    cancelGroupDialog() {
      this.groupDialog = false;
      this.groupName = '';
    },
    submitGroupDialog() {
      if(this.groupName === ''){
        this.$message.warning('请输入分类名称。');
        return false;
      }
      if(this.groupAction === '增加'){
        let params = {};
        this.defaultExpandedKeys = [];
        if(this.$refs.groupTree.getCheckedNodes(false,true).length === 0) {
          params = {category_name:this.groupName};
        }else{
          params = {parent_id:this.$refs.groupTree.getCheckedNodes(false,true)[0].id,category_name:this.groupName};
        }
        materialsService.addGroup(params).then((res) =>{
          this.$message.success(`${this.groupName}分类创建成功。`);
          this.getGroupData();
          this.groupDialog = false;
          this.groupName = '';
          this.defaultExpandedKeys.push(res.body.data.id);
        }).catch((err) =>{
          this.$message.error(err.body.errors[0].code);
        })
      }else{
        let params = {};
        this.defaultExpandedKeys= [];
        params = {category_name:this.groupName};
        materialsService.editGroup(this.$refs.groupTree.getCheckedNodes(false,true)[0].id,params).then((res) =>{
          this.$message.success(`${this.groupName}分类修改成功。`);
          this.getGroupData();
          this.groupDialog = false;
          this.groupName = '';
          this.defaultExpandedKeys.push(res.body.data.id);
        }).catch((err) =>{
          this.$message.error('${this.groupName}分类修改失败。');
        })
      }
    },

    /*物品列表函数*/

    getTable({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize
    }) {
      this.loading = true;
      this.tablePageSize = page_size;
      materialsService.getTable(Object.assign({
        page: page,
        page_size: page_size,
        consumables_category_id: this.currentGroupId
      }, rest))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.tableData = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    resetMaterialsForm() {
      this.$refs.materialsForm.resetFields();
      this.materialsForm = {};
      this.materialsFormAbled = false;
    },
    addMaterials() {
      let params = this.materialsForm;
      let consumables_category_id =  this.materialsForm.category_id[ this.materialsForm.category_id.length-1];
      params.consumables_category_id = consumables_category_id;
      materialsService.addMaterials(params).then((res) => {
        this.$message.success('物品增加成功');
        this.resetMaterialsForm();
        this.materialsFormDialog = false;
        this.getTable();
      }).catch((err) => {
        this.$message.error('物品增加失败');
      })
    },

    editMaterials() {
      let params = this.materialsForm;
      let consumables_category_id =  this.materialsForm.category_id[ this.materialsForm.category_id.length-1];
      params.consumables_category_id = consumables_category_id;
      materialsService.editMaterials(this.materialsForm.id,params).then((res) => {
        this.$message.success('物品修改成功');
        this.resetMaterialsForm();
        this.materialsFormDialog = false;
        this.getTable();
      }).catch((err) => {
        this.$message.error('物品修改失败');
      })
    },
    editMaterialsBtn(row,id){
      this.materialsFormDialog = true;
      this.materialsForm = row;
    },
    deleteMaterialsBtn(row,id){
      this.$confirm(`确定要删除这条物料记录吗？`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        materialsService.delMaterials(id).then((res) =>{
          this.$message.success('删除成功。');
          this.getTable();
        }).catch((err) =>{
          this.$message.error('删除失败。');
        })
      }).catch(() =>{
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      })
    },
    closeMaterialsFormDialog() {
      this.resetMaterialsForm();
      this.materialsFormDialog = false;
      this.getTable();
    },
    cancelMaterialsFormDialog() {
      this.resetMaterialsForm();
      this.materialsFormDialog = false;
      this.getTable();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.materialsForm.inventory_upper_limit && this.materialsForm.inventory_lower_limit && parseInt(this.materialsForm.inventory_upper_limit) <= parseInt(this.materialsForm.inventory_lower_limit)){
            this.$message.warning('库存上限必须大于库存下限。');
            return false;
          }
          if(this.materialsForm.id){
            this.editMaterials();
          }else{
            this.addMaterials();
          }
        } else {
          return false;
        }
      });
    },
    viewMaterials(row,id) {
      this.materialsFormDialog = true;
      this.materialsForm = row;
      this.materialsFormAbled = true;
    }
  },
};
