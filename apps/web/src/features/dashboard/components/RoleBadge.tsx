import { parseRoles, getRoleClasses } from '../lib/roles'

interface RoleBadgeProps {
  roles: string
  className?: string
}

/**
 * A reusable component for displaying user roles with proper styling
 * @param roles - Comma-separated string of role names
 * @param className - Optional additional CSS classes
 */
export function RoleBadge({ roles, className = '' }: RoleBadgeProps) {
  const roleData = parseRoles(roles)

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {roleData.map((role, index) => (
        <span key={index} className={role.classes}>
          {role.name}
        </span>
      ))}
    </div>
  )
}

/**
 * A single role badge component for individual role display
 * @param role - Single role name
 * @param className - Optional additional CSS classes
 */
export function SingleRoleBadge({
  role,
  className = '',
}: {
  role: string
  className?: string
}) {
  const classes = getRoleClasses(role)

  return <span className={`${classes} ${className}`}>{role}</span>
}

export default RoleBadge
