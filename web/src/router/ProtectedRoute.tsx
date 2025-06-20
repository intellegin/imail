import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components/atoms'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingScreen className="h-48 w-48" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
