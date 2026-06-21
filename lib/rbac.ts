import { db } from './db'
import { userRoles, rolePermissions, permissions, roles } from './db/schema'
import { eq, and } from 'drizzle-orm'

// Define role hierarchy
export enum RoleLevel {
  GUEST = 1,
  MEMBER = 2,
  VOLUNTEER_COORDINATOR = 3,
  CONTENT_MANAGER = 4,
  EVENT_MANAGER = 5,
  FINANCE_MANAGER = 6,
  ADMIN = 7,
  SUPER_ADMIN = 8,
}

export const ROLE_NAMES = {
  GUEST: 'Guest',
  MEMBER: 'Member',
  VOLUNTEER_COORDINATOR: 'Volunteer Coordinator',
  CONTENT_MANAGER: 'Content Manager',
  EVENT_MANAGER: 'Event Manager',
  FINANCE_MANAGER: 'Finance Manager',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}

// Default permission categories
export const PERMISSION_CATEGORIES = [
  'members',
  'events',
  'finance',
  'content',
  'admin',
  'reports',
  'settings',
]

// Default permissions by category
export const DEFAULT_PERMISSIONS = {
  members: [
    'members.view',
    'members.create',
    'members.edit',
    'members.delete',
    'members.export',
    'members.approve',
  ],
  events: [
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.manage_attendees',
    'events.check_in',
  ],
  finance: [
    'contributions.view',
    'contributions.create',
    'contributions.verify',
    'finance.reports',
    'finance.export',
  ],
  content: [
    'content.view',
    'content.create',
    'content.edit',
    'content.publish',
    'content.delete',
  ],
  admin: [
    'admin.users',
    'admin.roles',
    'admin.settings',
    'admin.security',
  ],
  reports: [
    'reports.view',
    'reports.generate',
    'reports.export',
  ],
  settings: [
    'settings.view',
    'settings.edit',
  ],
}

// Get user's roles
export async function getUserRoles(userId: string) {
  try {
    const userRoleRecords = await db
      .select({
        roleId: userRoles.role_id,
        roleName: roles.name,
        roleRank: roles.rank,
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.role_id, roles.id))
      .where(eq(userRoles.user_id, userId))

    return userRoleRecords
  } catch (error) {
    console.error('[v0] Error fetching user roles:', error)
    return []
  }
}

// Get user's permissions
export async function getUserPermissions(userId: string) {
  try {
    const userPermissions = await db
      .select({
        permissionName: permissions.name,
        permissionCategory: permissions.category,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.role_id, rolePermissions.role_id))
      .innerJoin(
        permissions,
        eq(rolePermissions.permission_id, permissions.id)
      )
      .where(eq(userRoles.user_id, userId))

    return userPermissions.map((p) => p.permissionName)
  } catch (error) {
    console.error('[v0] Error fetching user permissions:', error)
    return []
  }
}

// Check if user has permission
export async function hasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId)
    return userPermissions.includes(permission) || userPermissions.includes('*')
  } catch (error) {
    console.error('[v0] Error checking permission:', error)
    return false
  }
}

// Check if user has any of the permissions
export async function hasAnyPermission(
  userId: string,
  permissions: string[]
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId)
    return permissions.some(
      (p) => userPermissions.includes(p) || userPermissions.includes('*')
    )
  } catch (error) {
    console.error('[v0] Error checking any permission:', error)
    return false
  }
}

// Check if user has all permissions
export async function hasAllPermissions(
  userId: string,
  requiredPermissions: string[]
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId)
    const hasSuperPermission = userPermissions.includes('*')

    return (
      hasSuperPermission ||
      requiredPermissions.every((p) => userPermissions.includes(p))
    )
  } catch (error) {
    console.error('[v0] Error checking all permissions:', error)
    return false
  }
}

// Assign role to user
export async function assignRoleToUser(
  userId: string,
  roleId: number,
  assignedBy: string
) {
  try {
    const result = await db
      .insert(userRoles)
      .values({
        user_id: userId,
        role_id: roleId,
        assigned_by: assignedBy,
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error('[v0] Error assigning role:', error)
    throw error
  }
}

// Get highest role level for user (for hierarchy checking)
export async function getUserHighestRoleLevel(userId: string): Promise<number> {
  try {
    const userRoleRecords = await db
      .select({
        roleRank: roles.rank,
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.role_id, roles.id))
      .where(eq(userRoles.user_id, userId))

    if (userRoleRecords.length === 0) {
      return RoleLevel.GUEST
    }

    return Math.max(...userRoleRecords.map((r) => r.roleRank || 0))
  } catch (error) {
    console.error('[v0] Error getting user role level:', error)
    return RoleLevel.GUEST
  }
}

// Check if user is admin or above
export async function isAdmin(userId: string): Promise<boolean> {
  const level = await getUserHighestRoleLevel(userId)
  return level >= RoleLevel.ADMIN
}

// Check if user is super admin
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const level = await getUserHighestRoleLevel(userId)
  return level >= RoleLevel.SUPER_ADMIN
}

// Export all for easier access
export const RBAC = {
  getUserRoles,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  assignRoleToUser,
  getUserHighestRoleLevel,
  isAdmin,
  isSuperAdmin,
}
