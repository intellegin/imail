import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: unknown
  loginWithRedirect: () => void
  logout: () => void
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
      try {
        const response = await fetch(`${serverBaseUrl}/api/auth/verify`, {
          credentials: 'include',
        })
        const data = await response.json()

        setIsAuthenticated(data.authenticated)
        setUser(data.user)

        if (data.authenticated && data.user) {
          console.log('✅ User authenticated, saving to localStorage')
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          console.log('❌ User not authenticated, clearing localStorage')
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
    window.location.href = `${serverBaseUrl}/login`
  }, [serverBaseUrl])

  const logout = useCallback(() => {
    console.log('🚪 Logging out, clearing localStorage')
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
