export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "molecular-normal" */ './normal'),
  name: 'molecular-normal',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
