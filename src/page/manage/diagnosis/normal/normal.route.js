export default [{
  path: 'normal',
  component: () => import(/* webpackChunkName: "diagnosis-normal" */ './normal'),
  name: '常规诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
