import { useAuth0 } from '@auth0/auth0-react'

import { Button } from '../ui/button'

import { clearStorage } from '@/lib/utils'

export const UserMenu = () => {
  const { user, logout } = useAuth0()

  const handleLogout = () => {
    clearStorage()
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  if (!user) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.name}</span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
