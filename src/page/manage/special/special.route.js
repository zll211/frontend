import molecularNormalRoute from '../molecular/normal/normal.route';
import molecularCellRoute from '../molecular/cell/cell.route';
import immunohistochemicalNormalRoute from '../immunohistochemical/normal/normal.route';
import immunohistochemicalCellRoute from '../immunohistochemical/cell/cell.route';
import dyeNormalRoute from '../dye/normal/normal.route';
import dyeCellRoute from '../dye/cell/cell.route';

export const specialRoute = [{
  path: '/molecular',
  component: () => import(/* webpackChunkName: "molecular" */ './special'),
  name: '分子病理',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/molecular/normal',
  children: [...molecularNormalRoute, ...molecularCellRoute],
}, {
  path: '/immunohistochemical',
  component: () => import(/* webpackChunkName: "immunohistochemical" */ './special'),
  name: '免疫组化',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/immunohistochemical/normal',
  children: [...immunohistochemicalNormalRoute, ...immunohistochemicalCellRoute],
}, {
  path: '/dye',
  component: () => import(/* webpackChunkName: "dye" */ './special'),
  name: '特殊染色',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/dye/normal',
  children: [...dyeNormalRoute, ...dyeCellRoute],
}];
