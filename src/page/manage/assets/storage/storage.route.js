export default [{
  path: 'storage',
  component: r => require.ensure([], () =>
    r(require('./storage')), 'storage'),
  name: '资产入库',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
