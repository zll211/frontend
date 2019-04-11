export const homeRoute =  [{
  path: '/home',
  component: () => import(/* webpackChunkName: "home" */ './home'),
  name: '首页',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

