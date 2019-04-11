export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "immunohistochemical-normal" */ './normal'),
  name: 'immunohistochemical-normal',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
