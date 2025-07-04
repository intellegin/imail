import { Send } from 'lucide-react'
import React from 'react'
import { Navigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserProfile } from '@/hooks'

export default function SentPage() {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Sent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Send className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No sent messages</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your sent messages will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
