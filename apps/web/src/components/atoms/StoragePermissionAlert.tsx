import { useState, useEffect } from 'react'
import { Shield, X, Smartphone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface StoragePermissionAlertProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAllow: () => Promise<boolean>
  onDeny: () => void
  appName?: string
}

export const StoragePermissionAlert = ({
  isOpen,
  onOpenChange,
  onAllow,
  onDeny,
  appName = 'iMAIL',
}: StoragePermissionAlertProps) => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [showResult, setShowResult] = useState<'granted' | 'denied' | null>(
    null
  )

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsRequesting(false)
      setShowResult(null)
    }
  }, [isOpen])

  const handleAllow = async () => {
    setIsRequesting(true)

    try {
      const granted = await onAllow()
      setShowResult(granted ? 'granted' : 'denied')

      // Auto close after showing result
      setTimeout(() => {
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error('Permission request failed:', error)
      setShowResult('denied')
      setTimeout(() => {
        onOpenChange(false)
      }, 2000)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleDeny = () => {
    onDeny()
    onOpenChange(false)
  }

  const getContent = () => {
    if (showResult === 'granted') {
      return {
        title: 'Permission Granted',
        description:
          '✅ Third-party cookies have been enabled successfully. You can now sign in securely.',
        icon: <Shield className="h-12 w-12 text-green-500 mx-auto" />,
        showButtons: false,
      }
    }

    if (showResult === 'denied') {
      return {
        title: 'Permission Denied',
        description:
          '❌ Third-party cookies were not enabled. Sign-in may not work properly. You can try again later.',
        icon: <Shield className="h-12 w-12 text-red-500 mx-auto" />,
        showButtons: false,
      }
    }

    if (isRequesting) {
      return {
        title: 'Requesting Permission',
        description:
          'Please allow storage access in the browser popup that should appear...',
        icon: (
          <Shield className="h-12 w-12 text-blue-500 mx-auto animate-pulse" />
        ),
        showButtons: false,
      }
    }

    return {
      title: `"${appName}" Would Like to Access Cookies`,
      description:
        'This app needs to store authentication cookies to keep you signed in securely across browser sessions. Your data remains private and secure.',
      icon: <Shield className="h-12 w-12 text-blue-600 mx-auto" />,
      showButtons: true,
    }
  }

  const content = getContent()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">{content.icon}</div>

          <DialogTitle className="text-xl font-semibold">
            {content.title}
          </DialogTitle>

          <DialogDescription className="text-base leading-relaxed px-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        {content.showButtons && (
          <DialogFooter className="flex-col space-y-2 sm:flex-col">
            <Button
              onClick={handleAllow}
              disabled={isRequesting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Shield className="mr-2 h-4 w-4" />
              Allow
            </Button>

            <Button
              onClick={handleDeny}
              disabled={isRequesting}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Don't Allow
            </Button>
          </DialogFooter>
        )}

        {/* Close button for result states */}
        {!content.showButtons && !isRequesting && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              size="sm"
            >
              <X className="mr-1 h-3 w-3" />
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
