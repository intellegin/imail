export interface RoleConfig {
  name: string
  bgClass: string
  textClass: string
  pattern: string | RegExp
  priority: number
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    name: 'Admin',
    bgClass: 'bg-destructive',
    textClass: 'text-white',
    pattern: /admin/i,
    priority: 10,
  },
  {
    name: 'Coach',
    bgClass: 'bg-primary',
    textClass: 'text-primary-foreground',
    pattern: /coach/i,
    priority: 8,
  },
  {
    name: 'Student',
    bgClass: 'bg-accent',
    textClass: 'text-accent-foreground',
    pattern: /student/i,
    priority: 6,
  },
  {
    name: 'Moderator',
    bgClass: 'bg-secondary',
    textClass: 'text-secondary-foreground',
    pattern: /moderator|mod/i,
    priority: 7,
  },
  {
    name: 'No Role',
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    pattern: /^(no role|none|-)$/i,
    priority: 1,
  },
]

export const DEFAULT_ROLE_CONFIG: RoleConfig = {
  name: 'Unknown',
  bgClass: 'bg-secondary',
  textClass: 'text-secondary-foreground',
  pattern: '',
  priority: 0,
}
