import StreaksPage from './StreaksPage';
import * as StreaksService from './StreaksService';

export const module = {
  routes: [ { path: '/streaks', element: <StreaksPage /> } ],
  dashboardWidgets: [],
  services: StreaksService
};

export default module;
