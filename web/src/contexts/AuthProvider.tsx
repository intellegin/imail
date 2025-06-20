import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'

import { authConfig } from '../config/auth'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { domain, clientId, redirectUri } = authConfig

  if (!domain || !clientId) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Auth0 Configuration Error
            </CardTitle>
            <CardDescription>
              Please make sure that `VITE_AUTH0_DOMAIN` and
              `VITE_AUTH0_CLIENT_ID` are set in your .env file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This application requires Auth0 configuration to function
              properly.
            </p>
          </CardContent>
        </Card>
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
    >
      {children}
    </Auth0Provider>
  )
}
