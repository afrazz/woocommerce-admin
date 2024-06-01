import React from 'react'

export const publicRoutes = [
    {
      key: 'public.login',
      path: `/public/login`,
      component: React.lazy(() =>
        import('pages/public/Login')
      ),
    },
  ]
  
  export const protectedRoutes = [
    {
      key: 'dashboard.orders',
      path: `/dashboards/orders`,
      component: React.lazy(() => import('pages/dashboard/Orders')),
    },
    {
      key: 'dashboard.orders',
      path: `/dashboards/orders/:id`,
      component: React.lazy(() => import('pages/dashboard/Orders/Details')),
    },
    {
      key: 'dashboard.default',
      path: `/dashboards/default`,
      component: React.lazy(() => import('pages/dashboard/Default')),
    },
   
  ]
  