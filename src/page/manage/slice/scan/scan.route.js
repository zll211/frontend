export default [{
  path: 'scan',
  component: () => import(/* webpackChunkName: "slice-scan" */ './scan'),
  name: '切片扫描',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
