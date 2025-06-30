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
} from 'lucide-react'

export const primaryNavigation = [
  { name: 'Inbox', icon: Inbox, path: '/inbox', count: 128 },
  { name: 'Drafts', icon: FileText, path: '/drafts', count: 9 },
  { name: 'Sent', icon: Send, path: '/sent' },
  { name: 'Junk', icon: Archive, path: '/junk', count: 23 },
  { name: 'Trash', icon: Trash2, path: '/trash' },
  { name: 'Archive', icon: FolderOpen, path: '/archive' },
]

export const categoryNavigation = [
  { name: 'Social', icon: Users, path: '/social', count: 972 },
  { name: 'Updates', icon: Info, path: '/updates', count: 342 },
  { name: 'Forums', icon: MessageSquare, path: '/forums', count: 128 },
  { name: 'Shopping', icon: ShoppingCart, path: '/shopping', count: 8 },
  { name: 'Promotions', icon: Tag, path: '/promotions', count: 21 },
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
