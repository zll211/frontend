export default [{
  path: 'operate',
  component: () => import(/* webpackChunkName: "log-operate" */ './operate'),
  name: '操作日志',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
