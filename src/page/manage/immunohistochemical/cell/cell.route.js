export default [{
  path: 'cell',
  component: () => import(/* webpackChunkName: "immunohistochemical-cell" */ './cell'),
  name: 'immunohistochemical-cell',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
