import { useAuth0 } from '@auth0/auth0-react'
import { ChevronLeft, Menu } from 'lucide-react'
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
import { useMediaQuery } from '@/hooks'
import { primaryNavigation, secondaryNavigation } from '@/lib/navigation'
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

  const handleLogout = () => {
    clearStorage()
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <aside
      className={cn(
        'bg-card border-r flex flex-col justify-between transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between px-4 py-4 border-b">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">
              IMAILAPP
            </span>
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
        <nav className="flex-1 px-2 py-4">
          <div className="space-y-2">
            {primaryNavigation.map(({ name, icon: Icon, path }) => (
              <Tooltip key={name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'justify-start gap-2 w-full text-foreground rounded-none',
                        location.pathname === path &&
                          'bg-accent text-accent-foreground',
                        isCollapsed ? 'justify-center' : 'px-4'
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      {!isCollapsed && name}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{name}</TooltipContent>
                )}
              </Tooltip>
            ))}
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
                        'justify-start gap-2 w-full text-destructive rounded-none',
                        isCollapsed ? 'justify-center' : 'px-4'
                      )}
                      onClick={handleLogout}
                    >
                      <Icon className="h-6 w-6" />
                      {!isCollapsed && name}
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
                          'justify-start gap-2 w-full text-foreground rounded-none',
                          location.pathname === path &&
                            'bg-accent text-accent-foreground',
                          isCollapsed ? 'justify-center' : 'px-4'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        {!isCollapsed && name}
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

  const handleLogout = () => {
    clearStorage()
    logout({ logoutParams: { returnTo: window.location.origin + '/' } })
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-card border-b">
      <Link to="/" className="text-lg font-semibold text-foreground">
        IMAILAPP
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {primaryNavigation.map(item => (
            <Link to={item.path} key={item.name}>
              <DropdownMenuItem>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </DropdownMenuItem>
            </Link>
          ))}
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
        <main className="flex-1 w-full p-6 pt-10">
          {header && <div className="mb-6">{header}</div>}
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
      <main className="flex-1 w-full p-8 pt-14">
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
