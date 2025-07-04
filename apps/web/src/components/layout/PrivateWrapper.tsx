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
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out',
          !isMobile && (isCollapsed ? 'ml-20' : 'ml-64')
        )}
      >
        <RoleBasedSidebar onCollapsedChange={setIsCollapsed} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {header && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">{header}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PrivateWrapper
