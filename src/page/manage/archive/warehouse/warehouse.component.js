import {warehouseService} from './warehouse.service';
import pisPageSize from '../../../../common/components/pisPageSize';
import pisList from '../../../../common/components/pisList';
import pisSearchHead from '../../../../common/components/pisSearchHead';
import pisIcon from '../../../../common/components/pisIcon';

export default {
  created() {
    this.warehouseList();
  },
  components: {
    pisPageSize,
    pisList,
    pisSearchHead,
    pisIcon,
  },
  data() {
    return {
      data: [],
      loading: false,
      pagination: {total: 0, current_page: 1, per_page: 10},
      searchParams: {},
      dialogWarehouse: false,
      warehouseForm: {},
      warehouseRules: {
        name: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'},
        ],
        volume: [
          {required: true, message: '请输入仓库区域', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    createWarehouse() {
      this.warehouseForm = {};
      this.dialogWarehouse = true;
    },
    warehouseList({page = 1, page_size = this.pagination.per_page} = {
      page: 1,
      page_size: this.pagination.per_page,
    }) {
      this.loading = true;
      this.data = [];
      warehouseService.warehouseList({page, page_size}).then(({body}) => {
        this.data = body.data;
        this.pagination = body.meta.pagination;
      }).finally(() => {
        if (this.data.length === 0) {
          this.pagination = {total: 0, current_page: 1, per_page: 10};
        }
        this.loading = false;
      });
    },
    refreshPage() {
      this.warehouseList();
    },
    pageSizeChange(size) {
      this.warehouseList({page_size: size});
    },
    handleCurrentChange(page) {
      this.warehouseList({
        page,
        page_size: this.pagination.per_page,
      });
    },
    saveWarehouse() {
      this.$refs['warehouseForm'].validate((valid) => {
        if (valid) {
          if (this.warehouseForm.id) {
            warehouseService.editWarehouse(this.warehouseForm.id, this.warehouseForm)
              .then(({body}) => {
                this.$message.success('修改成功');
                this.warehouseList();
                this.dialogWarehouse = false;
              }).catch(() => {
              this.$message.error('修改失败');
            });
          } else {
            warehouseService.saveWarehouse(this.warehouseForm)
              .then(({body}) => {
                this.$message.success('新增成功');
                this.warehouseList();
                this.dialogWarehouse = false;
              }).catch(() => {
              this.$message.error('新增失败');
            });
          }
        }
      });
    },
    deleteWarehouse(id) {
      warehouseService.deleteWarehouse(id)
        .then(({body}) => {
          this.$message.success('删除成功');
          this.warehouseList();
        }).catch(() => {
        this.$message.error('删除失败');
      });
    },
    editWarehouse(row) {
      this.warehouseForm = row;
      this.dialogWarehouse = true;
    },
  },
};
