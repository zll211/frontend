export default [{
  path: 'advice',
  props: true,
  component:  () => import(/* webpackChunkName: "diagnosis-advice" */ './advice'),
  name: '特检医嘱',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
