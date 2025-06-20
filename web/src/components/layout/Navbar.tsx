import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

import { UserMenu } from '@/components/atoms/UserMenu'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
  const { isAuthenticated } = useAuth0()

  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          IMAILAPP
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/help">Help</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button asChild variant="default" size="sm">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
