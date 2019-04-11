export default [{
  path: 'borrow',
  component: r => require.ensure([], () =>
    r(require('./borrow')), 'desk-borrow'),
  name: '借阅管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

