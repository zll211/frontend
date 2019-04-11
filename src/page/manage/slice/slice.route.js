import bindRoute from './bind/bind.route';
import scanRoute from './scan/scan.route';

export const sliceRoute = [{
  path: '/slice',
  component: () => import(/* webpackChunkName: "slice" */ './slice'),
  name: 'slice',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/slice/scan',
  children: [...bindRoute, ...scanRoute],
}];
