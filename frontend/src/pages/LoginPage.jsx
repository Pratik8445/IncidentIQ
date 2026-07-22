import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await loginUser(form)

      if (!res.success) {
        setError(res.message || 'Login failed.')
        return
      }

      const token = res.data?.access_token
      if (!token) {
        setError('No token received.')
        return
      }

      login(token)
      navigate('/')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚡</span>
          <h1 className={styles.brandName}>AI Operations Center</h1>
          <p className={styles.brandSub}>Sign in to your account</p>
          <div className={styles.features}>
            <span className={styles.featurePill}>🤖 Groq AI Analysis</span>
            <span className={styles.featurePill}>🚨 Incident Tracking</span>
            <span className={styles.featurePill}>📋 Log Ingestion</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              className={styles.input}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.error} role="alert"><span className={styles.errorIcon}>⚠️</span>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Register</Link>
        </p>
      </div>
    </div>
  )
}
