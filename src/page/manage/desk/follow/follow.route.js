export default [{
  path: 'follow',
  component: () => import(/* webpackChunkName: "desk-follow" */ './follow'),
  name: '随访病例',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

