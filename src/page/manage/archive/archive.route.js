import borrowRoute from './borrow/borrow.route';
import borrowcheckRoute from './borrowcheck/borrowcheck.route';
import listRoute from './list/list.route'
import warehouseRoute from './warehouse/warehouse.route';

export const archiveRoute = [{
  path: '/archive',
  component: () => import(/* webpackChunkName: "archive" */ './archive'),
  name: 'archive',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/archive/register',
  children: [...borrowRoute, ...borrowcheckRoute, ...listRoute, ...warehouseRoute],
}];
