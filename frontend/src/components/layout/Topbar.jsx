import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardSummary } from '../../api/dashboardApi'
import { useFetch } from '../../hooks/useFetch'
import styles from './Topbar.module.css'

export default function Topbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Live alert count — reuses same endpoint as Dashboard
  const { data: summary } = useFetch(useCallback(() => getDashboardSummary(), []))
  const openCount = summary?.open ?? 0

  const PAGE_LABELS = {
    '/':          'Dashboard',
    '/logs':      'Logs',
    '/incidents': 'Incidents',
  }
  const currentPage = PAGE_LABELS[location.pathname] || 'Incident Detail'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleColor = {
    ADMIN:    'var(--critical)',
    ENGINEER: 'var(--brand)',
    VIEWER:   'var(--text-muted)',
  }[user?.role?.toUpperCase()] || 'var(--text-muted)'

  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle sidebar">☰</button>

      {/* Current page breadcrumb */}
      <span className={styles.pageCrumb}>{currentPage}</span>

      <div className={styles.spacer} />

      {/* Live open-incidents alert */}
      {openCount > 0 && (
        <button
          className={styles.alertBadge}
          onClick={() => navigate('/incidents')}
          title={`${openCount} open incident${openCount !== 1 ? 's' : ''}`}
        >
          🔴 <span>{openCount} open</span>
        </button>
      )}

      {/* User section */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{user?.username}</span>
          <span className={styles.role} style={{ color: roleColor }}>{user?.role}</span>
        </div>

        <div className={styles.avatarWrap}>
          <button
            className={styles.avatar}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            {user?.username?.[0]?.toUpperCase() || '?'}
          </button>

          {menuOpen && (
            <>
              <div className={styles.dropOverlay} onClick={() => setMenuOpen(false)} />
              <div className={styles.dropdown}>
                <div className={styles.dropHeader}>
                  <strong>{user?.username}</strong>
                  <span className={styles.dropRole} style={{ color: roleColor }}>{user?.role}</span>
                </div>
                <div className={styles.dropInfo}>
                  <span className={styles.dropInfoLabel}>Session</span>
                  <span className={styles.dropInfoVal}>JWT · 60 min</span>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  🚪 Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
