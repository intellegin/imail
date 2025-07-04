import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { createColumns } from '../components/Columns'
import { UserForm } from '../components/UserForm'
import { fetchRoles } from '../lib/roles'

import { DataTable, LoadingScreen } from '@/components/atoms'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi'
import { api, User, CreateUserData } from '@/lib/api'
import type { UsersResponse } from '@/lib/types/user'
import { nullsToUndefined } from '@/lib/utils'

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])
  const isAdmin = true
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { authenticatedApiRequest } = useAuthenticatedApi()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await authenticatedApiRequest<UsersResponse>(
          '/users?limit=30&skip=0'
        )
        setUsers(response.users)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch users'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [authenticatedApiRequest])

  useEffect(() => {
    if (showAddForm) {
      fetchRoles()
        .then(setRoles)
        .catch(() => setRoles([]))
    }
  }, [showAddForm])

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await api.deleteUser(userToDelete.id)
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      toast.success(
        `User ${userToDelete.given_name} ${userToDelete.family_name} deleted successfully`
      )
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user'
      toast.error(errorMessage)
    } finally {
      setShowDeleteDialog(false)
      setUserToDelete(null)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowAddForm(true)
  }

  const handleAddUser = async (userData: CreateUserData) => {
    setIsCreating(true)
    try {
      const newUser = await api.createUser(userData)
      setUsers(prev => [...prev, newUser])
      toast.success('User created successfully')
      setShowAddForm(false)
      setEditingUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to create user: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateUser = async (userData: CreateUserData) => {
    setIsCreating(true)
    try {
      const updatedUser = await api.updateUser(editingUser!.id, userData)
      setUsers(prev =>
        prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
      )
      toast.success('User updated successfully')
      setShowAddForm(false)
      setEditingUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to update user: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const retryFetch = () => {
    setError(null)
    window.location.reload()
  }

  const columns = createColumns(
    isAdmin ? handleEditUser : undefined,
    isAdmin ? handleDeleteUser : undefined
  )

  if (error) {
    return (
      <div className="w-full mt-10 px-2 md:px-4 mx-auto">
        <Card className="border-destructive w-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Users
            </CardTitle>
            <CardDescription>
              There was a problem loading the user data. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={retryFetch} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full px-2 md:px-4 py-6">
      <div className="flex items-center justify-between mb-4 w-full">
        <div>
          <p className="text-muted-foreground text-base">
            Manage your team members and their access to the dashboard.
          </p>
        </div>
        <Sheet
          open={showAddForm}
          onOpenChange={open => {
            setShowAddForm(open)
            if (!open) setEditingUser(null)
          }}
        >
          <SheetTrigger asChild>
            <Button size="lg" className="font-semibold">
              + Add User
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <UserForm
              onSubmit={editingUser ? handleUpdateUser : handleAddUser}
              onCancel={() => {
                setShowAddForm(false)
                setEditingUser(null)
              }}
              loading={isCreating}
              roles={roles}
              user={editingUser
                ? (nullsToUndefined(editingUser) as {
                    given_name?: string
                    family_name?: string
                    email?: string
                    role_id?: string
                    roles?: { id: string }[]
                  })
                : undefined}
              title={editingUser ? 'Edit User' : 'Add New User'}
            />
          </SheetContent>
        </Sheet>
      </div>

      <Card className="w-full shadow-md rounded-xl bg-card">
        <CardContent className="px-5">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <LoadingScreen className="h-12 w-12" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              filterColumn="given_name"
              tableName="User"
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {userToDelete?.given_name} {userToDelete?.family_name}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardPage
