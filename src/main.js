import './polyfill';
import ElementUI from 'element-ui';
import './style/element-variables.scss';
import Vue from 'vue';

import App from './App';
import {baseRoutes, flatteningArray} from './config/utils';
import {httpHelperProvider} from './config/http';
import {router} from './router/';
import store from './store/';
import {manageService} from './page/manage/manage.service';

browserVersion().finally(() => {
  isLogin().finally(() => {
    // 加载路由页面
    baseRoutes.forEach(name => require(`./page/base${name}${name}.route`));
    require(`./page/manage/manage.route`);
    Vue.config.productionTip = false;
    Vue.use(ElementUI);

    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: {App},
    });
  });
});


/**
 * 进行http request拦截，在请求之间做一些操作
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.request(function(request) {
});

/**
 * 进行http response拦截，在处理返回之前做通用的操作处理
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.response(function(response) {
  if (response.status === 401) {
    window.sessionStorage.removeItem('accessToken');
    router.replace('/login');
    store.commit('isLogin', false);
  }
});

/**
 * 判断是否有权限进入特定的页面
 */
router.beforeEach((to, from, next) => {
  // console.log('toPath:' + to.path);
  // console.log('fromPath:' + from.path);
  // console.log(store.state.isLogin);
  // 不是登录状态
  if (!store.state.isLogin) {
    // 可去往基础页面
    if (baseRoutes.includes(to.path) || to.path === '/') {
      next(true);
    } else if (from.path === '/') {
      next('/login');
    } else {
      // 阻止前往主页面
      next(false);
    }
    // 登录状态
    // 阻止前往登录或注册页面
  } else if (to.path === '/login' || to.path === '/register') {
    // 如果是从基础页面跳转，则直接进入主页面
    if (baseRoutes.includes(from.path) || from.path === '/') {
      next('/main');
    } else {
      // 如果是从其他页面跳转，不做任何处理
      next(false);
    }
    // 如果是在url地址允许范围内，则前往，否则去到404页面
  } else if (store.state.urlList.find((uri) => ~to.path.indexOf(uri))) {
    next(true);
  } else {
    next('/404');
  }
});

/**
 * 判断是否登录
 * ToDO: 请求菜单接口换成权限接口，进行权限配置
 */
async function isLogin() {
  store.commit('setURL', baseRoutes);
  if (window.sessionStorage.getItem('accessToken')) {
    await manageService.userMenus()
      .then((res) => {
        store.commit('setURL', flatteningArray(res.body.data).concat(baseRoutes));
        store.commit('setMenus', res.body.data);
        store.commit('isLogin', true);
      }).catch(() => {
        window.sessionStorage.removeItem('accessToken');
        router.push('/login');
        store.commit('isLogin', false);
      });
  } else {
    window.sessionStorage.removeItem('accessToken');
    router.push('/login');
    store.commit('isLogin', false);
  }
}


async function browserVersion() {
  const arr = navigator.userAgent.split(' ');
  let chromeVersion = '';
  for (let i = 0; i < arr.length; i++) {
    if (/chrome/i.test(arr[i])) {
      chromeVersion = arr[i];
    }
  }
  if (chromeVersion) {
    chromeVersion = Number(chromeVersion.split('/')[1].split('.')[0]);
    if (chromeVersion < 40) {
      window.location.replace('/static/browser/');
    }
  } else {
    window.location.replace('/static/browser/');
  }
}


