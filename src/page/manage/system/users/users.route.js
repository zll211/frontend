export default [{
  path: 'users',
  component: () => import(/* webpackChunkName: "system-users" */ './users'),
  name: '用户管理',
}];
