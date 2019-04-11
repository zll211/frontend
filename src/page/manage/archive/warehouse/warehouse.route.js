export default [{
  path: 'warehouse',
  component: () => import(/* webpackChunkName: "archive-warehouse" */ './warehouse'),
  name: 'warehouse',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
