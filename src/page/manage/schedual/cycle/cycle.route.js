export default [{
  path: 'cycle',
  component: () => import(/* webpackChunkName: "schedual-cycle" */ './cycle'),
  name: 'cycle',
  children: [],
}];
