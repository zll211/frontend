import userRoute from './users/users.route';
import roleRoute from './role/role.route';
import organizationRoute from './organization/organization.route';
import accountRoute from './account/account.route';
import menuRoute from './menu/menu.route';

export const systemRoute = [{
  path: '/system',
  component: () => import(/* webpackChunkName: "system" */ './system'),
  name: 'system',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/system/users',
  children: [...userRoute, ...roleRoute, ...organizationRoute, ...accountRoute, ...menuRoute],
}];
