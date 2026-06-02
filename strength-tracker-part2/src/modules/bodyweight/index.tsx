import BodyweightPage from './BodyweightPage';
import * as BodyweightService from './BodyweightService';

export const module = {
  routes: [ { path: '/bodyweight', element: <BodyweightPage /> } ],
  dashboardWidgets: [],
  services: BodyweightService
};

export default module;
