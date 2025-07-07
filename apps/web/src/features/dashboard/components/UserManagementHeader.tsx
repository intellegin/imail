import { UserForm } from './UserForm'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { CreateUserData } from '@/lib/api'

interface UserManagementHeaderProps {
  showAddForm: boolean
  onShowAddFormChange: (show: boolean) => void
  onAddUser: (userData: CreateUserData) => Promise<void>
  onUpdateUser: (userData: CreateUserData) => Promise<void>
  isCreating: boolean
  roles: { id: string; name: string }[]
  editingUser?: {
    given_name?: string
    family_name?: string
    email?: string
    role_id?: string
    roles?: { id: string }[]
  }
  onCancel: () => void
}

export const UserManagementHeader = ({
  showAddForm,
  onShowAddFormChange,
  onAddUser,
  onUpdateUser,
  isCreating,
  roles,
  editingUser,
  onCancel,
}: UserManagementHeaderProps) => (
  <div className="flex items-center justify-between mb-4 w-full">
    <div>
      <p className="text-muted-foreground text-base">
        Manage your team members and their access to the dashboard.
      </p>
    </div>
    <Sheet
      open={showAddForm}
      onOpenChange={open => {
        onShowAddFormChange(open)
        if (!open) onCancel()
      }}
    >
      <SheetTrigger asChild>
        <Button size="lg" className="font-semibold">
          + Add User
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <UserForm
          onSubmit={editingUser ? onUpdateUser : onAddUser}
          onCancel={onCancel}
          loading={isCreating}
          roles={roles}
          user={editingUser}
          title={editingUser ? 'Edit User' : 'Add New User'}
        />
      </SheetContent>
    </Sheet>
  </div>
)
