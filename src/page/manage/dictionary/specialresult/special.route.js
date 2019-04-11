export default [{
  path: 'special',
  component: () => import(/* webpackChunkName: "dictionary-timeout" */ './special'),
  name: 'special',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
