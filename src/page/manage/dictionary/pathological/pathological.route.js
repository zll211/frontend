export default [{
  path: 'pathological',
  component: () => import(/* webpackChunkName: "dictionary-pathological" */ './pathological'),
  name: 'pathological',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
