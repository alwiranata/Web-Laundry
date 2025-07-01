import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { PrivateRoute } from './private/PrivateRoute';

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const Profile = lazy(() => import('src/pages/profile'))
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Register = lazy(() => import('src/pages/register'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const MyOrderPage = lazy(() => import('src/pages/myOrder'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        path: 'beranda',
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'Data-admin',
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'data-transaksi',
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'transaksi',
        element: (
          <PrivateRoute>
            <MyOrderPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    index: true,
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: 'login',
    element: (

      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'profile',
    element: (
      <PrivateRoute>
        <AuthLayout>
          <Profile />
        </AuthLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Page404 />,
  },
];
