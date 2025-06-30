import { useCallback } from 'react'

import { useAuth } from '../contexts/AuthContext'

import { apiRequest } from '@/lib/api/client'

export const useAuthenticatedApi = () => {
  const { getAccessTokenSilently } = useAuth()

  const authenticatedApiRequest = useCallback(
    async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
      const accessToken = await getAccessTokenSilently()
      return apiRequest<T>(endpoint, options, accessToken)
    },
    [getAccessTokenSilently]
  )

  return { authenticatedApiRequest }
}
