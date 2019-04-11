export default [{
  path: 'list',
  component: () => import(/* webpackChunkName: "schedual-list" */ './list'),
  name: 'list',
  children: [],
}];
