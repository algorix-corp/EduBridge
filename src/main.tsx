import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import './index.css';
import {MantineProvider} from "@mantine/core";
import App from "./App.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <App/>
                <Outlet/>
            </>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <RouterProvider router={router}/>
        </MantineProvider>
    </React.StrictMode>
);
