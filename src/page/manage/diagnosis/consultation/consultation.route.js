export default [{
  path: 'consultation',
  component: () => import(/* webpackChunkName: "diagnosis-consultation" */ './consultation'),
  name: '科内会诊',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
