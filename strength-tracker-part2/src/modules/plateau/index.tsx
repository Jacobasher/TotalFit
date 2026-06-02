import PlateauPage from './PlateauPage';
import * as PlateauService from './PlateauService';

export const module = {
  routes: [ { path: '/plateau', element: <PlateauPage /> } ],
  dashboardWidgets: [],
  services: PlateauService
};

export default module;
