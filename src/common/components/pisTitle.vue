<template>
  <div class="pis-title flex align-items-center">
    <span class="decorative-line"></span>
    <label class="label-name">{{label}}</label>
  </div>
</template>

<script>
  export default {
    props: {
      label: ''
    },
    data() {
      return {};
    },
  }
</script>

<style scoped lang="scss">
  .decorative-line {
    background: linear-gradient(90deg, rgba(1, 207, 177, 1), rgba(1, 208, 176, 1));
    height: 20px;
    margin-right: 7px;
    width: 4px;
  }
  .label-name{
    color: #7b7b7b;
    font-size:18px;
    line-height:25px;
  }
</style>
