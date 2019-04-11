export default [{
  path: 'cell',
  component: () => import(/* webpackChunkName: "molecular-cell" */ './cell'),
  name: 'molecular-cell',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
