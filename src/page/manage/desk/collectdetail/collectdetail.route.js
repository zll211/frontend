export default [{
  path: 'collectdetail/:id',
  props: true,
  component: () => import(/* webpackChunkName: "desk-collectdetail" */ './collectdetail'),
  name: '病例详情',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
