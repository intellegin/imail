import { useState } from 'react'
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface StorageAccessButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showStatus?: boolean
}

export const StorageAccessButton = ({
  variant = 'outline',
  size = 'default',
  className,
  showStatus = true,
}: StorageAccessButtonProps) => {
  const { requestStorageAccess } = useAuth()
  const [status, setStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle')

  const handleRequestAccess = async () => {
    setStatus('requesting')

    try {
      const granted = await requestStorageAccess()
      setStatus(granted ? 'granted' : 'denied')

      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Storage access request failed:', error)
      setStatus('denied')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const getIcon = () => {
    switch (status) {
      case 'requesting':
        return <Shield className="mr-2 h-4 w-4 animate-pulse" />
      case 'granted':
        return <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
      case 'denied':
        return <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
      default:
        return <Shield className="mr-2 h-4 w-4" />
    }
  }

  const getText = () => {
    switch (status) {
      case 'requesting':
        return 'Requesting Permission...'
      case 'granted':
        return 'Access Granted!'
      case 'denied':
        return 'Access Denied'
      default:
        return 'Enable Third-Party Cookies'
    }
  }

  const getVariant = () => {
    switch (status) {
      case 'granted':
        return 'default'
      case 'denied':
        return 'destructive'
      default:
        return variant
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleRequestAccess}
        variant={getVariant()}
        size={size}
        className={className}
        disabled={status === 'requesting'}
      >
        {getIcon()}
        {getText()}
      </Button>

      {showStatus && status !== 'idle' && (
        <div className="text-sm text-muted-foreground text-center">
          {status === 'requesting' && (
            <p>Chrome will ask for permission to use cookies...</p>
          )}
          {status === 'granted' && (
            <p className="text-green-600">
              ✅ Third-party cookies enabled successfully!
            </p>
          )}
          {status === 'denied' && (
            <p className="text-red-600">
              ❌ Permission denied. Authentication may not work properly.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
