<template>
  <main class="pis-icon flex align-items-center"
        @click="iconClick">
    <el-button v-if="isButton" size="mini" :icon="iconName"></el-button>
    <div v-if="!isButton" class="icon">
      <i v-if="!iconSrc" :class="iconName"></i>
      <img v-if="iconSrc" class="icon" :class="iconName" :src="iconSrc">
    </div>
    <span class="icon-text"><slot name="iconText">{{iconText}}</slot></span>
  </main>
</template>

<script>
  export default {
    name: "pisIcon",
    props: {
      isButton: false,
      iconName: '',
      iconText: '',
      iconSrc: '',
    },
    methods: {
      iconClick() {
        this.$emit('icon-click');
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../style/variables";

  .pis-icon {
    cursor: pointer;
    font-size: 16px;
    color: $_pm-default-color;
    .el-button--mini {
      border: none;
      border-radius: 4px;
      font-size: 17px;
      height: 29px;
      padding: 0;
      width: 29px;
    }
  }

  .icon {
    display: flex;
    align-self: center;
    justify-content: center;
    color: $_pm-base-color;
    font-size: 32px;
    img {
      width: 20px;
      height: 20px;
    }
  }

  .icon-text {
    line-height: 22px;
    margin-left: 11px;
  }

</style>
