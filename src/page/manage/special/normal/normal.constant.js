const tabList = [{
  'label': '脱水',
  'name': 'dehydration',
}, {
  'label': '包埋',
  'name': 'entrapment',
}, {
  'label': '切片',
  'name': 'section',
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


let normalData = {
  normalCountList:{},
  loading: false,
  label: tabList[0].label,
  status: '',
  prods: [],
  printPdf: '',
  pagination: {total: 0, current_page: 1, per_page: 10},
  tabList: tabList,
};

const spin = [{
  'prop': 'advice',
  'label': '医嘱内容',
  'min-width': 80,
  'align': 'center',
}, {
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

const embed = [{
  'prop': 'dehydration_operator',
  'label': '脱水操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'dehydration_begin_at',
  'label': '脱水开始时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'dehydration_done_at',
  'label': '脱水完成时间',
  'min-width': 160,
  'align': 'center',
}];
const section = [{
  'prop': 'entrapment_operator',
  'label': '包埋操作员',
  'min-width': 120,
  'align': 'center',
}, {
  'prop': 'entrapment_begin_at',
  'label': '包埋开始时间',
  'min-width': 160,
  'align': 'center',
}, {
  'prop': 'entrapment_done_at',
  'label': '包埋完成时间',
  'min-width': 160,
  'align': 'center',
}];

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

const total =[{
    'prop': 'status',
    'label': '状态',
    'min-width': 80,
    'align': 'center',
}];

const tableHeaderData = {
  dehydration: spin,
  entrapment: [...spin, ...embed],
  section: [...spin, ...section],
  dyeing: [...spin, ...dye],
  seal: [...spin, ...mounting],
  finish: [...spin,...finish],
  total: [...spin, ...total],
};

normalData.tableHeaderData = tableHeaderData;


export default {
  data() {
    return normalData;
  }
}

