import {specialService} from '../../special/special.service';
import normal from '../../special/normal/normal.component';

export default {
  mixins: [normal],
  methods: {
    prodList({page = 1, page_size = this.pagination.per_page, status = '脱水', ...rest} = {
      page: 1,
      status: '脱水',
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.label = status;
      this.prods = [];
      specialService.prodList('routine', Object.assign({
        status: status === '全部' ?
          this.tabList.filter((tab) => tab.label !== status).map((tab) => tab.label) : status,
        page: page,
        page_size: page_size,
        special_type: '免疫组化',
      }, rest))
        .then((res) => {
          this.prods = res.body.data;
          //this.resetArray(res.body.data, 'updated_at');
          this.pagination = res.body.meta.pagination;
        }).finally(() => {
        if (this.prods.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.getTableCount();
        this.loading = false;
      });
    },
    getTableCount() {
      specialService.getTableCount('routine', {special_type: '免疫组化'}).then((res) => {
        this.normalCountList = res.body.data;
      });
    },
  },
};
