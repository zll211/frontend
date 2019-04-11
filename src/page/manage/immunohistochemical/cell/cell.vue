<template>
  <main class="production-page main-container">
    <production-list
      :loading="loading"
      :prods="prods"
      :tab-name="tabList[0].name"
      :tab-list="tabList"
      :table-header-data="tableHeaderData"
      :normal-count-list="normalCountList"
      :pagination="pagination"
      @confirm-operate='confirmOperate'
      @prod-list="prodList"
      @back-operate="backOperate"
      @print-label="printLabel"
      @print-section="printSection">
    </production-list>
    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
  </main>
</template>

<script src="./cell.component.js"></script>

<style lang="scss" scoped>

</style>
