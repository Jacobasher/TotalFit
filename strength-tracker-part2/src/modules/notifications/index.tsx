import NotificationsPage from './NotificationsPage';
import * as NotificationService from './NotificationService';

export const module = {
  routes: [ { path: '/notifications', element: <NotificationsPage /> } ],
  dashboardWidgets: [],
  services: NotificationService
};

export default module;
