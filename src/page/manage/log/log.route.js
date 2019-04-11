import loginRoute from './login/login.route';
import operateRoute from './operate/operate.route';
import caseRoute from './case/case.route';
import sectionRoute from './section/section.route';

export const logRoute = [{
  path: '/log',
  component: () => import(/* webpackChunkName: "log" */ './log'),
  name: '日志管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/log/login',
  children: [...loginRoute, ...operateRoute, ...caseRoute, ...sectionRoute],
}];
