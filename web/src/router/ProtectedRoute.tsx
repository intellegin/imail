import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components/atoms'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, error } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingScreen className="h-48 w-48" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="text-destructive mb-4">{error.message}</p>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
