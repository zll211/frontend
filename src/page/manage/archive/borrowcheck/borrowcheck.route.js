export default [{
  path: 'borrowcheck',
  component: () => import(/* webpackChunkName: "archive-borrowcheck" */ './borrowcheck'),
  name: '借阅审核',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

