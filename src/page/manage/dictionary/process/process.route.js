export default [{
  path: 'process',
  component: () => import(/* webpackChunkName: "dictionary-process' */ './process'),
  name: 'process',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
