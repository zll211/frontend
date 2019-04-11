import materialsRoute from './materials/materials.route';
import storageinRoute from './storagein/storagein.route';
import storageoutRoute from './storageout/storageout.route';
import storagenumRoute from './storagenum/storagenum.route';

export const consumablesRoute = [{
  path: '/consumables',
  component: () => import(/* webpackChunkName: "consumables" */ './consumables'),
  name: 'consumables',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/consumables/materials',
  children: [...materialsRoute, ...storageinRoute, ...storageoutRoute, ...storagenumRoute],
}];
