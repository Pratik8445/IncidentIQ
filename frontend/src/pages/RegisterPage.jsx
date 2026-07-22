import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'VIEWER',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await registerUser(form)

      if (!res.success) {
        setError(res.message || 'Registration failed.')
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Registration failed. Please try again.'
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
          <p className={styles.brandSub}>Create a new account</p>
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
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
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
              placeholder="Choose a password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="role">Role</label>
            <select
              id="role"
              className={styles.input}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="VIEWER">Viewer — read-only access</option>
              <option value="ENGINEER">Engineer — can ingest logs & analyze</option>
              <option value="ADMIN">Admin — full access</option>
            </select>
            <span className={styles.roleHint}>
              {form.role === 'VIEWER'   && 'Can view dashboards, logs, and incidents.'}
              {form.role === 'ENGINEER' && 'Can create logs, run AI analysis, and update incidents.'}
              {form.role === 'ADMIN'    && 'Full access to all features including user management.'}
            </span>
          </div>

          {error && <p className={styles.error} role="alert"><span className={styles.errorIcon}>⚠️</span>{error}</p>}
          {success && <p className={styles.success} role="status">✓ Account created! Redirecting…</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading || success}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
