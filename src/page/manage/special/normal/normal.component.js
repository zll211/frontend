import {mapState} from 'vuex'
import normalData from './normal.constant';
import {specialService} from '../special.service';
import {formatDateTime, strSplice} from '@/config/utils';
import productionList from '../special.component';

export default {
  mixins: [normalData],
  created() {
    this.assetsList();
    this.prodList();
  },
  components: {
    productionList,
  },
  methods: {
    assetsList() {

    },
    confirmOperate({status, rows, childStatus, prodParams}) {
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
      specialService.updateStatus('routine', params)
        .then((res) => {
          this.prodList(prodParams);
          this.$message.success('执行成功');
        }).catch(() => {
        this.$message.error('执行失败');
      });
    },
    backOperate({status, rows, size,prodParams}) {
      this.pagination.per_page = size;
      let params = {
        status: status,
        back: 1,
        id: rows.map((item) => item.id),
      };
      specialService.updateStatus('routine', params)
        .then((res) => {
          this.prodList(prodParams);
          this.$message.success('回退成功');
        }).catch(() => {
        this.$message.error('回退失败');
      });
    },
    printLabel({rows}) {
      let params = {
        ids: rows.map((item) => item.id),
      };
      specialService.printLabel('routine', params)
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
        case_type: '常规',
        special_advice: 1,
      };
      specialService.printSection(params)
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
  },
};
