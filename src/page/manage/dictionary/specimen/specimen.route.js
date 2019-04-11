export default [{
  path: 'specimen',
  component: () => import(/* webpackChunkName: "dictionary-specimen" */ './specimen'),
  name: '标本数据管理',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
