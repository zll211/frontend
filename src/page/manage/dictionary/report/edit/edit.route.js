export default [{
  path: 'report/:edit',
  component: () => import(/* webpackChunkName: "dictionary-process' */ './edit'),
  name: 'editReport',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
