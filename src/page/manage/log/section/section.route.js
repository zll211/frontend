export default [{
  path: 'section',
  component: () => import(/* webpackChunkName: "log-section" */ './section'),
  name: '切片日志',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
