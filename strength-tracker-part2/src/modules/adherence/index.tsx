import AdherencePage from './AdherencePage';
import * as AdherenceService from './AdherenceService';

export const module = {
  routes: [ { path: '/adherence', element: <AdherencePage /> } ],
  dashboardWidgets: [],
  services: AdherenceService
};

export default module;
