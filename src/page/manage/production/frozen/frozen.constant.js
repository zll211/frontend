const tabList = [{
  'label': '切片',
  'name': 'section',
}, {
  'label': '染色',
  'name': 'dyeing',
}, {
  'label': '封片',
  'name': 'seal',
}, {
  'label': '重切',
  'name': 'recut',
}, {
  'label': '完成',
  'name': 'finish',
}, {
  'label': '全部',
  'name': 'total',
}];


export {tabList};
/*const tabList = [{
  'label': '切片',
  'name': 'frozen',
}, {
  'label': '染色',
  'name': 'section',
}, {
  'label': '封片',
  'name': 'dye',
}, {
  'label': '重切',
  'name': 'resection',
}];*/

/*
const frozen = [{
  'fixed': true,
  'prop': 'pathology_id',
  'label': '病理号',
  'min-width': 120,
  'align': 'center',
}, {
  'fixed': true,
  'prop': 'patient_name',
  'label': '姓名',
  'min-width': 100,
  'align': 'center',
}, {
  'fixed': true,
  'prop': 'serial_number',
  'label': '蜡块号',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'sample_name',
  'label': '材块名称',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'sample_source',
  'label': '取材部位',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'sample_count',
  'label': '材块数量',
  'min-width': 80,
  'align': 'center',
}, /!*{
  'prop': 'number',
  'label': '取材医生',
  'min-width': 100,
  'align': 'center',
}, {
  'prop': 'number',
  'label': '取材记录人员',
  'min-width': 120,
  'align': 'center',
}, *!/{
  'prop': 'draw_material_at',
  'label': '取材时间',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'operate',
  'label': '操作',
  'min-width': 120,
  'align': 'center',
}];

const section = [{
  'fixed': true,
  'prop': 'section_number',
  'label': '切片号',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'section_operator',
  'label': '切片操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'section_at',
  'label': '切片时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'patch_at',
  'label': '贴片时间',
  'min-width': 160,
  'align': 'center',
}];

const dye = [{
  'prop': 'dyeing_operator',
  'label': '染色操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'dyeing_at',
  'label': '染色时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'operating_machine',
  'label': '操作机器',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'dyeing_reagent',
  'label': '染色试剂',
  'min-width': 120,
  'align': 'center',
}];

const mounting = [{
  'prop': 'seal_operator',
  'label': '封片操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'seal_begin_at',
  'label': '封片开始时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'seal_done_at',
  'label': '封片完成时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'seal_machine_model',
  'label': '封片机型号',
  'min-width': 120,
  'align': 'center',
}];

const tableHeaderData = {
  frozen: frozen,
  section: frozen.concat(recombine(section)),
  dye: frozen.concat(section, recombine(dye)),
  mounting: frozen.concat(section, dye, recombine(mounting)),
  resection: frozen,
};
*/

let frozenData = {
  loading: false,
  label: tabList[0].label,
  normalCountList: {},
  status: '',
  printPdf: '',
  prods: [],
  pageSize: 10,
  pagination: {total: 0, current_page: 1, per_page: 10},
  tabList: tabList,
  sectionFormRules: {
    startTime: [
      {type: 'date', required: true, message: '请选择切片时间', trigger: 'change'},
    ],
    endTime: [
      {type: 'date', required: true, message: '请选择贴片时间', trigger: 'change'},
    ],
  },
  dyeingMachineList: [],
  dyeingFormRules: {
    reagent: [
      {required: true, message: '请选择染色试剂', trigger: 'change'},
    ],
    time: [
      {type: 'date', required: true, message: '请选择染时间', trigger: 'change'},
    ],
  },
  sealMachineList: [],
  sealFormRules: {
    startTime: [
      {type: 'date', required: true, message: '请选择封片时间', trigger: 'change'},
    ],
    endTime: [
      {type: 'date', required: true, message: '请选择封片时间', trigger: 'change'},
    ],
  },
};

tabList.forEach((tab) => {
  frozenData[`${tab.name}MultipleSelection`] = [];
  frozenData[`${tab.name}FormVisible`] = false;
  frozenData[`${tab.name}Form`] = {};
});

const section = [{
  'prop': 'paraffin_block_id',
  'label': '蜡块号',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'sample_name',
  'label': '材块名称',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'sample_source',
  'label': '取材部位',
  'min-width': 120,
  'align': 'center',
}/*, {
  'prop': 'sample_count',
  'label': '材块数量',
  'min-width': 80,
  'align': 'center',
}*/];


const dye = [{
  'prop': 'section_operator',
  'label': '切片操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'section_at',
  'label': '切片时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'patch_at',
  'label': '贴片时间',
  'min-width': 160,
  'align': 'center',
}];

const mounting = [{
  'prop': 'dyeing_operator',
  'label': '染色操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'dyeing_begin_at',
  'label': '染色开始时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'dyeing_done_at',
  'label': '染色结束时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'operating_machine',
  'label': '操作机器',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'dyeing_reagent',
  'label': '染色试剂',
  'min-width': 120,
  'align': 'center',
}];

const finish = [{
  'prop': 'section_number',
  'label': '切片号',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'seal_operator',
  'label': '封片操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'seal_begin_at',
  'label': '封片开始时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'seal_done_at',
  'label': '封片完成时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'seal_machine_model',
  'label': '封片机型号',
  'min-width': 120,
  'align': 'center',
}];

const total = [{
  'prop': 'status',
  'label': '状态',
  'min-width': 80,
  'align': 'center',
}];

const tableHeaderData = {
  section: section,
  dyeing: [...section, ...dye],
  seal: [...section, ...mounting],
  recut: [...section, {
    'prop': 'production_source',
    'label': '医嘱内容',
    'min-width': 120,
    'align': 'center',
  }],
  finish: [...section, ...finish],
  total: [...section, ...total],
};

frozenData.tableHeaderData = tableHeaderData;

export default {
  data() {
    return frozenData;
  },
};

