import GoalPage from './GoalPage';
import * as GoalService from './GoalService';

export const module = {
  routes: [ { path: '/goals', element: <GoalPage /> } ],
  dashboardWidgets: [],
  services: GoalService
};

export default module;
