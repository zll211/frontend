import collectRoute from './collect/collect.route';
import collectdetailRoute from './collectdetail/collectdetail.route';
import logisticsRoute from './logistics/logistics.route';
import registerRoute from './register/register.route';
import reportRoute from './report/report.route';
import searchRoute from './search/search.route';
import sendlogisticsRoute from './sendlogistics/sendlogistics.route';
import timeoutRoute from './timeout/timeout.route';
import rejectspecimenRoute from './rejectspecimen/rejectspecimen.route';
import followRoute from './follow/follow.route';
export const deskRoute = [{
  path: '/desk',
  component: () => import(/* webpackChunkName: "desk" */ './desk'),
  name: 'desk',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/desk/register',
  children: [...collectRoute, ...collectdetailRoute, ...logisticsRoute, ...registerRoute, ...reportRoute, ...searchRoute, ...sendlogisticsRoute, ...timeoutRoute, ...rejectspecimenRoute,...followRoute],
}];
