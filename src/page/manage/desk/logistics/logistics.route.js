export default [{
  path: 'logistics',
  component: r => require.ensure([], () =>
    r(require('./logistics')), 'desk-logistics'),
  name: '物流管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

