import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { userFormSchema, type UserFormData } from '../lib/schema'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateUserData } from '@/lib/api'

interface UserFormProps {
  onSubmit: (data: CreateUserData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export const UserForm = ({
  onSubmit,
  onCancel,
  loading = false,
}: UserFormProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
    },
  })

  const handleSubmit = async (data: UserFormData) => {
    // Add default values for required fields that are not in the form
    const submitData: CreateUserData = {
      ...data,
      phone: '+1 234 567 8900',
      username: `${data.firstName}${data.lastName}`.toLowerCase(),
      password: 'defaultPassword123',
    }
    await onSubmit(submitData)
    form.reset()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>
          Enter the user information below to create a new account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                placeholder="John"
                className={
                  form.formState.errors.firstName ? 'border-red-500' : ''
                }
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                placeholder="Doe"
                className={
                  form.formState.errors.lastName ? 'border-red-500' : ''
                }
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="john.doe@example.com"
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.watch('role')}
              onValueChange={value =>
                form.setValue('role', value as 'admin' | 'moderator' | 'user')
              }
            >
              <SelectTrigger
                className={form.formState.errors.role ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Loading...' : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
