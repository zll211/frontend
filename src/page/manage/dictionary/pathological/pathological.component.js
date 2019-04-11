import {pathologicalService} from './pathological.service';


export default {
  data() {
    return {
      loading: false,
      data: [{
        case_name: '常规',
        case_type: 'routine',
      }, {
        case_name: '冰冻',
        case_type: 'frozen',
      }, {
        case_name: '细胞',
        case_type: 'cell',
      }, {
        case_name: '外院标本',
        case_type: 'specimen',
      }, {
        case_name: '外院玻片',
        case_type: 'slide',
      }, {
        case_name: '外院蜡块',
        case_type: 'block',
      }],
    };
  },
  created() {
    this.pathologicalList();
  },
  methods: {
    pathologicalList() {
      this.loading = true;
      pathologicalService.pathologicalList({settings_key: this.data.map((item) => item.case_type)})
        .then((res) => {
          this.data = this.data.map((item) => {
            const obj = res.data.data[item.case_type];
            return Object.assign({
              date: obj ? obj.date : '',
              digit: obj ? obj.digit / 1 : '',
              prefix: obj ? obj.prefix : '',
            }, item)
          });
        }).finally(() => {
        this.loading = false;
      })
    },
    savePathological(row) {
      let settings = {
        [row.case_type]: {
          prefix: row.prefix,
          date: row.date,
          digit: row.digit,
        }
      };
      pathologicalService.setPathological({settings})
        .then((res) => {
          this.$message.success('保存成功');
        }).catch(() => {
        this.$message.error('保存失败');
      })
    }
  },
}
