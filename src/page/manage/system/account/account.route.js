export default [{
  path: 'account',
  component: () => import(/* webpackChunkName: "system-account" */ './account'),
  name: '账户管理',
}];
