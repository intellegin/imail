import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'

interface AuthRedirectProps {
  children: React.ReactNode
}

export const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (
    isAuthenticated &&
    (location.pathname === '/' || location.pathname === '/welcome')
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
