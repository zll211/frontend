
import baseRoute from './base/base.route';
import specimenRoute from './specimen/specimen.route';
import pathologicalRoute from './pathological/pathological.route';
import timeoutRoute from './timeout/timeout.route';
import roleConfigRoute from './role/role.route';
import processRoute from './process/process.route';
import reportRoute from './report/report.route';
import editRoute from './report/edit/edit.route';
import machineRoute from './machine/machine.route';
import specialRoute from './specialresult/special.route';

export const dictionaryRoute = [{
  path: '/dictionary',
  component: () => import(/* webpackChunkName: "dictionary" */ './dictionary'),
  name: 'dictionary',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/dictionary/base',
  children: [ ...baseRoute, ...specimenRoute, ...pathologicalRoute, ...timeoutRoute, ...roleConfigRoute, ...processRoute, ...reportRoute, ...editRoute, ...machineRoute, ...specialRoute],
}];
