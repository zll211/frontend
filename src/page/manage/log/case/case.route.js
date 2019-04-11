export default [{
  path: 'case',
  component: () => import(/* webpackChunkName: "log-case" */ './case'),
  name: '病例日志',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
