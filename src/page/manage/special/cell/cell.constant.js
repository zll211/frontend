/*const tabList = [ {
  'label': '制片',
  'name': 'uncentrifugal',
}, {
  'label': '染色',
  'name': 'centrifugal',
}, {
  'label': '封片',
  'name': 'dye',
}];*/

const tabList = [{
  'label': '制片',
  'name': 'production',
}, {
  'label': '染色',
  'name': 'dyeing',
}, {
  'label': '封片',
  'name': 'seal',
}, {
  'label': '完成',
  'name': 'finish',
}, {
  'label': '全部',
  'name': 'total',
}];

let cellData = {
  loading: false,
  label: tabList[0].label,
  normalCountList: {},
  status: '',
  printPdf: '',
  prods: [],
  show: false,
  pageSize: 10,
  pagination: {total: 0, current_page: 1, per_page: 10},
  tabList: tabList,
};


const centrifugal = [{
  'prop': 'advice',
  'label': '医嘱内容',
  'min-width': 80,
  'align': 'center',
}, {
  'prop': 'specimen_type',
  'label': '标本类型',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'specimen_name',
  'label': '标本',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'take_cell_at',
  'label': '取样时间',
  'min-width': 160,
  'align': 'center',
}];

const dye = [{
  'prop': 'section_operator',
  'label': '制片操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'section_at',
  'label': '制片开始时间 ',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'patch_at',
  'label': '制片结束时间 ',
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
  production: centrifugal,
  dyeing: [...centrifugal, ...dye],
  seal: [...centrifugal, ...mounting],
  finish: [...centrifugal, ...finish],
  total: [...centrifugal, ...total],
};

cellData.tableHeaderData = tableHeaderData;

export default {
  data() {
    return cellData;
  },
};
