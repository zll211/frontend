export default [{
  path: 'menu',
  component: () => import(/* webpackChunkName: "system-menu" */ './menu'),
  name: '菜单管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
