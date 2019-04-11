export default [{
  path: 'bind',
  component: () => import(/* webpackChunkName: "slice-bind" */ './bind'),
  name: '切片绑定',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
