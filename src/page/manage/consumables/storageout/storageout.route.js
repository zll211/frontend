export default [{
  path: 'storageout',
  component: () => import(/* webpackChunkName: "consumables-storageout" */ './storageout'),
  name: '耗材出库',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
