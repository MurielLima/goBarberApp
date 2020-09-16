import React from '../pages/ResetPassword/node_modules/react';
import { ToastProvider } from './toast';
import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
