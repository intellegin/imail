import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { usersApi } from '@/lib/api/users'
import type { UserProfile } from '@/lib/types/user'

interface UseUserProfileResult {
  userProfile: UserProfile | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  hasRole: (roleName: string) => boolean
  isAdmin: boolean
  isCoachOrStudent: boolean
  roles: string[]
}

export const useUserProfile = (): UseUserProfileResult => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setUserProfile(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const accessToken = await getAccessTokenSilently()
      const response = await usersApi.getUserProfile(accessToken)

      if (response.success) {
        setUserProfile(response.data)
      } else {
        setError('Failed to fetch user profile')
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch user profile'
      )
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, getAccessTokenSilently])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!userProfile) return false
      return userProfile.roles.some(role => role.name === roleName)
    },
    [userProfile]
  )

  const roles = userProfile?.roles.map(role => role.name) || []
  const isAdmin = hasRole('Admin')
  const isCoachOrStudent = hasRole('Coach') || hasRole('Student')

  return {
    userProfile,
    isLoading,
    error,
    refetch: fetchUserProfile,
    hasRole,
    isAdmin,
    isCoachOrStudent,
    roles,
  }
}
