<template>
  <div class="flex justify-content-between pis-pagination">
    <p class="flex align-items-center total">共{{pisPagination.total}}条记录</p>
    <div class="flex align-items-center">
      <i class="el-icon-arrow-left" :class="{activeArrow:pisPagination.current_page > 1}" @click="prePage"></i><p class="flex">{{pisPagination.current_page}}/{{pisPagination.total_pages}}</p><i class="el-icon-arrow-right" :class="{activeArrow:pisPagination.current_page < pisPagination.total_pages}" @click="nextPage"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "pisPagination",
    data() {
      return {

      }
    },
    props: {
      pisPagination:{
        type:Object,
        default: () => {}
      },
    },
    methods:{
      prePage() {
        if(this.pisPagination.current_page > 1) {
          this.$emit('prePage',this.pisPagination.current_page-1);
        }else {
          return false;
        }
      },
      nextPage() {
        if(this.pisPagination.current_page < this.pisPagination.total_pages) {
          this.$emit('nextPage',this.pisPagination.current_page+1);
        }else {
          return false;
        }
      }
    },
  }
</script>

<style scoped>
  .pis-pagination{
    padding: 10px 15px;
    color: rgb(200,200,200);
  }
  .total{
    font-size: 14px;
  }
  .el-icon-arrow-left, .el-icon-arrow-right{
    font-weight: bolder;
    margin: 0 10px;
    cursor: pointer;
  }
  .activeArrow{
    color: #01d0b0;
  }
</style>
