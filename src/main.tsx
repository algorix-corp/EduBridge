import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App.tsx';
import { DatesProvider } from '@mantine/dates';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <App />
        <Outlet />
      </>
    ),
  },
  {
    path: '/building',
    element: <></>,
  },
  {},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <DatesProvider settings={{ firstDayOfWeek: 0 }}>
        <RouterProvider router={router} />
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>,
);
