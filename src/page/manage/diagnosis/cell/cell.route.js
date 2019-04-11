export default [{
  path: 'cell',
  component: () => import(/* webpackChunkName: "diagnosis-cell" */ './cell'),
  name: '细胞诊断',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
