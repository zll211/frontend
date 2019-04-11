export default [{
  path: 'sendlogistics',
  component: r => require.ensure([], () =>
    r(require('./sendlogistics')), 'sendlogistics'),
  name: '发送物流',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

