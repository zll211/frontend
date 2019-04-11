import {mapState} from 'vuex';

import frozenData, {tabList} from './frozen.constant';
import {formatDateTime} from '../../../../config/utils';
import productionList from '../production.component';
import {productionService} from '../production.service';

export default {
  mixins: [frozenData],
  created() {
    this.statusList();
    // this.assetsList();
  },
  components: {
    productionList,
  },
  methods: {
    statusList() {
      productionService.statusList('frozen')
        .then(({body}) => {
          const _tabList = body.data.map((status) => tabList.find((tab) => tab.label === status));
          this.tabList = [..._tabList, ...[{
            'label': '重切',
            'name': 'recut',
          }, {
            'label': '完成',
            'name': 'finish',
          }, {
            'label': '全部',
            'name': 'total',
          }]];
          this.label = this.tabList[0].label;
        }).finally(() => this.prodList());
    },
    confirmOperate({status, rows, childStatus, prodParams}) {
      if (status === 'recut') status = 'section';
      this.status = status;
      const label = prodParams.status;
      const childLabel = childStatus === 'begin' ? '开始' : '完成';
      let params = {};
      if (status === 'section') {
        if (childStatus === 'begin') {
          params = {
            [`section_at`]: formatDateTime(new Date()),
            status: label,
            status_accomplish: childLabel,
          };
        } else if (childStatus === 'done') {
          params = {
            [`patch_at`]: formatDateTime(new Date()),
            status: label,
            status_accomplish: childLabel,
          };
        }
      } else if (status === 'dyeing') {
        params = {
          [`${status}_${childStatus}_at`]: formatDateTime(new Date()),
          dyeing_reagent: 'HE',
          status: label,
          status_accomplish: childLabel,
        };
      } else {
        params = {
          [`${status}_${childStatus}_at`]: formatDateTime(new Date()),
          status: label,
          status_accomplish: childLabel,
        };
      }
      params.id = rows.map((item) => item.id);
      productionService.updateStatus('frozen', params)
        .then((res) => {
          this.prodList(prodParams);
          this.$message.success('执行成功');
        }).catch(() => {
        this.$message.error('执行失败');
      });
      /*this[`${status}FormVisible`] = true;
      if (this.$refs[`${status}Form`]) this.$refs[`${status}Form`].resetFields();
      if (status === 'dyeing') this[`${status}Form`] = {reagent: 'HE'};
      else this[`${status}Form`] = {};*/

    },
    backOperate({status, rows, size, prodParams}) {
      this.pagination.per_page = size;
      let params = {
        status: status,
        back: 1,
        id: rows.map((item) => item.id),
      };
      productionService.updateStatus('frozen', params)
        .then((res) => {
          this.prodList(prodParams);
          this.$message.success('回退成功');
        }).catch(() => {
        this.$message.error('回退失败');
      });
    },
    printLabel({rows, size}) {
      this.pagination.per_page = size;
      let params = {
        ids: rows.map((item) => item.id),
      };
      productionService.printLabel('frozen', params)
        .then((res) => {
          this.printPdf = URL.createObjectURL(res.data);
          this.$el.getElementsByClassName('printIfr')[0].onload = () => {
            setTimeout(() => {
              this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
            }, 100);
            URL.revokeObjectURL(this.printPdf);
          };
          this.$message.success('标签打印成功');
        }).catch(() => {
        this.$message.error('标签打印失败');
      });
    },
    printSection({rows}) {
      let params = {
        id: rows.map((item) => item.id),
        case_type: '冰冻',
      };
      productionService.printSection(params)
        .then((res) => {
          this.printPdf = URL.createObjectURL(res.data);
          this.$el.getElementsByClassName('printIfr')[0].onload = () => {
            setTimeout(() => {
              this.$el.getElementsByClassName('printIfr')[0].contentWindow.print();
            }, 100);
            URL.revokeObjectURL(this.printPdf);
          };
          this.$message.success('切片工作单打印成功');
        }).catch(() => {
        this.$message.error('切片工作单失败');
      });
    },
    prodList({page = 1, page_size = this.pagination.per_page, status = this.tabList[0].label, ...rest} = {
      page: 1,
      status: this.tabList[0].label,
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.label = status;
      this.prods = [];
      productionService.prodList('frozen', Object.assign({
        status: status === '全部' ?
          this.tabList.filter((tab) => tab.label !== status).map((tab) => tab.label) : status,
        page: page,
        page_size: page_size,
      }, rest))
        .then((res) => {
          this.prods = res.body.data;
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.prods.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.getTableCount();
        this.loading = false;
      });
    },
    updateStatus() {
      const status = this.status;
      const tab = this.tabList.find((item) => status === item.name);
      let params = {
        section_at: formatDateTime(this.sectionForm?.startTime),
        patch_at: formatDateTime(this.sectionForm?.endTime),
        dyeing_at: formatDateTime(this.dyeingForm?.time),
        dyeing_reagent: this.dyeingForm?.reagent,
        operating_machine: this.dyeingForm?.name,
        // section_number: this.sealForm.num ? this.sealForm.num : undefined,
        seal_begin_at: formatDateTime(this.sealForm?.startTime),
        seal_done_at: formatDateTime(this.sealForm?.endTime),
        seal_machine_model: this.sealForm?.name,
      };
      params.id = this.operateList.map((item) => item.id);
      this.$refs[`${status}Form`].validate((valid) => {
        if (valid) {
          productionService.updateStatus('frozen', params)
            .then((res) => {
              this.prodList({status: this.label});
              this[`${status}FormVisible`] = false;
              this.operateList = [];
              this.$message.success('执行成功');
            }).catch(() => {
            this.$message.error('执行失败');
          });
        }
      });
    },
    cancelStatus() {
      this[`${this.status}FormVisible`] = false;
      if (this.$refs[`${this.status}Form`]) this.$refs[`${this.status}Form`].resetFields();
      if (this.status === 'dyeing') {
        this[`${this.status}Form`] = {reagent: 'HE'};
      } else {
        this[`${this.status}Form`] = {};
      }
      this.operateList = [];
    },
    getTableCount() {
      productionService.getTableCount('frozen').then((res) => {
        this.normalCountList = res.body.data;
      })
    }
  },
};
