import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'

import { API_ENDPOINTS } from '@/lib/constants/api'

interface AuthUser {
  name?: string
  email?: string
  picture?: string
  sub?: string
  [key: string]: unknown
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  loginWithRedirect: () => void
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

const hasSessionCookie = (): boolean => {
  const cookies = document.cookie.split(';')
  const sessionCookie = cookies.find(cookie =>
    cookie.trim().startsWith('imail-session=')
  )
  return !!sessionCookie && sessionCookie.split('=')[1]?.trim() !== ''
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const serverBaseUrl = import.meta.env.VITE_SERVER_BASE_URL ?? ''

  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== AuthContext: Checking authentication ===')

      // First check if session cookie exists
      const hasSession = hasSessionCookie()
      console.log('Session cookie present:', hasSession)

      if (!hasSession) {
        console.log('❌ No imail-session cookie found, user not authenticated')
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        setIsLoading(false)
        return
      }

      try {
        console.log('🔍 Validating session with backend...')
        const response = await fetch(
          `${serverBaseUrl}${API_ENDPOINTS.AUTH.VERIFY}`,
          {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(
            `Auth verification failed: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()
        console.log('Auth verification response:', {
          authenticated: data.authenticated,
          userPresent: !!data.user,
          userId: data.user?.id,
        })

        setIsAuthenticated(data.authenticated)
        setUser(data.user)

        if (data.authenticated && data.user) {
          console.log('✅ User authenticated, updating localStorage')
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          console.log('❌ Session invalid, clearing localStorage')
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('❌ Auth verification failed:', error)
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [serverBaseUrl])

  const loginWithRedirect = useCallback(() => {
    console.log('🔐 Redirecting to login...')
    window.location.href = `${serverBaseUrl}${API_ENDPOINTS.AUTH.LOGIN}`
  }, [serverBaseUrl])

  const logout = useCallback(async () => {
    console.log('🚪 Logging out...')
    try {
      await fetch(`${serverBaseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ Logout API called successfully')
    } catch (error) {
      console.error('❌ Failed to call logout API:', error)
    }

    // Clear local state and storage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)

    // Redirect to Auth0 logout
    console.log('🔄 Redirecting to Auth0 logout...')
    window.location.href = `${serverBaseUrl}/logout`
  }, [serverBaseUrl])

  const getAccessTokenSilently = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    // Check if session is still valid
    const hasSession = hasSessionCookie()
    if (!hasSession) {
      throw new Error('Session cookie not found')
    }

    return 'server-session-auth'
  }, [isAuthenticated])

  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
