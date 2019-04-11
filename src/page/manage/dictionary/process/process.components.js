import pisTitle from '../../../../common/components/pisTitle';
import {processService} from './process.service';

const processData = ['标本接收登记', '取材', '脱水', '包埋', '切片', '染色', '封片', '初诊', '复诊', '报告'];

export default {
  name: 'process',
  components: {
    pisTitle,
  },
  data() {
    return {
      columnList: [{label: '常规', name: 'routine'}, {
        label: '冰冻',
        name: 'frozen',
      }, {label: '细胞', name: 'cell'}],
      columnTecList: [{label: '补取', name: 'supplement'}, {
        label: '重切',
        name: 'reCut',
      }, {label: '深切', name: 'deepCut'}, {
        label: '薄切',
        name: 'thinCut',
      }],
      columnSpecList: [{label: '免疫组化', name: 'immunohistochemical'}, {
        label: '特殊染色',
        name: 'specificStain',
      }, {label: '分子病理', name: 'molecularPathology'}],
      processList: [],
      processTecList: [],
      processSpecList: [],
      clinicalProcess: [],
      tecProcess: [],
      specProcess: [],
      loading: false,
      headList: processData.map((head) => ({name: head, checked: false})),
    };
  },
  created() {
    this.getProcessList();
  },
  methods: {
    getProcessList() {
      this.loading = true;
      processService.processConfigList({settings_key: ['inspectProcess', 'technicalAdvice', 'specialMedicalAdvice', 'clinicalProcess']}).then(({body}) => {
        const {inspectProcess, technicalAdvice, specialMedicalAdvice, clinicalProcess} = body.data;
        this.processList = this.columnList.map((column) => ({
          label: column.label,
          name: column.name,
          data: (inspectProcess ? inspectProcess[column.name] ? inspectProcess[column.name] : this.headList : this.headList).map((item, index) => ({
            name: item.name,
            checked: (index === 0 || index === 1) || item.checked,
            disabled: column.name === 'routine' ? index === 0 || index === 1 :
              column.name === 'frozen' ? index === 0 || index === 1 || index === 2 || index === 3 :
                column.name === 'cell' ? index === 0 || index === 1 || index === 2 || index === 3 : undefined,
          })),
        }));
        this.processTecList = this.columnTecList.map((column) => ({
          label: column.label,
          name: column.name,
          checked: technicalAdvice ? !!technicalAdvice[column.name] : true,
          data: (technicalAdvice ? technicalAdvice[column.name] ? technicalAdvice[column.name] : this.headList : this.headList).map((item, index) => ({
            name: item.name,
            checked: item.checked,
            disabled: column.name === 'supplement' ? index === 0 : index === 0 || index === 1,
          })),
        }));
        this.processSpecList = this.columnSpecList.map((column) => ({
          label: column.label,
          name: column.name,
          checked: specialMedicalAdvice ? !!specialMedicalAdvice[column.name] : true,
          data: (specialMedicalAdvice ? specialMedicalAdvice[column.name] ? specialMedicalAdvice[column.name] : this.headList : this.headList).map((item, index) => ({
            name: item.name,
            checked: item.checked,
            disabled: index === 0,
          })),
        }));
        this.clinicalProcess = clinicalProcess || [];
        this.tecProcess = this.columnTecList.filter((column) => !!technicalAdvice[column.name])
          .map((column) => column.label);
        this.specProcess = this.columnSpecList.filter((column) => !!specialMedicalAdvice[column.name])
          .map((column) => column.label);
      }).finally(() => {
        this.loading = false;
      });
    },
    saveProcess() {
      let inspectProcess = {};
      let technicalAdvice = {};
      let specialMedicalAdvice = {};
      this.processList.forEach((column) => {
        inspectProcess[column.name] = column.data.map((item) => ({
          name: (item.name === '切片' && column.name === 'cell') ? '制片' : item.name,
          checked: item.checked,
        }));
      });
      this.processTecList.forEach((column) => {
        if (this.tecProcess.includes(column.label)) {
          technicalAdvice[column.name] = column.data.map((item) => ({
            name: item.name, checked:
            item.checked,
          }));
        }
      });
      this.processSpecList.forEach((column) => {
        if (this.specProcess.includes(column.label)) {
          specialMedicalAdvice[column.name] = column.data.map((item) => ({
            name: item.name, checked:
            item.checked,
          }));
        }
      });
      let settings = {
        inspectProcess,
        technicalAdvice,
        specialMedicalAdvice,
        clinicalProcess: this.clinicalProcess,
      };
      processService.setProcessConfig({settings})
        .then((res) => {
          this.$message.success('配置成功');
        }).catch(() => {
        this.$message.error('配置失败');
      });
    },
  },
};
