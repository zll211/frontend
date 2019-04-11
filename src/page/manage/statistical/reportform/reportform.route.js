export default [{
  path: 'reportform',
  component: () => import(/* webpackChunkName: "statistical-reportform" */ './reportform'),
  name: '报表统计',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
