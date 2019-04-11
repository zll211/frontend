import pisTitle from '../../../../common/components/pisTitle';
import {specimenTemplateService} from './specimen.service';
import {diagnosisTemplateService} from './diagnosis.service';
import baseData from './specimen.constant';

export default {
  components: {
    pisTitle,
  },
  created() {
    this.specimenTemplateList();
  },
  mixins: [baseData],
  computed: {
    systemList() {
      return this.normalSpecimenTemplateList.map((item) => ({
        id: item.id,
        label: item.label,
      }));
    },
    organList() {
      let organList = [];
      this.normalSpecimenTemplateList.forEach((item) => {
        if (item?.children?.length > 0) {
          organList.push({
            value: item.id,
            label: item.label,
            children: item.children.map((item) => ({
              value: item.id,
              label: item.label,
            })),
          });
        }
      });
      return organList;
    },
    cellTypeList() {
      return this.cellSpecimenTemplateList.map((item) => ({
        id: item.id,
        label: item.label,
      }));
    },
    totalOrganList() {
      let organList = [];
      this.normalSpecimenTemplateList.forEach((item) => {
        if (item?.children?.length > 0) {
          item.children.forEach((item) => {
            organList.push({
              id: item.id,
              label: item.label,
            });
          });
        }
      });
      return organList;
    },
    diagnosisPreviousList() {
      let list = [];
      if (!this.diagnosisForm.dict_specimen_id && !this.diagnosisForm.id) return this.diagnosisTemplateList;
      if (!this.diagnosisForm.dict_specimen_id && this.diagnosisForm.id) return this.diagnosisTemplateList.filter((item) => item.id !== this.diagnosisForm.id);
      this.diagnosisTemplateList.forEach((item) => {
        if (item.dict_specimen_id == this.diagnosisForm.dict_specimen_id && item.id !== this.diagnosisForm.id) {
          list = [...list, item];
        }
      });
      return list;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterCellText(val) {
      this.$refs.cellTree.filter(val);
    },
    filterDiagnosisText(val) {
      this.$refs.diagnosisTree.filter(val);
    },
  },
  methods: {
    resize() {
      const container = this.$el.getElementsByClassName('specimen-container');
      const {forEach} = Array.prototype;
      container::forEach((item) => {
        const {top} = item.getBoundingClientRect();
        item.style.height = window.innerHeight - top - 50 + 'px';
      });
    },
    handleClick(tab, event) {
      if (tab.name === '1') {
        this.specimenTemplateList();
      }
      if (tab.name === '2') {
        this.cellTemplateList();
      }
      if (tab.name === '3') {
        this.specimenTemplateList();
        this.cellTemplateList();
        this.diagnosisList();
      }
      setTimeout(() => this.resize());
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(item, node) {
      this.defaultExpandedKeys = [];
      let _form = Object.assign({}, item);
      if (this.activeTabName === '1') {
        if (item.level === 1) {
          this.type = 'system';
        }
        if (item.level === 2) {
          this.type = 'organ';
          _form.parentId = node.parent.data.id;
        }
        if (item.level === 3) {
          this.type = 'specimen';
          _form.parentId = [node.parent.parent.data.id, node.parent.data.id];
        }
      } else if (this.activeTabName === '2') {
        if (item.level === 1) {
          this.type = 'cellType';
        }
        if (item.level === 2) {
          this.type = 'cell';
          _form.parentId = node.parent.data.id;
        }
      }
      this.$refs[`${this.type}Form`].resetFields();
      this[`${this.type}Form`] = _form;
    },
    handleDiagnosisNodeClick(item, node) {
      let form;
      this.type = 'diagnosis';
      diagnosisTemplateService.diagnosisTemplateInfo(item.id)
        .then((res) => {
          let _form = res.body.data;
          form = {
            id: _form.id,
            label: _form.diagnostic_term_name,
            dict_specimen_id: _form.dict_specimen_id / 1,
            specimen_type: _form.specimen_type,
            parentId: [],
            mirrorContent: _form.dictPathologicDiagnosis.data.see_under_microscope,
            diagnosisContent: _form.dictPathologicDiagnosis.data.pathologic_diagnosis_name,
          };
          let parent = node.parent;
          while (parent) {
            if (parent.data.id) {
              form.parentId.push(parent.data.id);
            }
            parent = parent.parent;
          }
          form.parentId.reverse();
          this.$refs[`${this.type}Form`].resetFields();
          this[`${this.type}Form`] = form;
        });
    },
    changeDiagnosisOrgan(id) {
      this.diagnosisForm.parentId = [];
    },
    changeSpecimenType() {
      this.diagnosisForm.dict_specimen_id = '';
      this.diagnosisForm.parentId = [];
      this.diagnosisForm = Object.assign({}, this.diagnosisForm);
    },
    addContent(type) {
      this.type = type;
      this.$refs[`${this.type}Form`].resetFields();
      if (this.type === 'diagnosis') {
        this[`${this.type}Form`] = {
          specimen_type: 'routine',
        };
      } else if (this.type === 'organ') {
        this[`${this.type}Form`] = {dictGiganticInspection: []};
      } else {
        this[`${this.type}Form`] = {};
      }
    },
    addGiganticInspection() {
      this[`organForm`].dictGiganticInspection.push({gigantic_inspection_info: ''});
    },
    removeGiganticInspection(index) {
      this[`organForm`].dictGiganticInspection.splice(index, 1);
    },
    createTemplate(formName) {
      this.$refs[`${formName}Form`].validate((valid) => {
        if (valid) {
          if (this[`${formName}Form`].id) {
            specimenTemplateService.patchSpecimenTemplate(this[`${formName}Form`].id,
              {
                dict_specimen_name: this[`${formName}Form`].label,
                parent_id: Array.isArray(this[`${formName}Form`].parentId) ?
                  this[`${formName}Form`].parentId[this[`${formName}Form`].parentId.length - 1] :
                  this[`${formName}Form`].parentId,
                dict_gigantic_inspection: this[`${formName}Form`].dictGiganticInspection,
              }).then((res => {
              this.$message.success('修改成功');
              this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }
              this.specimenTemplateList();
            })).catch(() => {
              this.$message.error('修改失败');
            });
          } else {
            specimenTemplateService.createSpecimenTemplate({
              dict_specimen_name: this[`${formName}Form`].label,
              parent_id: Array.isArray(this[`${formName}Form`].parentId) ?
                this[`${formName}Form`].parentId[this[`${formName}Form`].parentId.length - 1] :
                this[`${formName}Form`].parentId,
              dict_gigantic_inspection: this[`${formName}Form`].dictGiganticInspection,
            }).then((res => {
              this.$message.success('创建成功');
              this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }
              this.specimenTemplateList();
            })).catch(() => {
              this.$message.error('创建失败');
            });
          }
        }
      });
    },
    deleteSpecimenTemplate() {
      let normalCheckList = this.$refs.tree.getCheckedKeys();
      if (normalCheckList.length === 0) {
        this.$message.warning('未选择要删除的模板节点');
        return;
      }
      specimenTemplateService.deleteSpecimenTemplate({id: normalCheckList})
        .then((res => {
          this.$message.success('删除成功');
          this.specimenTemplateList();
          this.addContent(this.type);
        })).catch(() => {
        this.$message.error('删除失败');
      });
    },
    specimenTemplateList() {
      this.loading = true;
      specimenTemplateService.specimenTemplateList()
        .then((res) => {
          this.normalSpecimenTemplateList = this.resetArray(res.body.data);
        }).finally(() => {
        this.loading = false;
      });
    },
    createCellTemplate(formName) {
      this.$refs[`${formName}Form`].validate((valid) => {
        if (valid) {
          if (this[`${formName}Form`].id) {
            specimenTemplateService.patchCellSpecimenTemplate(this[`${formName}Form`].id,
              {
                dict_specimen_name: this[`${formName}Form`].label,
                parent_id: this[`${formName}Form`].parentId,
              }).then((res => {
              this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }
              this.$message.success('修改成功');
              this.cellTemplateList();
            })).catch(() => {
              this.$message.error('修改失败');
            });
          } else {
            specimenTemplateService.createCellSpecimenTemplate({
              dict_specimen_name: this[`${formName}Form`].label,
              parent_id: this[`${formName}Form`].parentId,
            }).then((res => {
              this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }
              this.$message.success('创建成功');
              this.cellTemplateList();
            })).catch(() => {
              this.$message.error('创建失败');
            });
          }
        }
      });
    },
    deleteCellTemplate() {
      let cellCheckList = this.$refs.cellTree.getCheckedKeys();
      if (cellCheckList.length === 0) {
        this.$message.warning('未选择 要删除的细胞模板节点');
        return;
      }
      specimenTemplateService.deleteCellSpecimenTemplate({id: cellCheckList})
        .then((res => {
          this.$message.success('删除成功');
          this.cellTemplateList();
          this.addContent(this.type);
        })).catch(() => {
        this.$message.error('删除失败');
      });
    },
    cellTemplateList() {
      this.loading = true;
      specimenTemplateService.cellSpecimenTemplateList()
        .then((res) => {
          this.cellSpecimenTemplateList = this.resetArray(res.body.data);
        }).finally(() => {
        this.loading = false;
      });
    },

    diagnosisList() {
      this.loading = true;
      diagnosisTemplateService.diagnosisTemplateList()
        .then((res) => {
          this.diagnosisTemplateList = this.resetDiagnosisArray(res.body);
        }).finally(() => {
        this.loading = false;
      });
    },
    createDiagnosisTemplate(formName) {
      let parentId = Array.isArray(this[`${formName}Form`].parentId) ?
        this[`${formName}Form`].parentId[this[`${formName}Form`].parentId.length - 1] :
        this[`${formName}Form`].parentId;
      let params = {
        diagnostic_term_name: this[`${formName}Form`].label,
        parent_id: parentId,
        dict_specimen_id: this[`${formName}Form`].dict_specimen_id + '',
        specimen_type: this[`${formName}Form`].specimen_type,
        dict_pathologic_diagnosis: {
          pathologic_diagnosis_name: this[`${formName}Form`].diagnosisContent,
          see_under_microscope: this[`${formName}Form`].mirrorContent,
        },
      };
      this.$refs[`${formName}Form`].validate((valid) => {
        if (valid) {
          if (this[`${formName}Form`].id) {
            if (parentId === this[`${formName}Form`].id) {
              this.$message.error('上级诊断模板不能是自己');
              this[`${formName}Form`].parentId = [];
              return;
            }
            diagnosisTemplateService.patchDiagnosisTemplate(this[`${formName}Form`].id, params).then((res => {
              this.$message.success('修改成功');
              this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }
              this.diagnosisList();
            })).catch(() => {
              this.$message.error('修改失败');
            });
          } else {
            diagnosisTemplateService.createDiagnosisTemplate(params).then((res => {
              this.$message.success('创建成功');
              /*this.defaultExpandedKeys = [res.body.data.id];
              if (res.body.data.parent_id) {
                this.defaultExpandedKeys.push(res.body.data.parent_id);
              }*/
              this.addContent(this.type);
              this.diagnosisList();
            })).catch(() => {
              this.$message.error('创建失败');
            });
          }
        }
      });
    },
    deleteDiagnosisTemplate() {
      let checkList = this.$refs.diagnosisTree.getCheckedKeys();
      if (checkList.length === 0) {
        this.$message.warning('未选择 要删除的细胞模板节点');
        return;
      }
      diagnosisTemplateService.deleteDiagnosisTemplate({id: checkList})
        .then((res => {
          this.$message.success('删除成功');
          this.diagnosisList();
          this.addContent(this.type);
        })).catch(() => {
        this.$message.error('删除失败');
      });
    },

    resetDiagnosisArray(template, level = 1) {
      return template.map((item) => {
        if (item?.children?.length > 0) {
          return {
            id: item.id,
            value: item.id,
            dict_specimen_id: item.dict_specimen_id,
            specimen_type: item.specimen_type,
            label: item.diagnostic_term_name,
            children: this.resetDiagnosisArray(item.children, level + 1),
            level: level,
          };
        } else {
          return {
            id: item.id,
            dict_specimen_id: item.dict_specimen_id,
            specimen_type: item.specimen_type,
            value: item.id,
            label: item.diagnostic_term_name,
            level: level,
          };
        }
      });
    },
    resetArray(template, level = 1) {
      return template.map((item) => {
        if (item?.children?.length > 0) {
          return {
            id: item.id,
            label: item.dict_specimen_name,
            children: this.resetArray(item.children, level + 1),
            dictGiganticInspection: item.dict_gigantic_inspection,
            level: level,
          };
        } else {
          return {
            id: item.id,
            label: item.dict_specimen_name,
            dictGiganticInspection: item.dict_gigantic_inspection,
            level: level,
          };
        }
      });
    },
  },
  mounted() {
    this.$root.$on('size-change', this.resize);
    setTimeout(() => this.resize());
  },
  beforeDestroy() {
    this.$root.$off('size-change', this.resize);
  },
};
