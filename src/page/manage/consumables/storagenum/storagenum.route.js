export default [{
  path: 'storagenum',
  component: () => import(/* webpackChunkName: "consumables-storagenum" */ './storagenum'),
  name: '现存&领用',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
