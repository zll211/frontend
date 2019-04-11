import {messageBoxService} from '../../../../common/service/message.service';
import {roleService} from "./role.service";
import {menuService} from "../menu/menu.service";
import pisIcon from '../../../../common/components/pisIcon';

export default {
  created() {
    this.roleList();
    this.menuList();
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
  components: {
    pisIcon,
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      loading: false,
      filterText: '',
      dialogRole: false,
      isDeleteRole: false,
      roles: [],
      menus: [],
      defaultExpandedKeys: [],
      roleForm: {},
      roleRules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      multipleSelection: [],
      tableHeight: undefined,
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    roleList() {
      this.loading = true;
      roleService.roleList()
        .then((res) => {
          this.roles = res.body.data;
        }).finally(() => {
        this.loading = false;
      });
    },
    resize() {
      const table = this.$refs?.pTable?.$el;
      const {top} = table.getBoundingClientRect();
      const {height} = document.body.getBoundingClientRect();
      this.tableHeight = height - top - 48;
    },
    menuList() {
      menuService.menuList()
        .then((res) => {
          this.menus = res.body.data;
        })
    },
    createRole() {
      this.dialogRole = true;
      if (this.$refs['roleForm']) this.$refs['roleForm'].resetFields();
      this.roleForm = {};
      this.defaultExpandedKeys = [];
    },
    saveRole() {
      const params = {
        name: this.roleForm.name,
        menu: this.$refs.tree.getCheckedKeys(),
        description: this.roleForm.description
      };
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          if (this.roleForm.id) {
            roleService.patchRole(this.roleForm.id, params)
              .then((res) => {
                this.$message.success('修改角色成功');
                this.dialogRole = false;
                this.roleList();
              }).catch(() => {
              this.$message.error('修改角色失败');
            });
          } else {
            roleService.createRole(params)
              .then((res) => {
                this.$message.success('新增角色成功');
                this.dialogRole = false;
                this.roleList();
              }).catch(() => {
              this.$message.error('新增角色失败');
            });
          }
        }
      });
    },
    editRole(role) {
      this.dialogRole = true;
      if (this.$refs['roleForm']) this.$refs['roleForm'].resetFields();
      this.roleForm =  Object.assign({}, role);
      this.defaultExpandedKeys = role.menu.concat();
    },
    cancelRole() {
      this.dialogRole = false;
    },
    batchDeleteRole() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的用户');
        return;
      }
      const ids = this.multipleSelection.map((item) => item.id);
      messageBoxService.delete('是否删除该角色?', '删除后不可恢复')
        .then(() => {
          roleService.deleteRole({id: ids})
            .then((res) => {
              this.$message.success('删除成功');
              this.roleList();
            }).catch((error) => {
            this.$message.success('删除失败');
          })
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    deleteRole(role) {
      messageBoxService.delete('是否删除该角色?', '删除后不可恢复')
        .then(() => {
          roleService.deleteRole({id: role.id})
            .then((res) => {
              this.$message.success('删除成功');
              this.roleList();
            }).catch((error) => {
            this.$message.success('删除失败');
          })
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    forbiddenRole(role, status) {
      roleService.patchRole(role.id, {switch: status})
        .then((res) => {
          this.$message.success('操作成功');
          role.switch = status;
        }).catch(() => {
        this.$message.error('操作失败');
      });
    },
  },
};
