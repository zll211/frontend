export default [{
  path: 'workload',
  component: () => import(/* webpackChunkName: "statistical-workload" */ './workload'),
  name: '工作量统计',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
