import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { Header } from './components/Header';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Header />
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '/hi',
        element: <div>hi</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
