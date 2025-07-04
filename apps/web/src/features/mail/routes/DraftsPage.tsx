import { FileText, Plus } from 'lucide-react'
import React from 'react'
import { Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserProfile } from '@/hooks'

export default function DraftsPage() {
  const { isCoachOrStudent, isLoading } = useUserProfile()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isCoachOrStudent) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>
          <p className="text-muted-foreground">Manage your draft emails</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Draft
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Draft Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No drafts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You don&apos;t have any draft messages yet.
            </p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
