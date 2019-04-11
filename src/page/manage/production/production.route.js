import normalRoute from './normal/normal.route';
import frozenRoute from './frozen/frozen.route';
import cellRoute from './cell/cell.route';

export const productionRoute = [{
  path: '/production',
  component: () => import(/* webpackChunkName: "production" */ './production'),
  name: 'production',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/production/normal',
  children: [...normalRoute, ...frozenRoute, ...cellRoute],
}];
