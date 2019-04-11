
import cell from '../../special/cell/cell.component';
import {specialService} from '../../special/special.service';

export default {
  mixins: [cell],
  methods: {
    prodList({page = 1, page_size = this.pagination.per_page, status = '制片', ...rest} = {
      page: 1,
      status: '制片',
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.label = status;
      this.prods = [];
      specialService.prodList('cell', Object.assign({
        status: status === '全部' ?
          this.tabList.filter((tab) => tab.label !== status).map((tab) => tab.label) : status,
        page: page,
        page_size: page_size,
        special_type: '免疫组化',
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
    getTableCount () {
      specialService.getTableCount('cell', {special_type: '免疫组化'}).then((res) =>{
        this.normalCountList = res.body.data;
      })
    }
  }
};
