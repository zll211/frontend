export default [{
  path: 'organization',
  component: () => import(/* webpackChunkName: "system-organization" */ './organization'),
  name: '组织管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
