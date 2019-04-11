<template>
  <aside class="el-aside">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :unique-opened="true"
      background-color="#25242A"
      text-color="#dadada"
      active-text-color="#ffffff"
      :collapse="collapse"
      :router="true">
      <el-radio-group v-model="collapse">
        <a @click="modifyCollapse" v-show="collapse"><img
          style="width: 12px"
          src="../../assets/img/navOpenIcon.png" alt=""></a>
        <a @click="modifyCollapse" v-show="!collapse"><img
          src="../../assets/img/navCloseIcon.png" alt=""></a>
      </el-radio-group>

      <el-menu-item
        v-if="menu.children&&menu.children.length ===0&&menu.is_show==='1'"
        :index="menu.uri+''" v-for="(menu, index) in menuList"
        :key="index" class="mainNav">
        <!--<i class="el-icon-caret-right"></i>-->
        <i><img :src="menu.icon_path" alt="" width="16"></i>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
      <el-submenu
        v-if="menu.children&&menu.children.length >0&&menu.is_show==='1'"
        :index="index+''" v-for="(menu, index) in menus" :key="index">
        <template slot="title">
          <!--<i class="el-icon-caret-right"></i>-->
          <i><img :src="menu.icon_path" alt="" width="14"></i>
          <span>{{menu.name}}</span>
        </template>
        <el-menu-item
          v-if="child.children&&child.children.length ===0&&child.is_show==='1'"
          :index="child.uri+''"
          v-for="(child, index1) in menu.children" :key="index1">
          <i><img :src="child.icon_path" alt="" width="14"></i>
          <span>{{child.name}}</span>
        </el-menu-item>
        <el-submenu
          v-if="child.children&&child.children.length > 0&&child.is_show==='1'"
          :index="index+'-'+index1"
          v-for="(child, index1) in menu.children" :key="index1">
          <template slot="title">
            <i><img :src="child.icon_path" alt="" width="14"></i>
            <span>{{child.name}}</span>
          </template>
          <el-menu-item v-if="secondChild.is_show==='1'"
                        :index="secondChild.uri+''"
                        v-for="(secondChild, index2) in child.children"
                        :key="index2">
            <i><img :src="secondChild.icon_path" alt="" width="14"></i>
            <span>
              {{secondChild.name}}
            </span>
          </el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </aside>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        iconSrc: '',
      };
    },
    created() {
      this.iconSrc = '../assets/img/icon.png';
    },
    computed: {
      ...mapState([
        'menus',
        'collapse',
      ]),
      menuList() {
        return this.menus.map((menu) => {
          if (menu?.children?.length > 0) {
            if (!menu.children.some((child) => child.is_show === '1')) {
              menu.is_show = '0';
            }
          }
          return menu;
        });
      },
    },
    methods: {
      modifyCollapse() {
        this.$store.commit('setCollapse', !this.collapse);
        setTimeout(() => {
          this.$root.$emit('size-change');
        }, 300);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../style/variables";

  .el-aside {
    .el-menu-item {
      // padding-left: 20px !important;
      span {
        margin-left: 20px;
      }
    }
    .el-submenu {
      .el-menu-item {
        padding-left: 30px !important;
      }
    }
    .el-submenu__title {
      padding-left: 20px !important;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      span {
        margin-left: 20px;
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 180px;
      /*min-height: 800px;*/
      height: 100%;
    }
    .el-menu--collapse {
      width: 50px;
      height: 100%;
      .el-submenu {
        & > .el-submenu__title {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          span {
            display: none;
          }
          &:hover {
            & > .el-submenu__title {
              background-color: $_pm-base-color !important;
            }
            i {
              color: #fff !important;
            }
            background-color: $_pm-base-color !important;
          }
        }
        &.is-active {
          & > .el-submenu__title {
            background-color: $_pm-base-color !important;
          }
          i {
            color: #fff !important;
          }
        }
      }
    }
    .el-submenu {
      background-color: #32323A;
      & > .el-submenu__title {
        background-color: #32323A !important;
      }
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        min-width: 180px;
        &.is-active {
          background-color: $_pm-base-color !important;
        }
        &:hover {
          background-color: $_pm-base-color !important;
        }
      }
    }
    .mainNav {
      background-color: #32323A !important;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      .el-tooltip {
        display: flex !important;;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: $_pm-base-color !important;
        }
      }
      &.is-active {
        background-color: $_pm-base-color !important;
      }
    }
    .el-radio-group {
      background-color: #2a2f32;
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        cursor: pointer;
      }
    }
  }

  .el-menu--vertical {
    .el-menu-item {
      span {
        margin-left: 20px;
      }
    }
    .el-submenu {
      background-color: #32323A;
      & > .el-submenu__title {
        background-color: #32323A !important;
        height: 40px;
        line-height: 40px;
        min-width: 180px;
        span {
          margin-left: 20px !important;
        }
      }
    }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      min-width: 180px;
      &.is-active {
        background-color: $_pm-base-color !important;
      }
      &:hover {
        background-color: $_pm-base-color !important;
      }
    }
  }

</style>
