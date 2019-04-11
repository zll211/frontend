export default [{
  path: 'collect',
  component: r => require.ensure([], () =>
    r(require('./collect')), 'desk-collect'),
  name: '病例收藏',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

