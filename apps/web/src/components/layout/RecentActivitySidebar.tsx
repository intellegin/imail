import { Clock, GitBranch, GitCommitHorizontal } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface RecentActivitySidebarProps {
  mockHistory: Array<{
    date: string
    items: Array<{
      id: number
      title: string
      repo: string
      branch: string
      timeAgo: string
      diff: string
    }>
  }>
}

export function RecentActivitySidebar({
  mockHistory,
}: RecentActivitySidebarProps) {
  return (
    <aside className="w-80 min-w-[260px] max-w-xs border-r border-border bg-card/80 flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <GitCommitHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="uppercase text-xs font-semibold tracking-wider text-muted-foreground">
          Recent Activity
        </span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-hidden">
        {mockHistory.map((history, idx) => (
          <div key={history.date}>
            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider px-2">
              {history.date}
            </div>
            <div className="flex flex-col gap-2">
              {history.items.map(item => (
                <Card
                  key={item.id}
                  className="bg-card border border-border rounded-lg transition-shadow hover:shadow-md cursor-pointer"
                >
                  <CardContent className="flex items-center px-4 py-3 gap-2">
                    <span className="text-green-500 mr-2">&#10003;</span>
                    <span className="font-medium flex-1 truncate">
                      {item.title}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mx-2">
                      <Clock className="w-3 h-3" /> {item.timeAgo}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mx-2">
                      <GitBranch className="w-3 h-3" /> {item.repo} ={' '}
                      {item.branch}
                    </span>
                    <span className="text-green-500 font-mono ml-2">
                      {item.diff}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            {idx < mockHistory.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </nav>
    </aside>
  )
}
