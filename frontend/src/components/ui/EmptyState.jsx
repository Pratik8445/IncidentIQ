import styles from './EmptyState.module.css'

export default function EmptyState({ title = 'No data found', message, icon = '📭' }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}
