import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme'; 

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RootLayout from './layouts/RootLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: (<ProtectedRoute><DashboardPage /></ProtectedRoute>) },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'dashboard', element: (<ProtectedRoute><DashboardPage /></ProtectedRoute>) },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* 'Reseta' o CSS e aplica sua cor de fundo (background.default) */}
    <RouterProvider router={router} />
  </ThemeProvider>
);