<template>
  <el-container class='fill-contain'>
    <el-header>
      <pis-head-top></pis-head-top>
    </el-header>
    <el-container>
      <pis-side-nav></pis-side-nav>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import pisHeadTop from '../../common/components/pisHeadTop';
  import pisSideNav from '../../common/components/pisSideNav';
  import {manageService} from "./manage.service";

  export default {
    async created() {
      manageService.setting()
        .then((res) => {
          this.$store.commit('setSetting', res.body.data);
        });
      this.user();
      this.regionList();
      this.inspectionList();
      await this.userList()
    },
    data() {
      return {

      };
    },
    components: {
      pisHeadTop,
      pisSideNav,
    },
    methods: {
      scrollFn() { //滚动条变化事件
        this.$root.$emit('manage-scroll', this.$el.getElementsByTagName('main')[0].scrollTop);
      },
      user() {
        manageService.userInfo(window.sessionStorage.getItem('userId'))
          .then((res) => {
            this.$store.commit('setUser', res.body.data);
          });
      },
      regionList() {
        manageService.getRegionList().then((res) => {
          this.$store.commit('setArea', res.body.data);
        });
      },
      inspectionList(array = ['hospital', 'department', 'doctor']) {
        array.forEach((type) => {
          manageService.inspectionList(type)
            .then((res) => {
              this.$store.commit(
                `set${type.substring(0, 1).toUpperCase() + type.substring(1)}`,
                res.body.data);
            });
        });
      },
      userList() {
        manageService.userList()
          .then((res) => {
            this.$store.commit('setUserList', res.body.data);
          })
      },
    },
    mounted() {
      this.$el.getElementsByTagName('main')[0].addEventListener('scroll', this.scrollFn);
      window.onresize = () => {
        this.$root.$emit('size-change');
      }
    },
    beforeDestroy() {
      this.$el.getElementsByTagName('main')[0].removeEventListener('scroll', this.scrollFn);
      window.onresize = null;
    },
  };
</script>

<style lang='scss' src="./manage.scss"></style>
