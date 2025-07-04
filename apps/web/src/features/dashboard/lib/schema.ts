import { z } from 'zod'

export const firstNameSchema = z
  .string()
  .min(2, 'First name must be at least 2 characters')
export const lastNameSchema = z
  .string()
  .min(2, 'Last name must be at least 2 characters')
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
export const roleSchema = z.string()

export const userFormSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  role: roleSchema,
})

export const userUpdateSchema = userFormSchema.partial()

export const userSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(100).default(30),
  skip: z.number().min(0).default(0),
})

export type UserFormData = z.infer<typeof userFormSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>
export type UserSearchData = z.infer<typeof userSearchSchema>
