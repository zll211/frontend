const baseData = {
  loading: false,
  activeTabName: '1',
  type: '',
  filterText: '',
  filterCellText: '',
  filterDiagnosisText: '',
  defaultExpandedKeys: [],
  normalSpecimenTemplateList: [],
  cellSpecimenTemplateList: [],
  diagnosisTemplateList: [],
  systemForm: {},
  systemRules: {
    label: [
      {required: true, message: '请输入系统名称', trigger: 'blur'},
    ],
  },
  organForm: {dictGiganticInspection: []},
  organRules: {
    label: [
      {required: true, message: '请输入器官名称', trigger: 'blur'},
    ],
    parentId: [
      {required: true, message: '请选择所属系统', trigger: 'change'},
    ],
  },
  specimenForm: {},
  specimenRules: {
    label: [
      {required: true, message: '请输入标本名称', trigger: 'blur'},
    ],
    parentId: [
      {required: true, message: '请选择所属系统', trigger: 'change'},
    ],
  },
  cellTypeForm: {},
  cellTypeRules: {
    label: [
      {required: true, message: '请输入细胞标本类型名称', trigger: 'blur'},
    ],
  },
  cellForm: {},
  cellRules: {
    label: [
      {required: true, message: '请输入细胞标本名称', trigger: 'blur'},
    ],
    parentId: [
      {required: true, message: '请选择所属细胞标本类型', trigger: 'change'},
    ],
  },
  diagnosisForm: {},
  diagnosisRules: {
    label: [
      {required: true, message: '请输入模板名称', trigger: 'blur'},
    ],
    specimen_type: [
      {required: true, message: '请选择模板类型', trigger: 'change'},
    ],
    dict_specimen_id: [
      {required: true, message: '请选择所属标本', trigger: 'change'},
    ],
    content: [
      {required: true, message: '请输入模板名称', trigger: 'blur'},
    ],
  },
};

export default {
  data() {
    return baseData;
  }
}
