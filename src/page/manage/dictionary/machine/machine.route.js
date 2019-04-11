export default [{
  path: 'machine',
  component: () => import(/* webpackChunkName: "dictionary-machine" */ './machine'),
  name: 'machine',
  beforeEnter: (to, from, next) => {
    next();
  },
}];
