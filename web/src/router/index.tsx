import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'

import { LoadingScreen } from '@/components/atoms'
import PrivateWrapper from '@/components/layout/PrivateWrapper'

const DashboardPage = lazy(
  () => import('@/features/dashboard/routes/DashboardPage')
)
const HelpPage = lazy(() => import('@/features/help/routes/HelpPage'))
const SettingsPage = lazy(
  () => import('@/features/settings/routes/SettingsPage')
)
const WelcomePage = lazy(() => import('@/features/public/routes/WelcomePage'))
const NotFoundPage = lazy(() => import('@/features/public/routes/NotFoundPage'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen className="h-48 w-48" />}>
    {children}
  </Suspense>
)

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SuspenseWrapper>
            <WelcomePage />
          </SuspenseWrapper>
        }
      />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <PrivateWrapper header="Users">
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateWrapper header="Users">
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateWrapper header="Settings">
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateWrapper header="Help">
              <SuspenseWrapper>
                <HelpPage />
              </SuspenseWrapper>
            </PrivateWrapper>
          }
        />
      </Route>
      {/* 404 Catch-all route */}
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
