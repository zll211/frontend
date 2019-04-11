export default [{
  path: 'frozen',
  component: () => import(/* webpackChunkName: "specimen-frozen" */ './frozen'),
  name: '冰冻取材',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
