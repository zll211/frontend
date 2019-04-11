export default [{
  path: 'role',
  component: () => import(/* webpackChunkName: "dictionary-role" */ './role'),
  name: '角色配置',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
