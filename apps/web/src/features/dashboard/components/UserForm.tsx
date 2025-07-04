import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  userFormSchema,
  type UserFormData as OrigUserFormData,
} from '../lib/schema'

import { Button } from '@/components/ui/button'
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
  roles: { id: string; name: string }[]
  user?: {
    given_name?: string
    family_name?: string
    email?: string
    role_id?: string
    roles?: { id: string }[]
  }
  title?: string
}

type UserFormData = Omit<OrigUserFormData, 'role'> & { role: string }

export const UserForm = ({
  onSubmit,
  onCancel,
  loading = false,
  roles,
  user,
  title = 'Add New User',
}: UserFormProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
          firstName: user.given_name || '',
          lastName: user.family_name || '',
          email: user.email || '',
          role:
            (user.roles && user.roles[0]?.id) ||
            user.role_id ||
            roles[0]?.id ||
            '',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          role: roles[0]?.id || '',
        },
  })

  const handleSubmit = async (data: UserFormData) => {
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
    <div className="flex flex-col h-full w-full px-8 py-8 bg-background border-l border-border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1">
          Enter the user information below to create a new account.
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 flex-1"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...form.register('firstName')}
              placeholder="John"
              className={
                form.formState.errors.firstName ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.firstName && (
              <span className="text-xs text-destructive">
                {form.formState.errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              placeholder="Doe"
              className={
                form.formState.errors.lastName ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.lastName && (
              <span className="text-xs text-destructive">
                {form.formState.errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="john.doe@example.com"
            className={form.formState.errors.email ? 'border-destructive' : ''}
          />
          {form.formState.errors.email && (
            <span className="text-xs text-destructive">
              {form.formState.errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={form.watch('role')}
            onValueChange={value => form.setValue('role', value)}
          >
            <SelectTrigger
              className={form.formState.errors.role ? 'border-destructive' : ''}
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.role && (
            <span className="text-xs text-destructive">
              {form.formState.errors.role.message}
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-auto">
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
    </div>
  )
}
