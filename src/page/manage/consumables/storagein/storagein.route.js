export default [{
  path: 'storagein',
  component: () => import(/* webpackChunkName: "consumables-storagein" */ './storagein'),
  name: '耗材入库',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
