export default [{
  path: 'specimen',
  component: () => import(/* webpackChunkName: "statistical-specimen" */ './specimen'),
  name: '标本统计',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
