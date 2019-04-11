export default [{
  path: 'list',
  component: () => import(/* webpackChunkName: "archive-list" */ './list'),
  name: '归档列表',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

