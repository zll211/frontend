import normalRoute from './normal/normal.route';
import frozenRoute from './frozen/frozen.route';
import takeRoute from './takespecimen/takespecimen.route';


export const specimenRoute = [{
  path: '/specimen',
  component: () => import(/* webpackChunkName: "specimen" */ './specimen'),
  name: 'specimen',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/specimen/normal',
  children: [...normalRoute, ...takeRoute, ...frozenRoute],
}];
