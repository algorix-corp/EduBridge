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
import { SignUp } from './components/Auth/SignUp.tsx';
import { SignIn } from './components/Auth/SignIn.tsx';
import { Toaster } from 'react-hot-toast';
import { AcademySelection } from './components/Academy/AcademySelection.tsx';

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
    children: [
      {
        path: '',
        element: <AcademySelection />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <>
        <Header type="white" />
        <Outlet />
      </>
    ),
    children: [
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
    ],
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
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </RecoilRoot>
    </DatesProvider>
  </MantineProvider>,
);
