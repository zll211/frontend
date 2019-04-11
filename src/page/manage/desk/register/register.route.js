export default [{
  path: 'register',
  component: r => require.ensure([], () =>
    r(require('./register')), 'desk-register'),
  name: '登记',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

