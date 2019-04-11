import pisTitle from '../../../../common/components/pisTitle';
import pisIcon from '../../../../common/components/pisIcon';
import {organizationService} from "./organization.service";
import {messageBoxService} from '../../../../common/service/message.service';

export default {
  components: {
    pisTitle,
    pisIcon,
  },
  created() {
    this.organizationList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
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
      _form.previousOrganization = [];
      let parent = node.parent;
      while (parent) {
        if (parent.data.id) {
          _form.previousOrganization.push(parent.data.id);
        }
        parent = parent.parent
      }
      _form.previousOrganization.reverse();
      this.$refs['organizationForm'].resetFields();
      this.organizationForm =  _form;
    },
    createOrganization() {
      this.$refs['organizationForm'].resetFields();
      this.organizationForm = {previousOrganization: []};
    },
    saveOrganization() {
      const params = {
        organization_name: this.organizationForm.label,
        organization_desc: this.organizationForm.desc,
        parent_id: this.organizationForm.previousOrganization[this.organizationForm.previousOrganization.length-1],
      };
      this.$refs['organizationForm'].validate((valid) => {
        if (valid) {
          if (this.organizationForm.id) {
            organizationService.patchOrganization(this.organizationForm.id, params)
              .then((res) => {
                this.$message.success('修改组织成功');
                this.organizationList();
                this.defaultExpandedKeys = [res.body.data.id];
                if (res.body.data.parent_id) {
                  this.defaultExpandedKeys.push(res.body.data.parent_id);
                }
              }).catch(() => {
              this.$message.error('修改组织失败');
            });
          }else{
            organizationService.createOrganization(params)
              .then((res) => {
                this.$message.success('新增组织成功');
                this.organizationList();
                this.defaultExpandedKeys = [res.body.data.id];
                if (res.body.data.parent_id) {
                  this.defaultExpandedKeys.push(res.body.data.parent_id);
                }
              }).catch(() => {
              this.$message.error('新增组织失败');
            });
          }
        }
      });
    },
    deleteOrganization() {
      const checkList = this.$refs.tree.getCheckedKeys();
      if (checkList.length === 0) {
        this.$message.warning('选择要删除的组织节点');
        return;
      }
      messageBoxService.delete('是否删除该组织?','删除后不可恢复')
        .then(() => {
          organizationService.deleteOrganization({id: checkList})
            .then((res => {
              this.$message.success('删除成功');
              this.organizationList();
            })).catch(() => {
            this.$message.error('删除失败');
          });
        }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    organizationList() {
      this.loading = true;
      organizationService.organizationList()
        .then((res) => {
          this.organizations = this.resetArray(res.body.data);
        }).finally(()=>{
        this.loading = false;
      });
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            id: item.id,
            value: item.id,
            label: item.organization_name,
            children: this.resetArray(item.children, level + 1),
            level: level,
            desc: item.organization_desc,
          }
        } else {
          return {
            id: item.id,
            value: item.id,
            label: item.organization_name,
            level: level,
            desc: item.organization_desc,
          }
        }
      });
    },
  },
  data() {
    return {
      loading: false,
      filterText: '',
      organizations: [],
      defaultExpandedKeys: [],
      organizationForm: {previousOrganization: []},
      organizationRules: {
        label: [
          { required: true, message: '组织架构名称', trigger: 'blur' },
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
