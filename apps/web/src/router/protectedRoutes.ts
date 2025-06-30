/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from 'react'

export const protectedPaths = ['/dashboard', '/settings', '/help']

export const protectedRouteComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  '/dashboard': lazy(() => import('@/features/dashboard/routes/DashboardPage')),
  '/settings': lazy(() => import('@/features/settings/routes/SettingsPage')),
  '/help': lazy(() => import('@/features/help/routes/HelpPage')),
}
