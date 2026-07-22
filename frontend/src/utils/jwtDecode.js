/**
 * Decode a JWT payload without verifying signature.
 * Safe for client-side use — just reads the claims.
 */
export function decodeToken(token) {
  if (!token) return null
  try {
    const base64Payload = token.split('.')[1]
    const decoded = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Check if a decoded token is expired.
 */
export function isTokenExpired(payload) {
  if (!payload?.exp) return true
  return payload.exp * 1000 < Date.now()
}
