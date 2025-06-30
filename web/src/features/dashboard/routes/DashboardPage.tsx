import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { createColumns } from '../components/Columns'
import { UserForm } from '../components/UserForm'

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api, User, CreateUserData } from '@/lib/api'

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.getUsers()
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
  }, [])

  // Handle delete user
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
    toast.info(`Editing user: ${user.given_name} ${user.family_name}`, {
      description: `User ID: ${user.id}`,
      duration: 3000,
    })
  }

  const handleAddUser = async (userData: CreateUserData) => {
    setIsCreating(true)
    try {
      const newUser = await api.createUser(userData)
      setUsers(prev => [...prev, newUser])
      toast.success('User created successfully')
      setShowAddForm(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to create user: ${errorMessage}`)
    } finally {
      setIsCreating(false)
    }
  }

  const retryFetch = () => {
    setError(null)
    window.location.reload()
  }

  const columns = createColumns(handleEditUser, handleDeleteUser)

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
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button size="lg" className="font-semibold">
              + Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleAddUser}
              onCancel={() => setShowAddForm(false)}
              loading={isCreating}
            />
          </DialogContent>
        </Dialog>
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

      {/* Delete Confirmation Dialog */}
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
