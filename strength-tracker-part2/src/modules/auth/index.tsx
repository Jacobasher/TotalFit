import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import * as AuthService from './AuthService';

export const module = {
  name: 'auth',
  routes: [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> }
  ],
  dashboardWidgets: [],
  services: AuthService,
  components: { ProtectedRoute }
};

export default module;
