export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "production-normal" */ './normal'),
  name: '常规制片',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
