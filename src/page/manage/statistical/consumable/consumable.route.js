export default [{
  path: 'consumable',
  component: () => import(/* webpackChunkName: "statistical-consumable" */ './consumable'),
  name: '耗材统计',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
