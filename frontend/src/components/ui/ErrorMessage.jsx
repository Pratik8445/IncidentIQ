import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert">
      <span className={styles.icon}>⚠️</span>
      <p className={styles.text}>{message || 'An error occurred.'}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
