/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from 'react'

export const protectedPaths = [
  '/dashboard',
  '/settings',
  '/help',
  '/users',
  '/inbox',
  '/drafts',
  '/sent',
  '/junk',
  '/trash',
  '/archive',
  '/social',
  '/updates',
  '/forums',
  '/shopping',
  '/promotions',
  '/agents',
]

export const protectedRouteComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  '/dashboard': lazy(() => import('@/features/dashboard/routes/DashboardPage')),
  '/agents': lazy(() => import('@/features/agents/routes/AgentsPage')),
  '/settings': lazy(() => import('@/features/settings/routes/SettingsPage')),
  '/help': lazy(() => import('@/features/help/routes/HelpPage')),
  '/users': lazy(() => import('@/features/dashboard/routes/DashboardPage')),
  '/inbox': lazy(() => import('@/features/inbox/routes/InboxPage')),
  '/drafts': lazy(() => import('@/features/mail/routes/DraftsPage')),
  '/sent': lazy(() => import('@/features/mail/routes/SentPage')),
  '/junk': lazy(() => import('@/features/mail/routes/JunkPage')),
  '/trash': lazy(() => import('@/features/mail/routes/TrashPage')),
  '/archive': lazy(() => import('@/features/mail/routes/ArchivePage')),
  '/social': lazy(() => import('@/features/mail/routes/SocialPage')),
  '/updates': lazy(() => import('@/features/mail/routes/UpdatesPage')),
  '/forums': lazy(() => import('@/features/mail/routes/ForumsPage')),
  '/shopping': lazy(() => import('@/features/mail/routes/ShoppingPage')),
  '/promotions': lazy(() => import('@/features/mail/routes/PromotionsPage')),
}
