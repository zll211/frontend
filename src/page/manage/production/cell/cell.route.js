export default [{
  path: 'cell',
  component: () => import(/* webpackChunkName: "production-cell" */ './cell'),
  name: '细胞制片',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
