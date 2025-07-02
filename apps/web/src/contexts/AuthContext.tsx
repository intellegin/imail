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
  requestStorageAccess: () => Promise<boolean>
  showPermissionAlert: boolean
  setShowPermissionAlert: (show: boolean) => void
  needsStorageAccess: boolean
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

const requestStorageAccessPermission = async (): Promise<boolean> => {
  if (!('requestStorageAccess' in document)) {
    console.log('🍪 Storage Access API not supported in this browser')
    return true
  }

  try {
    const hasAccess = await document.hasStorageAccess()
    if (hasAccess) {
      console.log('✅ Already have storage access')
      return true
    }

    console.log('🍪 Requesting storage access permission...')
    await document.requestStorageAccess()
    console.log('✅ Storage access granted!')
    return true
  } catch (error) {
    console.error('❌ Storage access denied or failed:', error)
    return false
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showPermissionAlert, setShowPermissionAlert] = useState(false)
  const [needsStorageAccess, setNeedsStorageAccess] = useState(false)
  const serverBaseUrl = import.meta.env.VITE_SERVER_BASE_URL ?? ''

  const requestStorageAccess = useCallback(async () => {
    return await requestStorageAccessPermission()
  }, [])

  useEffect(() => {
    const checkStorageAccess = async () => {
      if ('requestStorageAccess' in document) {
        try {
          const hasAccess = await document.hasStorageAccess()
          if (!hasAccess) {
            setNeedsStorageAccess(true)
          } else {
            setNeedsStorageAccess(false)
          }
        } catch (error) {
          console.warn('Could not check storage access:', error)
          setNeedsStorageAccess(false)
        }
      } else {
        setNeedsStorageAccess(false)
      }
    }

    checkStorageAccess()
  }, [isAuthenticated])

  useEffect(() => {
    const checkAuth = async () => {
      try {
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

        setIsAuthenticated(data.authenticated)
        setUser(data.user)

        if (data.authenticated && data.user) {
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
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
    window.location.href = `${serverBaseUrl}${API_ENDPOINTS.AUTH.LOGIN}`
  }, [serverBaseUrl])

  const logout = useCallback(async () => {
    try {
      await fetch(`${serverBaseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Failed to call logout API:', error)
    }

    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)

    window.location.href = `${serverBaseUrl}/logout`
  }, [serverBaseUrl])

  const getAccessTokenSilently = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
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
      requestStorageAccess,
      showPermissionAlert,
      setShowPermissionAlert,
      needsStorageAccess,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
      requestStorageAccess,
      showPermissionAlert,
      needsStorageAccess,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
