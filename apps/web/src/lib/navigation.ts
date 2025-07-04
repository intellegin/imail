import {
  Settings,
  LogOut,
  CircleHelp,
  FileText,
  Send,
  Archive,
  Trash2,
  FolderOpen,
  Users,
  Info,
  MessageSquare,
  ShoppingCart,
  Tag,
  Inbox,
  Home,
} from 'lucide-react'
import type { SVGProps } from 'react'

import type { RoleName } from './types/user'

export interface NavigationItem {
  name: string
  icon: React.ComponentType<SVGProps<SVGSVGElement>>
  path: string
  count?: number
  parent?: string
}

export const adminNavigation: NavigationItem[] = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Users', icon: Users, path: '/users' },
]

export const userNavigation: NavigationItem[] = [
  { name: 'Inbox', icon: Inbox, path: '/inbox', count: 128 },
  { name: 'Drafts', icon: FileText, path: '/drafts', count: 9 },
  { name: 'Sent', icon: Send, path: '/sent' },
  { name: 'Junk', icon: Archive, path: '/junk', count: 23 },
  { name: 'Trash', icon: Trash2, path: '/trash' },
  { name: 'Archive', icon: FolderOpen, path: '/archive' },
]

export const categoryNavigation: NavigationItem[] = [
  { name: 'Social', icon: Users, path: '/social', count: 972 },
  { name: 'Updates', icon: Info, path: '/updates', count: 342 },
  { name: 'Forums', icon: MessageSquare, path: '/forums', count: 128 },
  { name: 'Shopping', icon: ShoppingCart, path: '/shopping', count: 8 },
  { name: 'Promotions', icon: Tag, path: '/promotions', count: 21 },
]

export const secondaryNavigation: NavigationItem[] = [
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
    parent: 'Settings',
  },
]

export const getNavigationForRoles = (
  roles: string[]
): {
  primary: NavigationItem[]
  category: NavigationItem[]
  secondary: NavigationItem[]
} => {
  const isAdmin = roles.some(role => role === 'Admin')

  if (isAdmin) {
    return {
      primary: adminNavigation,
      category: [],
      secondary: secondaryNavigation,
    }
  }

  return {
    primary: userNavigation,
    category: categoryNavigation,
    secondary: secondaryNavigation,
  }
}

export const hasRole = (roles: string[], roleName: RoleName): boolean => {
  return roles.includes(roleName)
}

export const isAdmin = (roles: string[]): boolean => {
  return hasRole(roles, 'Admin')
}

export const isCoachOrStudent = (roles: string[]): boolean => {
  return hasRole(roles, 'Coach') || hasRole(roles, 'Student')
}

export const primaryNavigation = userNavigation
