import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

import {
  createColumns,
  DeleteUserDialog,
  ErrorCard,
  UserManagementHeader,
} from '../components'
import { fetchRoles } from '../lib/roles'

import { DataTable, LoadingScreen } from '@/components/atoms'
import { Card, CardContent } from '@/components/ui/card'
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
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { authenticatedApiRequest } = useAuthenticatedApi()
  const isAdmin = true

  const fetchUsers = useCallback(async () => {
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
  }, [authenticatedApiRequest])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (showAddForm) {
      fetchRoles()
        .then(setRoles)
        .catch(() => setRoles([]))
    }
  }, [showAddForm])

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }, [])

  const confirmDelete = useCallback(async () => {
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
  }, [userToDelete])

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user)
    setShowAddForm(true)
  }, [])

  const handleAddUser = useCallback(async (userData: CreateUserData) => {
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
  }, [])

  const handleUpdateUser = useCallback(
    async (userData: CreateUserData) => {
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
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error'
        toast.error(`Failed to update user: ${errorMessage}`)
      } finally {
        setIsCreating(false)
      }
    },
    [editingUser]
  )

  const handleCancel = useCallback(() => {
    setShowAddForm(false)
    setEditingUser(null)
  }, [])

  const retryFetch = useCallback(() => {
    setError(null)
    window.location.reload()
  }, [])

  const columns = createColumns(
    isAdmin ? handleEditUser : undefined,
    isAdmin ? handleDeleteUser : undefined
  )

  if (error) {
    return (
      <ErrorCard
        title="Error Loading Users"
        description="There was a problem loading the user data. Please try again."
        error={error}
        onRetry={retryFetch}
      />
    )
  }

  return (
    <div className="w-full px-2 md:px-4 py-6">
      <UserManagementHeader
        showAddForm={showAddForm}
        onShowAddFormChange={setShowAddForm}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        isCreating={isCreating}
        roles={roles}
        editingUser={
          editingUser
            ? (nullsToUndefined(editingUser) as {
                given_name?: string
                family_name?: string
                email?: string
                role_id?: string
                roles?: { id: string }[]
              })
            : undefined
        }
        onCancel={handleCancel}
      />

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

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        user={userToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default DashboardPage
