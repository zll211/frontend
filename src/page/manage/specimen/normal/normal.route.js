export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "specimen-normal" */ './normal'),
  name: '常规取材',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
