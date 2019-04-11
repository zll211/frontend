import listRoute from './list/list.route';
import cycleRoute from './cycle/cycle.route';

export const schedualRoute = [{
  path: '/schedual',
  component: () => import(/* webpackChunkName: "schedual" */ './schedual'),
  name: 'schedual',
  redirect: '/schedual/list',
  children: [...listRoute, ...cycleRoute],
}];
