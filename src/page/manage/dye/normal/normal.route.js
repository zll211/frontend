export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "dye-normal" */ './normal'),
  name: 'dye-normal',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
