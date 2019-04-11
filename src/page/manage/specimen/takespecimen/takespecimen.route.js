export default [{
  path: 'takespecimen/:id',
  props: true,
  component: r => require.ensure([], () =>
    r(require('./takespecimen')), 'takespecimen'),
  name: '取材记录',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
