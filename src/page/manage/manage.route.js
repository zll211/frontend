import {routerHelperProvider} from '../../router';
import {statisticalRoute} from './statistical/statistical.route';
import {productionRoute} from './production/production.route';
import {sliceRoute} from './slice/slice.route';
import {diagnosisRoute} from './diagnosis/diagnosis.route';
import {systemRoute} from './system/system.route';
import {logRoute} from './log/log.route';
import {homeRoute} from './home/home.route';
import {specimenRoute} from './specimen/specimen.route';
import {deskRoute} from './desk/desk.route';
import {assetsRoute} from "./assets/assets.route";
import {consumablesRoute} from "./consumables/consumables.route";
import {schedualRoute} from './schedual/schedual.route';
import {dictionaryRoute} from "./dictionary/dictionary.route";
import {specialRoute} from './special/special.route';
import {archiveRoute} from './archive/archive.route';


const manageRoute = [{
  path: '/manage',
  component: () => import(/* webpackChunkName: "manage" */ './manage'),
  name: 'manage',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/home',
  children: [...homeRoute, ...deskRoute, ...specimenRoute, ...statisticalRoute,
    ...productionRoute, ...specialRoute,
    ...sliceRoute, ...diagnosisRoute, ...systemRoute, ...logRoute, ...assetsRoute,
    ...consumablesRoute, ...schedualRoute, ...dictionaryRoute, ...archiveRoute],
}];

routerHelperProvider.configureRoutes(manageRoute);
