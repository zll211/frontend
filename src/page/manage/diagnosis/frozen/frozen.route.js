export default [{
  path: 'frozen',
  component: () => import(/* webpackChunkName: "diagnosis-frozen" */ './frozen'),
  name: '术中冰冻诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
