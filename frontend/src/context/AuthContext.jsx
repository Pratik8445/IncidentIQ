import { createContext, useState, useEffect, useCallback } from 'react'
import { decodeToken, isTokenExpired } from '../utils/jwtDecode'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [user, setUser] = useState(null)

  // Derive user info from token on mount / token change
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
    const payload = decodeToken(token)
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem('access_token')
      setToken(null)
      setUser(null)
      return
    }
    setUser({
      username: payload.sub,
      role: payload.role,
    })
  }, [token])

  const login = useCallback((accessToken) => {
    localStorage.setItem('access_token', accessToken)
    setToken(accessToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
