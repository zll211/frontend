import {loginService} from './login.service';
import {httpHelperProvider} from '@/config/http';
import hospitalLogoPath from '@/assets/img/logo.png';
import {
  baseRoutes,
  flatteningArray,
  formatDateTime,
} from '../../../config/utils';
import {manageService} from '../../manage/manage.service';


export default {
  data() {
    return {
      setting: {},
      hospitalName: '江丰生物病理管理',
      hospitalLogo: hospitalLogoPath,
      version: 'v1.0.0',
      rememberPassChecked: false,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  /*beforeCreate: function () {
    document.getElementsByTagName('body')[0].style.backgroundColor =
      'rgb(251,251,251)';
  },*/
  created() {
    loginService.setting()
      .then((res)=>{
        this.setting = res.body.data;
      })
  },
  mounted() {
   /* document.onkeydown = (e) => {
      let key=window.event.keyCode;
      if(key===13){
        this.login('loginForm');
      }
    }*/
  },
  computed: {},
 /* beforeDestroy() {
    document.body.removeAttribute('style');
  },*/
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginService.login({
            email: this.loginForm.username,
            password: this.loginForm.password,
          }).then((res) => {
            window.sessionStorage.setItem('accessToken',
              res.data.access_token);
            httpHelperProvider.setHeaders([{
              'Authorization':
                `${res.data.token_type} ${res.data.access_token}`,
            }]);
            this.$store.commit('setUser', res.data.user);
            window.sessionStorage.setItem('userId',
              res.data.user.id);
            window.sessionStorage.setItem('loginTime',
              formatDateTime(new Date()));
            manageService.userMenus()
              .then((res) => {
                this.$store.commit('setURL', flatteningArray(res.body.data).concat(baseRoutes));
                this.$store.commit('setMenus', res.body.data);
                this.$store.commit('isLogin', true);
                /* 默认进入第一个菜单
                   如果第一个菜单不是工作台（home）
                   则进入第一个菜单下的第一个二级菜单 */
                if(res.body.data) {
                  if(res.body.data[0].uri) {
                    this.$router.replace(res.body.data[0].uri);
                  }else {
                    this.$router.replace(res.body.data[0].children[0].uri);
                  }
                }
              }).catch(() => {
              window.sessionStorage.removeItem('accessToken');
            });
          }).catch(()=>{
            this.$message.error('登录失败');
          });
        } else {
          return false;
        }
      });
    },
    ukey() {

    },
  },
};
