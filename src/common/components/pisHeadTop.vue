<template>
  <div class="header-main">
    <el-row type="flex" justify="space-between">
      <el-col :span="12">
        <div class="header-left">
          <img class="circle" :src="setting.hospital_logo"/>
          <span>{{setting.hospital_name}}</span>
        </div>
      </el-col>
      <!--<el-col :span="8">
        <div class="header-center">
          <img class="company-logo" src="assets/img/logo.png"/>
          <span>杭州智团病理信息管理系统</span>
        </div>
      </el-col>-->
      <el-col :span="12">
        <div class="header-right">
          <p class="case-library">当前病例库: {{user.mysql_switch === 'mysql_second'?'细胞病例库': '默认病例库'}}</p>
          <a href="https://doc.hzztai.com/pis" class="help-doc" target="_blank">使用手册</a>
          <div class="lock-screen">
            <p class="flex align-items-center">
              <img v-show="lockScreenDialogVisible" src='@/assets/img/lock.png' width="16" alt="锁定屏幕" title="锁定屏幕"
                   style="cursor: pointer;" @click="lockScreen"/>
              <img v-show="!lockScreenDialogVisible" src='@/assets/img/unlock.png' width="16" alt="锁定屏幕" title="锁定屏幕"
                   style="cursor: pointer;" @click="lockScreen"/>
            </p>
          </div>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="dropdown-button">
              <img class="user-avator" src="@/assets/img/default-avator.png"/>
              <span style="margin: 0 5px" class="real-name">{{user.realname}}</span>
              <i class="el-icon-caret-bottom drop-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="lockScreen">锁定屏幕</el-dropdown-item>
              <!--<el-dropdown-item>{{user.name}}</el-dropdown-item>-->
              <router-link to="/desk/collect">
                <el-dropdown-item :divided="true">收藏病例</el-dropdown-item>
              </router-link>
              <router-link to="/system/account">
                <el-dropdown-item :divided="true">账号设置</el-dropdown-item>
              </router-link>
              <el-dropdown-item :divided="true" command="switch">切换病例库
              </el-dropdown-item>
              <el-dropdown-item :divided="true" command="logout">退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="屏幕已锁定，输入密码解锁"
      :visible.sync="lockScreenDialogVisible"
      class="lock-screen-dialog"
      width="400px"
      :close-on-click-modal="closeDialog"
      :close-on-press-escape="closeDialog"
      :show-close="closeDialog">
      <el-form :model="passForm" ref="passForm" :rules="passFormRules" onsubmit="return false;">
        <el-form-item label="密码" label-width="55px" prop="password" v-loading="passFormLoading">
          <el-input v-if="passFormShow" :type="inputType" :readonly="readonly" @focus="removeReadonly"
                    @blur="addReadonly" size="small"
                    v-model="passForm.password" v-on:keyup.enter.native="submitPassForm" :trigger-on-focus="false"
                    v-on:keydown.native="keyDown"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPassForm" size="small">解锁</el-button>
        <el-button type="primary" @click="handleCommand('logout')" size="small">退出登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {loginService} from '../../page/base/login/login.service';
  import {messageBoxService} from '../service/message.service';
  import {userService} from '../../page/manage/system/users/users.service';

  export default {
    data() {
      return {
        lockScreenDialogVisible: false,
        closeDialog: false,
        passFormLoading: false,
        passFormShow: true,
        inputType: 'text',
        passForm: {
          password: '',
        },
        readonly: false,
        passFormRules: {
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
        },
      };
    },
    computed: mapState([
      'user',
      'setting',
    ]),
    watch: {
      'passForm.password': function(val) {
        if (val === '') {
          this.passFormShow = false;
          this.passFormLoading = true;
          setTimeout(() => {
            this.passFormLoading = false;
            this.passFormShow = true;
            this.inputType = 'text';
          }, 10);
        }
      },
    },
    mounted() {
      this.lockScreenDialogVisible = window.sessionStorage.getItem('lockScreenDialogVisible') === 'true' ? true : false;
    },
    methods: {
      removeReadonly() {
        // this.readonly = false;
      },
      addReadonly() {
        // this.readonly = true;
      },
      keyDown(key) {
        let keyCode = key.keyCode;
        if ((47 < keyCode && keyCode < 58) || (64 < keyCode && keyCode < 91) || (95 < keyCode && keyCode < 112) || (185 < keyCode && keyCode < 193)) {
          this.inputType = 'password';
        }
      },
      logout() {
        loginService.logout()
          .finally(() => {
            window.sessionStorage.removeItem('accessToken');
            window.sessionStorage.removeItem('loginTime');
            window.sessionStorage.removeItem('lockScreenDialogVisible');
            this.$store.commit('isLogin', false);
            this.$router.replace('/login');
          });
      },
      handleCommand(command) {
        if (command === 'logout') {
          this.logout();
        }
        if (command === 'switch') {
          messageBoxService.confirm('是否切换病例库?', '切换后需要重新登录', '取消', '切换')
            .then(() => {
              userService.patchUser(this.user.id, {
                mysql_switch: this.user.mysql_switch === 'mysql_second' ? '1' : 'mysql_second',
              }).then((res) => {
                this.$message.success('切换成功');
                this.logout();
              }).catch((error) => {
                this.$message.error('切换失败');
              });
            }).catch(() => {
            this.$message.info('已取消切换');
          });
        }
      },
      lockScreen() {
        this.lockScreenDialogVisible = true;
        window.sessionStorage.setItem('lockScreenDialogVisible', 'true');
      },
      submitPassForm(key) {
        this.$refs.passForm.validate((valid) => {
          if (valid) {
            let params = {
              name: this.user.name,
              password: this.passForm.password,
            };
            loginService.verifyPass(params).then((res) => {
              if (res.body.success) {
                this.lockScreenDialogVisible = false;
                window.sessionStorage.setItem('lockScreenDialogVisible', 'false');
                this.$refs.passForm.resetFields();
              } else {
                this.$message.error('密码错误。');
              }
            });
          } else {
            return false;
          }
        });
      },
    },

  };
</script>

<style scoped lang="scss">
  @import "../../style/variables";

  .header-main {
    position: relative;
  }

  .header-left {
    align-items: center;
    color: #fff;
    display: flex;
    font-size: 16px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;
  }

  .header-center {
    @extend .header-left;
    color: #fff;
    font-size: 20px;
    justify-content: center;
  }

  .header-right {
    @extend .header-left;
    justify-content: flex-end;
  }

  .circle {
    background: #fff;
    border-radius: 50%;
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }

  .help-doc {
    color: #555555;
    font-size: 14px;
    cursor: pointer;
    margin-right: 30px;
    font-weight: 600;
  }

  .company-logo {
    height: 20px;
    margin-right: 12px;
    width: 20px;
  }

  .dropdown-button {
    cursor: pointer;
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 40px;
    width: 116px;
    .user-avator {
      margin-left: 8px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .drop-bottom {
      margin-right: 8px;
      &::before {
        width: 9px;
        height: 9px;
        color: $_pm-base-dark-color;
      }
    }
    &:hover {
      .drop-bottom {
        &::before {
          color: $_pm-base-color;
        }
      }
      .real-name {
        color: #dddddd;
      }
      background: $_pm-base-dark-color;
    }
  }

  .el-dropdown-menu {
    padding: 4px 0;
    .popper__arrow {
      border-width: 0 !important;
      &:after {
        border-width: 0 !important;
      }
    }
  }

  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }

  .el-dropdown-menu__item {
    color: $_pm-default-dark-color;
    height: 42px;
    line-height: 42px;
    margin-top: 0;
    /*width: 100px;*/
    padding: 0 30px;
    &:before {
      height: 0;
    }
    &:focus {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    &:not(.is-disabled):hover {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    a {
      color: $_pm-default-dark-color;
    }
  }

  .lock-screen {
    margin-right: 20px;
    p {
      font-size: 14px;
      color: #515151;
      span {
        margin-right: 10px;
      }
    }
  }

  .case-library {
    margin-right: 20px;
    font-size: 14px;
    color: #515151;
  }

  .lock-screen-dialog {
    .el-dialog__body {
      padding: 15px 20px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
