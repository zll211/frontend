<template>
  <pis-icon
    class="pis-star collect-register-btn"
    :title="iconText"
    :iconName="iconName"
    @icon-click="collect"></pis-icon>
</template>

<script>
  import pisIcon from './pisIcon';

  export default {
    components: {
      pisIcon,
    },
    props: ['isCollect'],
    computed: {
      iconText() {
        return this.isCollect ? "取消收藏" : "收藏";
      },
      iconName() {
        return this.isCollect ? 'el-icon-star-on' : 'el-icon-star-off';
      }
    },
    data() {
      return {}
    },
    methods: {
      collect() {
        if (this.isCollect === false) {
          this.$emit('collect');
        } else if (this.isCollect === true) {
          this.$confirm('确定要取消收藏吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('cancelCollect');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      },
    }
  }
</script>

<style lang="scss">
  .collect-register-btn {
    color: #999999;
    .icon {
      i{
        color: #999999;
        font-size: 24px;
      }
    }
    &:hover {
      .icon {
        color: rgb(255, 176, 3);
      }
    }
    .el-icon-star-on {
      color: rgb(255, 176, 3) !important;
    }
  }
</style>
