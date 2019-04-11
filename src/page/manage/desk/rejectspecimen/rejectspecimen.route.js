export default [{
  path: 'rejectspecimen',
  component: r => require.ensure([], () =>
    r(require('./rejectspecimen')), 'desk-rejectspecimen'),
  name: '拒收标本',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

