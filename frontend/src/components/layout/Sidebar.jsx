import { NavLink } from 'react-router-dom'
import { useCallback } from 'react'
import { getDashboardSummary } from '../../api/dashboardApi'
import { useFetch } from '../../hooks/useFetch'
import styles from './Sidebar.module.css'

export default function Sidebar({ isOpen, onClose }) {
  // Live badge counts from backend — same endpoint as Dashboard
  const { data: summary } = useFetch(useCallback(() => getDashboardSummary(), []))

  const openCount = summary?.open ?? null
  const totalCount = summary?.total_incidents ?? null

  const NAV_ITEMS = [
    { to: '/',          label: 'Dashboard',  icon: '⬡', badge: null },
    { to: '/logs',      label: 'Logs',       icon: '📋', badge: null },
    { to: '/incidents', label: 'Incidents',  icon: '🚨', badge: openCount },
  ]

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIconWrap}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoPulse} />
          </div>
          <div>
            <span className={styles.logoText}>AI Ops</span>
            <span className={styles.logoSub}>Operations Center</span>
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <span className={styles.linkIcon}>{icon}</span>
              <span className={styles.linkLabel}>{label}</span>
              {badge !== null && badge > 0 && (
                <span className={styles.badge}>{badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System status */}
        <div className={styles.statusBox}>
          <div className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Backend connected</span>
          </div>
          {totalCount !== null && (
            <div className={styles.statusStat}>
              {totalCount} total incident{totalCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.version}>v1.0.0</span>
        </div>
      </aside>
    </>
  )
}
