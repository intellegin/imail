import { Auth0Client, User } from '@auth0/auth0-spa-js'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'

import { usersApi } from '@/lib/api/users'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  roles: { success: boolean; data: { id: string; name: string }[] }
  loginWithRedirect: () => Promise<void>
  logout: () => Promise<void>
  getAccessTokenSilently: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

const auth0Client = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN ?? '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ?? '',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE ?? '',
    scope: 'openid profile email',
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
})

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          await auth0Client.handleRedirectCallback()
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
        }

        const authenticated = await auth0Client.isAuthenticated()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          const userData = await auth0Client.getUser()
          setUser(userData || null)

          try {
            const token = await auth0Client.getTokenSilently()
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

            await fetch(`${apiBaseUrl}/auth/verify`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })

            const rolesData = await usersApi.getRoles(token)
            setRoles(rolesData)
          } catch (error) {
            console.error('Failed to verify user with backend:', error)
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const loginWithRedirect = useCallback(async () => {
    localStorage.clear()

    await auth0Client.loginWithRedirect({
      authorizationParams: {
        prompt: 'select_account',
        max_age: 0,
      },
    })
  }, [])

  const logout = useCallback(async () => {
    setIsAuthenticated(false)
    setUser(null)
    setRoles([])
    localStorage.clear()
    await auth0Client.logout()
  }, [])

  const getAccessTokenSilently = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }
    return auth0Client.getTokenSilently()
  }, [isAuthenticated])

  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      roles,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      roles,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
