import React from 'react';
import GlobalStyle from './styles/global';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import { AuthProvider } from './hook/auth';
import { ToastProvider } from './hook/toast';
import AppProvider from './hook';
import Routes from './routes/';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppProvider>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
