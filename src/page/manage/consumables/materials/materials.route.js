export default [{
  path: 'materials',
  component: () => import(/* webpackChunkName: "consumables-materials" */ './materials'),
  name: '物料档案',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
