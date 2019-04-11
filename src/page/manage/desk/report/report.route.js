export default [{
  path: 'report',
  component: r => require.ensure([], () =>
    r(require('./report')), 'desk-report'),
  name: '报告管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

