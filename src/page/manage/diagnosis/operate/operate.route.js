export default [{
  path: 'operate/:id',
  props: true,
  component: () => import(/* webpackChunkName: "diagnosis-operate" */ './operate'),
  name: '诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
