import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

import { protectedPaths } from '@/router/protectedRoutes'

export const RequireAuthRedirectProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()

  if (isLoading) return null // Optionally, render a loading spinner

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />
  }

  if (!isAuthenticated && protectedPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
