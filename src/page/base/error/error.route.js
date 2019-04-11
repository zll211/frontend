import {routerHelperProvider} from '@/router/';

const errorRoute = [{
  path: '/error',
  component: () => import(/* webpackChunkName: "error" */ './error'),
  name: 'error',
  beforeEnter: (to, from, next) => {
    next();
  },
}];

routerHelperProvider.configureRoutes(errorRoute);
