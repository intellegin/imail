import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { protectedRouteComponents } from './protectedRoutes'

import { LoadingScreen } from '@/components/atoms'
import PrivateWrapper from '@/components/layout/PrivateWrapper'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

const WelcomePage = lazy(() => import('@/features/public/routes/WelcomePage'))
const NotFoundPage = lazy(() => import('@/features/public/routes/NotFoundPage'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen className="h-48 w-48" />}>
    {children}
  </Suspense>
)

// Route configurations
const routeConfig = [
  { path: '/', component: '/dashboard', header: 'Dashboard' },
  { path: '/dashboard', component: '/dashboard', header: 'Dashboard' },
  { path: '/users', component: '/users', header: 'User Management' },
  { path: '/inbox', component: '/inbox', header: 'Inbox' },
  { path: '/drafts', component: '/drafts', header: 'Drafts' },
  { path: '/sent', component: '/sent', header: 'Sent' },
  { path: '/junk', component: '/junk', header: 'Junk' },
  { path: '/trash', component: '/trash', header: 'Trash' },
  { path: '/archive', component: '/archive', header: 'Archive' },
  { path: '/social', component: '/social', header: 'Social' },
  { path: '/updates', component: '/updates', header: 'Updates' },
  { path: '/forums', component: '/forums', header: 'Forums' },
  { path: '/shopping', component: '/shopping', header: 'Shopping' },
  { path: '/promotions', component: '/promotions', header: 'Promotions' },
  { path: '/settings', component: '/settings', header: 'Settings' },
  { path: '/help', component: '/help', header: 'Help' },
]

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <SuspenseWrapper>
            <WelcomePage />
          </SuspenseWrapper>
        }
      />

      {/* Protected Routes */}
      {routeConfig.map(({ path, component, header }) => {
        const Component = protectedRouteComponents[component]

        return (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <PrivateWrapper header={header}>
                  <SuspenseWrapper>
                    <Component />
                  </SuspenseWrapper>
                </PrivateWrapper>
              </ProtectedRoute>
            }
          />
        )
      })}

      <Route
        path="*"
        element={
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        }
      />
    </Routes>
  )
}
