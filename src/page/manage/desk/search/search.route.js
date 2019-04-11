export default [{
  path: 'search',
  component: r => require.ensure([], () =>
    r(require('./search')), 'desk-search'),
  name: '查询',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

