export default [{
  path: 'login',
  component: () => import(/* webpackChunkName: "log-login" */ './login'),
  name: '登录日志',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
