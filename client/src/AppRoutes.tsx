// React & Routing Libraries
import { createBrowserRouter, Navigate } from "react-router-dom";

// Route Configs
import {
  PUBLIC_ROUTES,
  ADMIN_ROUTES,
  COMMON_ROUTES,
  ROOT_ROUTE,
} from "@/config/routes.config";

// Pages
import {
  LoginPage,
  NotFound
} from "@/pages";

// Layouts
import { MainLayout, DashboardLayoutWrapper, AuthLayout } from "@/layouts";

// Route Guards
import { PrivateRoute, PublicRoute } from "@/routes";


const appRouter = createBrowserRouter([
  {
    path: ROOT_ROUTE,
    element: <MainLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: PUBLIC_ROUTES.LOGIN,
                element: <LoginPage />,
              },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute />,

        children: [
          {
            index: true,
            element: <Navigate to={ADMIN_ROUTES.DASHBOARD} replace />,
          },
          {
            element: <DashboardLayoutWrapper />,
            children: [
             
            ],
          },
          // Common authenticated routes

          // 404 route
          {
            path: COMMON_ROUTES.NOT_FOUND,
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default appRouter;
