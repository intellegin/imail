import { ROLE_CONFIGS, DEFAULT_ROLE_CONFIG, type RoleConfig } from './constants'

/**
 * Get the styling configuration for a given role name
 * @param roleName - The name of the role to get styling for
 * @returns RoleConfig object with styling classes
 */
export function getRoleConfig(roleName: string): RoleConfig {
  if (!roleName || roleName.trim() === '') {
    return (
      ROLE_CONFIGS.find((config: RoleConfig) =>
        config.pattern.toString().includes('no role')
      ) || DEFAULT_ROLE_CONFIG
    )
  }

  // Find matching configurations and sort by priority
  const matchingConfigs = ROLE_CONFIGS.filter((config: RoleConfig) => {
    if (config.pattern instanceof RegExp) {
      return config.pattern.test(roleName)
    }
    return roleName.toLowerCase().includes(config.pattern.toLowerCase())
  }).sort((a: RoleConfig, b: RoleConfig) => b.priority - a.priority)

  // Return the highest priority match, or default if no matches
  return matchingConfigs[0] || DEFAULT_ROLE_CONFIG
}

/**
 * Get the CSS classes for a role badge
 * @param roleName - The name of the role
 * @returns String of CSS classes for styling the role badge
 */
export function getRoleClasses(roleName: string): string {
  const config = getRoleConfig(roleName)
  return `px-2 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`
}

/**
 * Parse and process multiple roles from a comma-separated string
 * @param rolesString - Comma-separated string of roles
 * @returns Array of role objects with styling information
 */
export function parseRoles(rolesString: string): Array<{
  name: string
  config: RoleConfig
  classes: string
}> {
  if (!rolesString || rolesString.trim() === '') {
    const noRoleConfig = getRoleConfig('No Role')
    return [
      {
        name: 'No Role',
        config: noRoleConfig,
        classes: getRoleClasses('No Role'),
      },
    ]
  }

  return rolesString
    .split(',')
    .map(role => role.trim())
    .filter(role => role.length > 0)
    .map(role => ({
      name: role,
      config: getRoleConfig(role),
      classes: getRoleClasses(role),
    }))
}

/**
 * Check if a role has admin privileges
 * @param roleName - The name of the role to check
 * @returns boolean indicating if the role has admin privileges
 */
export function isAdminRole(roleName: string): boolean {
  const config = getRoleConfig(roleName)
  return config.name === 'Admin' || /admin/i.test(roleName)
}

/**
 * Get all available role configurations
 * @returns Array of all role configurations
 */
export function getAllRoleConfigs(): RoleConfig[] {
  return [...ROLE_CONFIGS]
}
