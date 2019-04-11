
import {messageBoxService} from '../../../../common/service/message.service';
import {inspectionService} from './inspection.service';
import reagent from './reagent/reagent.component';

export default {
  created() {
    this.inspectionList();
  },
  components: {
    reagent,
  },
  data() {
    return {
      loading: false,
      activeTabName: '1',
      inspectionTypeList: [{
        type: 'hospital',
        list: [],
        loading: false,
      }, {
        type: 'department',
        list: [],
        loading: false,
      }, {
        type: 'doctor',
        list: [],
        loading: false,
      }],
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === '1') {
        this.inspectionList();
      }
    },
    addInspection(type) {
      messageBoxService.prompt(`新增${this.getTypeValue(type)}`, `${this.getTypeValue(type)}`, `请输入${this.getTypeValue(type)}`, '')
        .then(({value}) => {
          let params = {};
          params[`inspection_${type}_name`] = value;
          inspectionService.createInspection(type, params)
            .then((res) => {
              this.inspectionList([type]);
              this.$message.success(`新增${this.getTypeValue(type)}成功`);
            }).catch(() => {
            this.$message.error(`新增${this.getTypeValue(type)}失败`);
          });
        }).catch(() => {
      })
    },
    editInspection(type, row) {
      messageBoxService.prompt(`新增${this.getTypeValue(type)}`, `${this.getTypeValue(type)}`, `请输入${this.getTypeValue(type)}`, row.name)
        .then(({value}) => {
          let params = {};
          params[`inspection_${type}_name`] = value;
          inspectionService.patchInspection(type, row.id, params)
            .then((res) => {
              this.inspectionList([type]);
              this.$message.success(`修改${this.getTypeValue(type)}成功`);
            }).catch(() => {
            this.$message.error(`修改${this.getTypeValue(type)}失败`);
          });
        }).catch(() => {

      })
    },
    deleteInspection(type, id) {
      messageBoxService.delete(`是否删除该${this.getTypeValue(type)}`, '')
        .then(() => {
          inspectionService.deleteInspection(type, id)
            .then((res) => {
              this.inspectionList([type]);
              this.$message.success(`删除${this.getTypeValue(type)}成功`);
            }).catch(() => {
            this.$message.error(`删除${this.getTypeValue(type)}失败`);
          });
        }).catch(() => {

      });
    },
    inspectionList(array = ['hospital', 'department', 'doctor']) {
      array.forEach((type) => {
        const index = this.inspectionTypeList.findIndex((item) => item.type === type);
        this.inspectionTypeList[index].loading = true;
        inspectionService.inspectionList(type)
          .then((res) => {
            this.$store.commit(
              `set${type.substring(0, 1).toUpperCase() + type.substring(1)}`,
              res.body.data);
            this.inspectionTypeList[index].list = res.body.data.map((item) => {
              return {
                id: item.id,
                name: item[`inspection_${type}_name`],
              }
            });
          }).finally(() => {
          this.inspectionTypeList[index].loading = false;
        });
      });
    },
    getTypeValue(type) {
      if (type === 'hospital') {
        return '送检医院';
      } else if (type === 'department') {
        return '送检科室';
      } else if (type === 'doctor') {
        return '送检医生';
      }
    },
  },
}
