import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { LoadingScreen } from '@/components/atoms'
import PrivateWrapper from '@/components/layout/PrivateWrapper'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

const DashboardPage = lazy(
  () => import('@/features/dashboard/routes/DashboardPage')
)
const HelpPage = lazy(() => import('@/features/help/routes/HelpPage'))
const SettingsPage = lazy(
  () => import('@/features/settings/routes/SettingsPage')
)
const WelcomePage = lazy(() => import('@/features/public/routes/WelcomePage'))
const NotFoundPage = lazy(() => import('@/features/public/routes/NotFoundPage'))
const InboxPage = lazy(() => import('@/features/inbox/routes/InboxPage'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen className="h-48 w-48" />}>
    {children}
  </Suspense>
)

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
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PrivateWrapper header="Dashboard">
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PrivateWrapper header="Users">
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PrivateWrapper header="Settings">
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <PrivateWrapper header="Help">
              <SuspenseWrapper>
                <HelpPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <PrivateWrapper>
              <SuspenseWrapper>
                <InboxPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />
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
