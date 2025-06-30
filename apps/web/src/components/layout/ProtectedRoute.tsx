import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  const hasStoredAuth = localStorage.getItem('isAuthenticated') === 'true'

  if (isLoading) {
    if (hasStoredAuth) {
      return <>{children}</>
    }
    return null
  }
  if (!isAuthenticated && !hasStoredAuth) {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}
