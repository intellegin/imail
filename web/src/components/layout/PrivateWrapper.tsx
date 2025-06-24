import { useAuth0 } from '@auth0/auth0-react'
import { ChevronLeft, Menu, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useNavigationNotificationCount } from '@/contexts/NavigationNotificationCountContext'
import { useMediaQuery } from '@/hooks'
import {
  primaryNavigation,
  secondaryNavigation,
  categoryNavigation,
} from '@/lib/navigation'
import { cn, clearStorage } from '@/lib/utils'

interface PrivateWrapperProps {
  children: React.ReactNode
  header?: React.ReactNode
}

const DesktopSidebar = ({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) => {
  const { logout } = useAuth0()
  const location = useLocation()
  const notificationCounts = useNavigationNotificationCount()

  const handleLogout = () => {
    clearStorage()
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <aside
      className={cn(
        'bg-card border-r flex flex-col justify-between transition-all duration-300 ease-in-out fixed top-0 left-0 h-screen z-30',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between px-4 py-4 border-b">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">iMAIL</span>
          )}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={onToggle}>
                {isCollapsed ? (
                  <Menu className="h-6 w-6" />
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
        {/* Side resize/collapse button */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 -right-2 z-20 -translate-y-1/2 bg-card border border-l border-border rounded-r-md shadow px-1 py-4 flex items-center justify-center hover:bg-accent transition-colors"
          style={{ width: '16px', height: '48px' }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
        <nav className="flex-1 py-4">
          <div className="space-y-4">
            {primaryNavigation.map(({ name, icon: Icon, path }) => {
              const key = name.toLowerCase() as keyof typeof notificationCounts
              const count = notificationCounts[key] ?? undefined
              return (
                <Tooltip key={name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          '!w-full !rounded-none justify-between gap-2 text-foreground group',
                          location.pathname === path &&
                            'bg-accent text-accent-foreground',
                          'hover:bg-accent hover:text-accent-foreground',
                          isCollapsed ? 'justify-center' : 'px-4'
                        )}
                      >
                        <span
                          className={cn(
                            'flex items-center gap-2 px-2 group-hover:text-accent-foreground relative'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {isCollapsed && count !== undefined && count > 0 && (
                            <span className="absolute -top-1 -right-0.5 w-2 h-2 font-bold bg-destructive p-0.75 border border-background !rounded-full" />
                          )}
                          {!isCollapsed && name}
                        </span>
                        {!isCollapsed && count !== undefined && count > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-muted px-2 py-0.5 rounded !text-muted-foreground">
                            {count}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{name}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
          <div className="my-4 border-t" />
          <div className="space-y-2">
            {categoryNavigation.map(({ name, icon: Icon, path }) => {
              const key = name.toLowerCase() as keyof typeof notificationCounts
              const count = notificationCounts[key] ?? undefined
              return (
                <Tooltip key={name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          '!w-full !rounded-none justify-between gap-2 text-foreground group',
                          location.pathname === path &&
                            'bg-accent text-accent-foreground',
                          'hover:bg-accent hover:text-accent-foreground',
                          isCollapsed ? 'justify-center' : 'px-4'
                        )}
                      >
                        <span
                          className={cn(
                            'flex items-center gap-2 px-2 group-hover:text-accent-foreground relative'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {isCollapsed && count !== undefined && count > 0 && (
                            <span className="absolute -top-1 -right-0.5 w-2 h-2 font-bold bg-destructive p-0.75 border border-background !rounded-full" />
                          )}
                          {!isCollapsed && name}
                        </span>
                        {!isCollapsed && count !== undefined && count > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-muted px-2 py-0.5 rounded !text-muted-foreground">
                            {count}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{name}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </nav>
        <nav className="mt-auto flex flex-col space-y-2 pb-4">
          <div className="border-t pt-4">
            {secondaryNavigation.map(({ name, icon: Icon, path }) =>
              name.toLowerCase() === 'logout' ? (
                <Tooltip key={name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        '!w-full !rounded-none justify-start gap-2 text-destructive',
                        'hover:bg-destructive/10 hover:text-destructive',
                        isCollapsed ? 'justify-center' : 'px-4'
                      )}
                      onClick={handleLogout}
                    >
                      <span className="flex items-center gap-2 px-2">
                        <Icon className="h-5 w-5" />
                        {!isCollapsed && name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{name}</TooltipContent>
                  )}
                </Tooltip>
              ) : (
                <Tooltip key={name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          '!w-full !rounded-none justify-start gap-2 text-foreground',
                          'hover:bg-accent hover:text-accent-foreground',
                          location.pathname === path &&
                            'bg-accent text-accent-foreground',
                          isCollapsed ? 'justify-center' : 'px-4'
                        )}
                      >
                        <span className="flex items-center gap-2 px-2 group-hover:text-accent-foreground">
                          <Icon className="h-5 w-5" />
                          {!isCollapsed && name}
                        </span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{name}</TooltipContent>
                  )}
                </Tooltip>
              )
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}

const MobileTopBar = () => {
  const { logout } = useAuth0()
  const notificationCounts = useNavigationNotificationCount()

  const handleLogout = () => {
    clearStorage()
    logout({ logoutParams: { returnTo: window.location.origin + '/' } })
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-center px-0 py-2 bg-card border-b relative h-14">
      {/* Menu Icon (left) */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {primaryNavigation.map(item => {
              const key =
                item.name.toLowerCase() as keyof typeof notificationCounts
              const count = notificationCounts[key] ?? undefined
              return (
                <Link to={item.path} key={item.name}>
                  <DropdownMenuItem className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </span>
                    {count !== undefined && count > 0 && (
                      <span className="ml-2 text-xs font-semibold bg-muted px-2 py-0.5 rounded !text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </DropdownMenuItem>
                </Link>
              )
            })}
            {/* Category navigation for mobile */}
            {categoryNavigation.map(item => {
              const key =
                item.name.toLowerCase() as keyof typeof notificationCounts
              const count = notificationCounts[key] ?? undefined
              return (
                <Link to={item.path} key={item.name}>
                  <DropdownMenuItem className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </span>
                    {count !== undefined && count > 0 && (
                      <span className="ml-2 text-xs font-semibold bg-muted px-2 py-0.5 rounded !text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </DropdownMenuItem>
                </Link>
              )
            })}
            <DropdownMenuSeparator />
            {secondaryNavigation.map(item =>
              item.name.toLowerCase() === 'logout' ? (
                <DropdownMenuItem
                  key={item.name}
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </DropdownMenuItem>
              ) : (
                <Link to={item.path} key={item.name}>
                  <DropdownMenuItem>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                </Link>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Centered App Name */}
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
}

const PrivateWrapper = ({ children, header }: PrivateWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <MobileTopBar />
        <main className="flex-1 w-full p-0 pt-0">
          {header && <div>{header}</div>}
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main
        className={cn(
          'flex-1 w-full p-4 overflow-auto',
          isCollapsed ? 'ml-20' : 'ml-64'
        )}
        style={{ height: '100vh' }}
      >
        {header && (
          <h1 className="text-2xl font-bold text-foreground px-4 -mb-5">
            {header}
          </h1>
        )}
        {children}
      </main>
    </div>
  )
}

export default PrivateWrapper
