import { UserMenu } from '@/components/atoms'

export const Navbar = () => {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">iMAIL</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
