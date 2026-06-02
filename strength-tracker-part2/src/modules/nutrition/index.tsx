import NutritionPage from './NutritionPage';
import * as NutritionService from './NutritionService';

export const module = {
  routes: [ { path: '/nutrition', element: <NutritionPage /> } ],
  dashboardWidgets: [],
  services: NutritionService
};

export default module;
