import React, { useState } from 'react'

import { RoleBasedSidebar } from './RoleBasedSidebar'
import AgentsPage from '@/features/agents/routes/AgentsPage'

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
  const [selectedTab, setSelectedTab] = useState<'Dashboard' | 'Agents'>(
    'Dashboard'
  )

  return (
    <div className="flex h-screen bg-background">
      {selectedTab === 'Dashboard' && (
        <RoleBasedSidebar onCollapsedChange={setIsCollapsed} />
      )}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out',
          !isMobile &&
            selectedTab === 'Dashboard' &&
            (isCollapsed ? 'ml-20' : 'ml-64')
        )}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="border-b bg-background px-6 pt-4 flex gap-2">
            <button
              className={cn(
                'px-4 py-2 rounded-t font-medium',
                selectedTab === 'Dashboard'
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setSelectedTab('Dashboard')}
            >
              Dashboard
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-t font-medium',
                selectedTab === 'Agents'
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setSelectedTab('Agents')}
            >
              Agents
            </button>
          </div>
          <div className="p-6">
            {selectedTab === 'Dashboard' ? (
              <>
                {header && (
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {header}
                    </h1>
                  </div>
                )}
                {children}
              </>
            ) : (
              <AgentsPage />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PrivateWrapper
