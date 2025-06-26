import { LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface LoginButtonProps {
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

export const LoginButton = ({
  variant = 'default',
  size = 'default',
  className,
  children,
}: LoginButtonProps) => {
  const { loginWithRedirect } = useAuth()

  return (
    <Button
      onClick={loginWithRedirect}
      variant={variant}
      size={size}
      className={className}
    >
      <LogIn className="mr-2 h-4 w-4" />
      {children || 'Sign In'}
    </Button>
  )
}
