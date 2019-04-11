export default [{
  path: 'frozen',
  component: () => import(/* webpackChunkName: "production-frozen" */ './frozen'),
  name: '冰冻制片',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
