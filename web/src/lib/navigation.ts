import { Settings, LogOut, CircleHelp, LayoutDashboard } from 'lucide-react'

export const primaryNavigation = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
]

export const secondaryNavigation = [
  {
    name: 'Help',
    icon: CircleHelp,
    path: '/help',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
  {
    name: 'Logout',
    icon: LogOut,
    path: '/',
  },
]
