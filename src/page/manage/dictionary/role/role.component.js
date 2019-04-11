import {roleConfigService} from './role.service';
import {roleService} from '../../system/role/role.service';
import pisTitle from '../../../../common/components/pisTitle';


export default {
  components: {
    pisTitle
  },
  data() {
    return {
      roles: [],
      role: [],
      roleViewVisible: false,
      loading: false,
      roleConfig: {},
      roleConfigs: [{
        name: 'register',
        label: '登记相关的角色',
        tags: [],
      }, {
        name: 'draw_material',
        label: '取材相关的角色',
        tags: [],
      }, {
        name: 'production',
        label: '制片相关的角色',
        tags: [],
      }, {
        name: 'clinical',
        label: '诊断相关的角色',
        tags: [],
      }, {
        name: 'review',
        label: '审核相关的角色',
        tags: [],
      }, {
        name: 'report',
        label: '报告发放相关的角色',
        tags: [],
      }],
    };
  },
  async created() {
    this.loading = true;
    await this.roleList();
    this.roleConfigList();
  },
  methods: {
    roleList() {
      return roleService.roleList()
        .then((res) => {
          this.roles = res.body.data;
        })
    },
    roleConfigList() {
      roleConfigService.roleConfigList({settings_key: this.roleConfigs.map((config) => config.name)})
        .then(({body}) => {
          const data = body.data;
          for (let prop in data) {
            let roleConfig = this.roleConfigs.find((config) => config.name === prop);
            if (roleConfig) {
              roleConfig.tags =
                data[prop].filter((item) => !!this.roles.find((role) => role.id === item.id))
            }
          }
        }).finally(() => {
        this.loading = false;
      })
    },
    saveRoleConfig() {
      let settings = {};
      this.roleConfigs.forEach((roleConfig) => {
        settings[roleConfig.name] = roleConfig.tags ? roleConfig.tags.map((role) => ({
          id: role.id,
          name: role.name
        })) : [];
      });
      roleConfigService.setRoleConfig({settings})
        .then((res) => {
          this.$message.success('配置成功');
        }).catch(() => {
        this.$message.error('配置失败');
      })
    },
    addRole(roleConfig) {
      this.roleViewVisible = true;
      this.roleConfig = roleConfig;
      this.role = roleConfig.tags.map((tag) => tag.id);
    },
    handleClose(roleConfig, tag) {
      roleConfig.splice(roleConfig.indexOf(tag), 1);
    },
    confirmRole() {
      this.roleConfig.tags = this.role.map((id) => this.roles.find((role) => role.id === id));
      this.roleViewVisible = false;
    },
  }
}
