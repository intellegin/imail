import { Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useStoragePermission } from '@/hooks'

interface TriggerPermissionButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export const TriggerPermissionButton = ({
  variant = 'outline',
  size = 'sm',
  className,
  children,
}: TriggerPermissionButtonProps) => {
  const { triggerPermissionRequest, needsStorageAccess } =
    useStoragePermission()

  if (!needsStorageAccess) {
    return null
  }

  return (
    <Button
      onClick={triggerPermissionRequest}
      variant={variant}
      size={size}
      className={className}
    >
      <Settings className="mr-2 h-3 w-3" />
      {children || 'Cookie Settings'}
    </Button>
  )
}
