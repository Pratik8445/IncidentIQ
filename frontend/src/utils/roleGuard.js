/**
 * Returns true if the user's role is in the allowed list.
 * Handles case-insensitive comparison (backend sometimes stores 'viewer' vs 'VIEWER').
 */
export function hasRole(userRole, allowedRoles) {
  if (!userRole || !allowedRoles?.length) return false
  return allowedRoles.some(
    (r) => r.toUpperCase() === userRole.toUpperCase()
  )
}

export const ROLES = {
  ADMIN: 'ADMIN',
  ENGINEER: 'ENGINEER',
  VIEWER: 'VIEWER',
}

export const WRITE_ROLES = [ROLES.ADMIN, ROLES.ENGINEER]
export const ALL_ROLES = [ROLES.ADMIN, ROLES.ENGINEER, ROLES.VIEWER]
