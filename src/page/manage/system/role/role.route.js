export default [{
  path: 'role',
  component: () => import(/* webpackChunkName: "system-role" */ './role'),
  name: '角色管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
