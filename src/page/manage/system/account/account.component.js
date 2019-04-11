import {mapState} from "vuex";
import {accountService} from "./account.service";

export default {
  created() {
  },
  data() {
    return {
      userForm: {},
      current: {
        type: 'text',
        icon: 'assets/img/close-eye.png',
        isClose: true,
      },
      newP: {
        type: 'text',
        icon: 'assets/img/close-eye.png',
        isClose: true,
      },
      again: {
        type: 'text',
        icon: 'assets/img/close-eye.png',
        isClose: true,
      },
    };
  },
  computed: mapState(['user']),
  methods: {
    passwordFocus(state) {
      if (this[state].isClose) {
        this[state].type = 'password';
      } else {
        this[state].type = 'text';
      }
    },
    passwordEyeClick(state) {
      if (this[state].icon === 'assets/img/close-eye.png') {
        this[state].icon = 'assets/img/open-eye.png';
        this[state].type = 'text';
        this[state].isClose = false;
      }else if (this[state].icon !== 'assets/img/close-eye.png') {
        this[state].icon = 'assets/img/close-eye.png';
        this[state].type = 'password';
        this[state].isClose = true;
      }
    },
    savePassword() {
      let data = {
        current_password: this.userForm.current_password,
        new_password: this.userForm.new_password,
        new_password_confirmation: this.userForm.new_password_confirmation,
      };
      accountService.modifyPassword(data)
        .then((res) => {
          this.$message.success('修改密码成功');
      }).catch(() => {
        this.$message.error('修改密码失败');
      })
    },
  },
};
