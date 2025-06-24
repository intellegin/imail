import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

import { authConfig } from '../config/auth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { domain, clientId, redirectUri } = authConfig

  // Show a loading spinner if config is missing
  if (!domain || !clientId) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-destructive">
            Auth0 Configuration Error
          </h2>
          <p className="text-muted-foreground mb-2">
            Please make sure that <code>VITE_AUTH0_DOMAIN</code> and{' '}
            <code>VITE_AUTH0_CLIENT_ID</code> are set in your .env file.
          </p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    )
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthNotifier />
      {children}
    </Auth0Provider>
  )
}

function AuthNotifier() {
  const { isAuthenticated, error, isLoading, user } = useAuth0()
  const prevAuth = React.useRef(isAuthenticated)

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Authentication error')
    }
  }, [error])

  useEffect(() => {
    if (prevAuth.current === false && isAuthenticated && user) {
      toast.success(`Welcome, ${user.name || user.email || 'user'}!`)
    }
    if (prevAuth.current === true && !isAuthenticated && !isLoading) {
      toast.success('Logged out successfully')
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, isLoading, user])

  return null
}
