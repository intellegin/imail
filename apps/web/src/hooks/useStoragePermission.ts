import { useCallback } from 'react'

import { useAuth } from '@/contexts/AuthContext'

export const useStoragePermission = () => {
  const {
    showPermissionAlert,
    setShowPermissionAlert,
    requestStorageAccess,
    needsStorageAccess,
  } = useAuth()

  const triggerPermissionRequest = useCallback(() => {
    if (needsStorageAccess) {
      setShowPermissionAlert(true)
    }
  }, [needsStorageAccess, setShowPermissionAlert])

  const handlePermissionAllow = useCallback(async () => {
    const granted = await requestStorageAccess()
    if (granted) {
      console.log('✅ Storage permission granted by user')
    } else {
      console.log('❌ Storage permission denied by user')
    }
    return granted
  }, [requestStorageAccess])

  const handlePermissionDeny = useCallback(() => {
    console.log('🚫 User chose not to enable storage access')
    localStorage.setItem('storage-permission-denied', 'true')
  }, [])

  return {
    showPermissionAlert,
    setShowPermissionAlert,
    needsStorageAccess,
    triggerPermissionRequest,
    handlePermissionAllow,
    handlePermissionDeny,
  }
}
