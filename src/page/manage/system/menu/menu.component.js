import pisTitle from '../../../../common/components/pisTitle'
import pisIcon from '../../../../common/components/pisIcon'
import {menuService} from "./menu.service";
import {messageBoxService} from '../../../../common/service/message.service';
import {manageService} from '../../manage.service';
import {baseRoutes, flatteningArray} from '@/config/utils';

export default {
  components: {
    pisTitle,
    pisIcon,
  },
  created() {
    this.menuList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    previousMenus: function () {
      let list = [];
      this.menus.forEach((item) => {
        if (item.level !== 3) {
          list.push({
            value: item.id,
            label: item.label,
            children: item.children ? item.children.map((item) => ({
              value: item.id,
              label: item.label,
            })) : undefined,
          });
        }
      });
      return list;
    }
  },
  methods: {
    resize() {
      const container = this.$el.getElementsByClassName('tree-page');
      const {forEach} = Array.prototype;
      container::forEach((item) => {
        const {top} = item.getBoundingClientRect();
        item.style.height = window.innerHeight - top - 50 + 'px';
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(item, node) {
      this.defaultExpandedKeys = [];
      let _form = Object.assign({}, item);
      _form.previousMenu = [];
      let parent = node.parent;
      while (parent) {
        if (parent.data.id) {
          _form.previousMenu.push(parent.data.id);
        }
        parent = parent.parent
      }
      _form.previousMenu.reverse();
      console.log(_form)
      this.$refs['menuForm'].resetFields();
      this.fileList = [];
      this.iconPath = '';
      this.iconName = '';
      this.iconPath = _form.icon_path;
      this.iconName = _form.icon_name;
      this.menuForm = _form;
      if (_form.iconName && _form.iconPath) {
        this.fileList.push({'name': _form.iconName, 'url': _form.iconPath});
      }
    },
    createMenu() {
      this.$refs['menuForm'].resetFields();
      this.menuForm = {previousMenu: []};
      this.fileList = [];
    },
    saveMenu() {
      /*if(this.menuForm.isShow === true) {
        if(this.fileList.length === 0) {
          this.$message.warning('请上传菜单Icon。');
          return false;
        }
      }*/
      const params = {
        name: this.menuForm.label,
        alias: this.menuForm.alias,
        permission: this.menuForm.permission,
        is_show: this.menuForm.isShow ? '1' : '0',
        uri: this.menuForm.uri,
        description: this.menuForm.description,
        parent_id: this.menuForm.previousMenu[this.menuForm.previousMenu.length - 1] || '',
        icon_path: this.iconPath,
        icon_name: this.iconName,
      };
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          if (this.menuForm.id) {
            menuService.patchMenu(this.menuForm.id, params)
              .then((res) => {
                this.$message.success('修改菜单成功');
                this.menuList();
                this.defaultExpandedKeys = [res.body.data.id];
                if (res.body.data.parent_id) {
                  this.defaultExpandedKeys.push(res.body.data.parent_id);
                }
              }).catch(() => {
              this.$message.error('修改菜单失败');
            });
          } else {
            menuService.createMenu(params)
              .then((res) => {
                this.$message.success('新增菜单成功');
                this.menuList();
                this.defaultExpandedKeys = [res.body.data.id];
                if (res.body.data.parent_id) {
                  this.defaultExpandedKeys.push(res.body.data.parent_id);
                }
              }).catch(() => {
              this.$message.error('新增菜单失败');
            });
          }
        }
      });
    },
    deleteMenu() {
      const checkList = this.$refs.tree.getCheckedKeys();
      if (checkList.length === 0) {
        this.$message.warning('选择要删除的菜单节点');
        return;
      }
      messageBoxService.delete('是否删除该菜单?', '删除后不可恢复')
        .then(() => {
          menuService.deleteMenu({id: checkList})
            .then((res => {
              this.$message.success('删除成功');
              this.menuList();
            })).catch(() => {
            this.$message.error('删除失败');
          });
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    menuList() {
      this.loading = true;
      menuService.menuList()
        .then((res) => {
          this.menus = this.resetArray(res.body.data);
          //
          manageService.userMenus()
            .then((res) => {
              this.$store.commit('setURL', flatteningArray(res.body.data).concat(baseRoutes));
              this.$store.commit('setMenus', res.body.data);
            })
        }).finally(() => {
        this.loading = false;
      });
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            alias: item.alias,
            permission: item.permission,
            label: item.name,
            children: this.resetArray(item.children, level + 1),
            isShow: item.is_show === '1' ? true : false,
            level: level,
            uri: item.uri,
            iconPath: item.icon_path,
            iconName: item.icon_name,
            description: item.description,
          }
        } else {
          return {
            id: item.id,
            label: item.name,
            alias: item.alias,
            permission: item.permission,
            isShow: item.is_show === '1' ? true : false,
            level: level,
            uri: item.uri,
            iconPath: item.icon_path,
            iconName: item.icon_name,
            description: item.description,
          }
        }
      });
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    uploadImgSuccess(response, file, fileList) {
      this.iconName = file.name;
      this.iconPath = response.data.path;
    },
    upMenu() {
      const checkList = this.$refs.tree.getCheckedKeys();
      if (checkList.length === 0) {
        this.$message.warning('请选择要移动的菜单节点');
        return;
      }
      if (checkList.length > 1) {
        this.$message.warning('请仅选择一个要移动的菜单节点');
        return;
      }
      menuService.moveMenu({id:checkList[0],action:'up'}).then((res) =>{
        this.menuList();
      })
    },
    downMenu() {
      const checkList = this.$refs.tree.getCheckedKeys();
      if (checkList.length === 0) {
        this.$message.warning('请选择要移动的菜单节点');
        return;
      }
      if (checkList.length > 1) {
        this.$message.warning('请仅选择一个要移动的菜单节点');
        return;
      }
      menuService.moveMenu({id:checkList[0],action:'down'}).then((res) =>{
        this.menuList();
      })
    },

  },
  data() {
    return {
      filterText: '',
      loading: false,
      menus: [],
      iconPath: '',
      iconName: '',
      fileList: [],
      limit: 1,
      uploadIconData: {'name': 'icon'},
      uploadImgHeader: {'Authorization': `bearer ${window.sessionStorage.getItem('accessToken')}`},
      defaultExpandedKeys: [],
      menuForm: {previousMenu: []},
      menuRules: {
        label: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
        ],
        alias: [
          {required: true, message: '请输入菜单别名', trigger: 'blur'},
        ]
      }
    };
  },
  mounted() {
    this.$root.$on('size-change', this.resize);
    setTimeout(() => this.resize());
  },
  beforeDestroy() {
    this.$root.$off('size-change', this.resize);
  },
};
