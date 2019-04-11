export default [{
  path: 'report',
  component: () => import(/* webpackChunkName: "dictionary-process' */ './report'),
  name: 'report',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
