import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Header } from './components/Header.tsx';
import { CreateBuilding } from './components/Building/CreateBuilding.tsx';
import { DatesProvider } from '@mantine/dates';
import { BuildingMain } from './components/Building/BuildingMain.tsx';
import { Landing } from './pages/Landing.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { RecoilRoot } from 'recoil';
import { BuildingDetail } from './components/Building/BuildingDetail.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header type="transparent" />
        <Landing />
        <Outlet />
      </>
    ),
  },
  {
    path: '/building',
    element: (
      <>
        <Header type="white" />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '',
        element: <BuildingMain />,
      },
      {
        path: 'new',
        element: <CreateBuilding />,
      },
      {
        path: 'detail/:id',
        element: <BuildingDetail />,
      },
    ],
  },
  {
    path: '/academy',
    element: (
      <>
        <Header type="white" />
        <Outlet />
      </>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <DatesProvider settings={{ firstDayOfWeek: 0 }}>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </DatesProvider>
  </MantineProvider>,
);
