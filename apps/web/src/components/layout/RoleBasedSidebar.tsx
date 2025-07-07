import { ChevronLeft, LogOut, Menu, Shield } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthContext'
import { useMediaQuery } from '@/hooks'
import { useUserProfile } from '@/hooks'
import { getNavigationForRoles } from '@/lib/navigation'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  onCollapsedChange?: (collapsed: boolean) => void
}

interface NavigationItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  count?: number
}

interface NavigationProps {
  primary: NavigationItem[]
  category: NavigationItem[]
  secondary: NavigationItem[]
}

interface NavigationItemProps {
  item: NavigationItem
  isActive: boolean
  isCollapsed: boolean
  onClick?: () => void
}

interface LogoutButtonProps {
  isCollapsed: boolean
  onClick: () => void
}

interface DesktopSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  navigation: NavigationProps
  location: ReturnType<typeof useLocation>
  handleLogout: () => void
  roles: string[]
}

interface MobileTopBarProps {
  navigation: NavigationProps
  handleLogout: () => void
  roles: string[]
}

const NavigationItem = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}: NavigationItemProps) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>
      <Link to={item.path} onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            'w-full rounded-none justify-between gap-2 text-foreground group',
            isActive && 'bg-accent text-accent-foreground',
            'hover:bg-accent hover:text-accent-foreground',
            isCollapsed ? 'justify-center' : 'px-4'
          )}
        >
          <span className="flex items-center gap-2 px-2 group-hover:text-accent-foreground relative">
            <item.icon className="h-5 w-5" />
            {!isCollapsed && item.name}
          </span>
          {!isCollapsed && item.count && (
            <span className="ml-auto text-xs font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground">
              {item.count}
            </span>
          )}
        </Button>
      </Link>
    </TooltipTrigger>
    {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
  </Tooltip>
)

const LogoutButton = ({ isCollapsed, onClick }: LogoutButtonProps) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        className={cn(
          'w-full rounded-none justify-start gap-2 text-destructive',
          'hover:bg-destructive/10 hover:text-destructive',
          isCollapsed ? 'justify-center' : 'px-4'
        )}
        onClick={onClick}
      >
        <span className="flex items-center gap-2 px-2">
          <LogOut className="h-5 w-5" />
          {!isCollapsed && 'Logout'}
        </span>
      </Button>
    </TooltipTrigger>
    {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
  </Tooltip>
)

const DesktopSidebar = ({
  isCollapsed,
  onToggle,
  navigation,
  location,
  handleLogout,
  roles,
}: DesktopSidebarProps) => (
  <aside
    className={cn(
      'bg-card border-r flex flex-col justify-between transition-all duration-300 ease-in-out fixed top-0 left-0 h-screen z-30',
      isCollapsed ? 'w-20' : 'w-64'
    )}
  >
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 border-b h-12">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-foreground">iMAIL</span>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={onToggle}>
              {isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <ChevronLeft className="w-6 h-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? 'Expand' : 'Collapse'}
          </TooltipContent>
        </Tooltip>
      </header>

      <nav className="flex-1 py-4">
        <div className="space-y-4">
          {navigation.primary.map((item: NavigationItem) => (
            <NavigationItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
          {navigation.category.map((item: NavigationItem) => (
            <NavigationItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      <nav className="mt-auto flex flex-col space-y-2 pb-4">
        <div className="border-t pt-4">
          {navigation.secondary.map((item: NavigationItem) =>
            item.name === 'Logout' ? (
              <LogoutButton
                key={item.name}
                isCollapsed={isCollapsed}
                onClick={handleLogout}
              />
            ) : (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed}
              />
            )
          )}
        </div>
      </nav>
      <div className="border-t p-4 bg-muted/40">
        <div
          className={cn(
            'flex items-center gap-2 text-muted-foreground',
            isCollapsed && 'justify-center'
          )}
        >
          <Shield className="h-5 w-5" />
          {!isCollapsed && <span className="text-xs">{roles[0]}</span>}
        </div>
      </div>
    </div>
  </aside>
)

const MobileTopBar = ({
  navigation,
  handleLogout,
  roles,
}: MobileTopBarProps) => (
  <header className="sticky top-0 z-50 flex items-center justify-center px-0 py-2 bg-card border-b h-14">
    <div className="absolute left-2 top-1/2 -translate-y-1/2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 max-w-full">
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-6">
              <div className="space-y-4">
                {navigation.primary.map((item: NavigationItem) => (
                  <Link key={item.name} to={item.path} className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
                {navigation.category.map((item: NavigationItem) => (
                  <Link key={item.name} to={item.path} className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-auto border-t p-4 space-y-2">
              {navigation.secondary.map((item: NavigationItem) =>
                item.name === 'Logout' ? (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                ) : (
                  <Link key={item.name} to={item.path} className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              )}
              <div className="flex items-start p-4 border-t bg-muted/40 rounded-md">
                <Shield className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {roles.length > 0 ? roles[0] : 'No Role'}
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
      <Link
        to="/"
        className="text-lg font-semibold text-foreground pointer-events-auto"
      >
        iMAIL
      </Link>
    </div>
  </header>
)

export const RoleBasedSidebar: React.FC<SidebarProps> = ({
  onCollapsedChange,
}) => {
  const location = useLocation()
  const { userProfile, isLoading, roles } = useUserProfile()
  const { logout } = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isCollapsed, setIsCollapsed] = useState(true)

  const navigation = getNavigationForRoles(roles)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading || !userProfile) {
    return null
  }

  if (isMobile) {
    return (
      <MobileTopBar
        navigation={navigation}
        handleLogout={handleLogout}
        roles={roles}
      />
    )
  }

  const handleToggle = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

  return (
    <DesktopSidebar
      isCollapsed={isCollapsed}
      onToggle={handleToggle}
      navigation={navigation}
      location={location}
      handleLogout={handleLogout}
      roles={roles}
    />
  )
}
