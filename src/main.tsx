import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Header } from './components/Header.tsx';
import { BuildingHeader } from './components/BuildingHeader.tsx';
import { CreateBuilding } from './components/CreateBuilding.tsx';
import { DatesProvider } from '@mantine/dates';
import { BuildingMain } from './components/BuildingMain.tsx';
import { Landing } from './pages/Landing.tsx';
import { RecoilRoot } from 'recoil';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Landing />
        <Outlet />
      </>
    ),
  },
  {
    path: '/building',
    element: (
      <>
        <BuildingHeader />
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
    ],
  },
  // {
  //   path: '/academy',
  //   element: (
  //     <>
  //       <AcademyHeader />
  //       <Outlet />
  //     </>
  //   ),
  //   children: [

  // },
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
