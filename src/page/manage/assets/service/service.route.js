export default [{
  path: 'service',
  component: r => require.ensure([], () =>
    r(require('./service')), 'service'),
  name: '维修登记',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
