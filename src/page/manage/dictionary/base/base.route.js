export default [{
  path: 'base',
  component: () => import(/* webpackChunkName: "dictionary-base" */ './base'),
  name: '基本数据管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
