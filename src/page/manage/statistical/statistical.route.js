import workRoute from './workload/workload.route';
import specimenRoute from './specimen/specimen.route';
import reportformRoute from './reportform/reportform.route';
import consumableRoute from './consumable/consumable.route';

export const statisticalRoute = [{
  path: '/statistical',
  component: () => import(/* webpackChunkName: "statistical" */ './statistical'),
  name: 'statistical',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/statistical/workload',
  children: [...workRoute, ...specimenRoute, ...reportformRoute, ...consumableRoute],
}];
