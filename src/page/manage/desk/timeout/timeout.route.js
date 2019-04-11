export default [{
  path: 'timeout',
  component: r => require.ensure([], () =>
    r(require('./timeout')), 'desk-timeout'),
  name: '超时列表',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

