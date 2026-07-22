import { useNavigate } from 'react-router-dom'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, accent, icon, to }) {
  const navigate = useNavigate()
  const isClickable = Boolean(to)

  return (
    <div
      className={`${styles.card} ${isClickable ? styles.clickable : ''}`}
      style={{ '--accent': accent }}
      onClick={isClickable ? () => navigate(to) : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && navigate(to) : undefined}
    >
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value ?? '—'}</div>
      <div className={styles.bar} />
    </div>
  )
}
