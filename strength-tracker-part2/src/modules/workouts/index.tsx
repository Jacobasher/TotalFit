import WorkoutPage from './WorkoutPage';
import * as WorkoutsService from './WorkoutService';

export const module = {
  routes: [ { path: '/workout', element: <WorkoutPage /> } ],
  dashboardWidgets: [],
  services: WorkoutsService
};

export default module;
