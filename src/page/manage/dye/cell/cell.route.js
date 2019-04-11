export default [{
  path: 'cell',
  component: () => import(/* webpackChunkName: "dye-cell" */ './cell'),
  name: 'dye-cell',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
