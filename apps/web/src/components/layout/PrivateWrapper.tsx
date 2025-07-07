import React, { useState } from 'react'

import { RoleBasedSidebar } from './RoleBasedSidebar'

import { useMediaQuery } from '@/hooks'
import { cn } from '@/lib/utils'

interface PrivateWrapperProps {
  children: React.ReactNode
  header?: string
}

const PrivateWrapper: React.FC<PrivateWrapperProps> = ({
  children,
  header,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar onCollapsedChange={setIsCollapsed} />
      <div
        className={cn(
          'flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out',
          !isMobile && (isCollapsed ? 'ml-20' : 'ml-64')
        )}
      >
        {header && (
          <h1 className="text-2xl font-bold tracking-tight p-4">{header}</h1>
        )}
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default PrivateWrapper
