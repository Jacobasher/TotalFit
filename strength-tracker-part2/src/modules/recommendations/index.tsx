import RecommendationsPage from './RecommendationsPage';
import * as RecommendationService from './RecommendationService';

export const module = {
  routes: [ { path: '/recommendations', element: <RecommendationsPage /> } ],
  dashboardWidgets: [],
  services: RecommendationService
};

export default module;
