import normalRoute from './normal/normal.route';
import frozenRoute from './frozen/frozen.route';
import cellRoute from './cell/cell.route';
import operateRoute from './operate/operate.route';
import adviceRoute from './advice/advice.route';
import consultationRoute from './consultation/consultation.route';

export const diagnosisRoute = [{
  path: '/diagnosis',
  component: () => import(/* webpackChunkName: "diagnosis" */ './diagnosis'),
  name: 'diagnosis',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/diagnosis/normal',
  children: [...normalRoute, ...frozenRoute, ...cellRoute, ...operateRoute, ...adviceRoute, ...consultationRoute],
}];
