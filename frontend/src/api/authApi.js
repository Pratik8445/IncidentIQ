import axios from 'axios'

// Login uses OAuth2PasswordRequestForm → application/x-www-form-urlencoded
export async function loginUser({ username, password }) {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)

  const response = await axios.post('/api/v1/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

// Register uses JSON body
export async function registerUser({ username, email, password, role }) {
  const response = await axios.post('/api/v1/auth/register', {
    username,
    email,
    password,
    role: role || 'VIEWER',
  })
  return response.data
}
