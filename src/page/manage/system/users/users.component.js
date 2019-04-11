import {messageBoxService} from '../../../../common/service/message.service';
import {userService} from './users.service';
import {roleService} from '../role/role.service';
import {organizationService} from '../organization/organization.service';
import pisIcon from '../../../../common/components/pisIcon';
import pisPageSize from '../../../../common/components/pisPageSize';

export default {
  created() {
    this.userList();
    this.roleList();
    this.organizationList();
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
    pisPageSize
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名称'));
      }
      userService.userNameCheck({name:value}).then((res)=>{
        if(res.data.data){
          callback(new Error(res.data.data));
        }
      })
    }
    return {
      users: [],
      _users: [],
      roles: [],
      organizations: [],
      loading: false,
      multipleSelection: [],
      userSearchInput: '',
      pagination:{},
      tablePageSize: 10,
      dialogUser: false,
      userForm: {
        roleIds: [],
        organizationIds: [],
      },
      userRules: {
        name: [
          {required: true, validator: validateName, trigger: 'blur'},
        ],
        realname: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        newpassword: [{required: true, message: '请输入密码', trigger: 'blur'}, {
          validator: this.valPwd, trigger: 'blur',
        }],
        roleIds: [
          {required: true, message: '请选择角色', trigger: 'change'},
        ],
        organizationIds: [
          {required: true, message: '请选择机构', trigger: 'change'},
        ],
      },
      tableHeight: undefined,
    };
  },
  watch: {
    userSearchInput(value) {
      this.userList({search: value})
    },
  },
  methods: {
    resize() {
      const table = this.$refs?.pTable?.$el;
      const {top} = table.getBoundingClientRect();
      const {height} = document.body.getBoundingClientRect();
      this.tableHeight = height - top - 108;
    },
    valPwd(rule, value, callback) {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    userList({page = 1, page_size = this.tablePageSize,...rest} = {  // 获取列表
      page: 1,
      page_size: this.tablePageSize,
    }) {
      this.loading = true;
      userService.userList(Object.assign({
        page: page,
        page_size: page_size,
      }, rest))
        .then((res) => {
          this.pagination = res.body.meta.pagination;
          this.$store.commit('setUserList', res.body.data);
          this.users = res.body.data;
          this.users.forEach((item) => {
            item.organizationName = item.organization.data.organization_name || '';
          });
          this._users = this.users.concat();
        }).finally(() => {
        this.loading = false;
      });
    },
    roleList() {
      roleService.roleList()
        .then((res) => {
          this.roles = [];
          res.body.data.forEach((role) => {
            if (role.switch === 'on') {
              this.roles.push(role);
            }
          });
        });
    },
    organizationList() {
      organizationService.organizationList()
        .then((res) => {
          this.organizations = this.resetArray(res.body.data);
        });
    },
    batchDeleteUser() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的用户');
        return;
      }
      const ids = this.multipleSelection.map((item) => item.id);
      messageBoxService.delete('是否删除该用户?', '删除后不可恢复')
        .then(() => {
          userService.deleteUser({id: ids})
            .then((res) => {
              this.$message.success('删除成功');
              this.userList();
              this.multipleSelection = [];
            }).catch((error) => {
            this.$message.error('删除失败');
          });
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    deleteUser(user) {
      messageBoxService.delete('是否删除该用户?', '删除后不可恢复')
        .then(() => {
          userService.deleteUser({id: user.id})
            .then((res) => {
              this.$message.success('删除成功');
              this.userList();
            }).catch((error) => {
            this.$message.error('删除失败');
          });
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    forbiddenUser(user, status) {
      userService.patchUser(user.id, {switch: status})
        .then((res) => {
          this.$message.success('操作成功');
          user.switch = status;
        }).catch(() => {
        this.$message.error('操作失败');
      });
    },
    createUser() {
      this.dialogUser = true;
      if (this.$refs['userForm']) this.$refs['userForm'].resetFields();
      this.userForm = {
        roleIds: [],
        organizationIds: [],
      };
    },
    editUser(user) {
      this.dialogUser = true;
      if (this.$refs['userForm']) this.$refs['userForm'].resetFields();
      let _form = Object.assign({}, user);
      _form.organizationIds = this.findOrganizationId(this.organizations, user.organization_id).reverse();
      _form.roleIds = user.roles.data.map((item) => item.id);
      _form.password = encodeURIComponent('//:,;');
      _form.newpassword = encodeURIComponent('//:,;');
      this.userForm = _form;
    },
    findOrganizationId(list, id, ids = [], parentList = list) {
      list.forEach((item) => {
        if (item.id === id) {
          ids.push(item.id);
          if (item.parent_id) {
            this.findOrganizationId(parentList, item.parent_id, ids);
          }
        } else if (item.children) {
          this.findOrganizationId(item.children, id, ids, parentList);
        }
      });
      return ids;
    },
    saveUser() {
      let params = {
        name: this.userForm.name,
        realname: this.userForm.realname,
        password: this.userForm.password === encodeURIComponent('//:,;') ? undefined : this.userForm.password,
        email: this.userForm.email,
        phone: this.userForm.phone,
        roles: this.userForm.roleIds,
        organization_id: this.userForm.organizationIds[this.userForm.organizationIds.length - 1],
      };
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.userForm.id) {
            userService.patchUser(this.userForm.id, params)
              .then((res) => {
                this.$message.success('修改用户信息成功');
                this.userList();
                this.dialogUser = false;
              }).catch(() => {
              this.$message.error('修改用户信息失败');
            });
          } else {
            this.$refs['userForm'].validate((valid) => {
              if (valid) {
                userService.createUser(params)
                  .then((res) => {
                    this.$message.success('新增用户成功');
                    this.userList();
                    this.dialogUser = false;
                  }).catch(() => {
                  this.$message.error('新增用户失败');
                });
              }
            });
          }
        }
      });
    },
    cancelUser() {
      this.dialogUser = false;
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            parent_id: item.parent_id,
            value: item.id,
            label: item.organization_name,
            children: this.resetArray(item.children, level + 1),
            level: level,
          };
        } else {
          return {
            id: item.id,
            parent_id: item.parent_id,
            value: item.id,
            label: item.organization_name,
            level: level,
          };
        }
      });
    },
    handleCurrentChange(val) {  // 当前页数改变
      this.userList({page:val,page_size:this.tablePageSize});
    },
    handleSizeChange(val) {  // 每页显示条数改变
      this.tablePageSize = val;
      this.userList({page: 1, page_size: val});
    },
  },
};
