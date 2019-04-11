export default [{
  path: 'timeout',
  component: () => import(/* webpackChunkName: "dictionary-timeout" */ './timeout'),
  name: 'timeout',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
