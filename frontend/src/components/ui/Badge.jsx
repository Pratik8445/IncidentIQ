import styles from './Badge.module.css'

const SEVERITY_MAP = {
  CRITICAL: 'critical',
  HIGH:     'high',
  MEDIUM:   'medium',
  LOW:      'low',
}

const STATUS_MAP = {
  OPEN:        'open',
  IN_PROGRESS: 'progress',
  RESOLVED:    'resolved',
  CLOSED:      'closed',
}

const LEVEL_MAP = {
  DEBUG:    'debug',
  INFO:     'info',
  WARNING:  'warning',
  ERROR:    'error',
  CRITICAL: 'critical',
}

export default function Badge({ value, type = 'severity' }) {
  const map = type === 'status' ? STATUS_MAP : type === 'level' ? LEVEL_MAP : SEVERITY_MAP
  const variant = map[value?.toUpperCase()] || 'default'
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {value}
    </span>
  )
}
