import storageRoute from './storage/storage.route';
import serviceRoute from './service/service.route';

export const assetsRoute = [{
  path: '/assets',
  component: () => import(/* webpackChunkName: "desk" */ './assets'),
  name: 'assets',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/consumables/storage',
  children: [...storageRoute, ...serviceRoute],
}];
