import { useState, useCallback } from 'react'
import { getIncidents } from '../api/incidentsApi'
import { useFetch } from '../hooks/useFetch'
import IncidentTable from '../components/incidents/IncidentTable'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import EmptyState from '../components/ui/EmptyState'
import styles from './IncidentsPage.module.css'

const PAGE_SIZE = 20

const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const STATUS_FILTERS   = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const SEVERITY_COLORS = {
  CRITICAL: 'var(--critical)',
  HIGH:     'var(--high)',
  MEDIUM:   'var(--medium)',
  LOW:      'var(--low)',
}
const STATUS_COLORS = {
  OPEN:        'var(--status-open)',
  IN_PROGRESS: 'var(--status-progress)',
  RESOLVED:    'var(--status-resolved)',
  CLOSED:      'var(--status-closed)',
}

export default function IncidentsPage() {
  const [offset, setOffset]           = useState(0)
  const [severityFilter, setSeverity] = useState('ALL')
  const [statusFilter, setStatus]     = useState('ALL')

  const { data, loading, error, refetch } = useFetch(
    useCallback(() => getIncidents(PAGE_SIZE, offset), [offset])
  )

  const allIncidents = data?.data ?? []

  // Client-side filter — backend pagination already loads up to 20
  const incidents = allIncidents.filter((inc) => {
    const sevOk = severityFilter === 'ALL' || inc.severity === severityFilter
    const stOk  = statusFilter   === 'ALL' || inc.status   === statusFilter
    return sevOk && stOk
  })

  // Count badges per filter value
  const severityCounts = allIncidents.reduce((a, i) => { a[i.severity] = (a[i.severity]||0)+1; return a }, {})
  const statusCounts   = allIncidents.reduce((a, i) => { a[i.status]   = (a[i.status]  ||0)+1; return a }, {})

  function resetFilters() {
    setSeverity('ALL')
    setStatus('ALL')
    setOffset(0)
  }

  const filtersActive = severityFilter !== 'ALL' || statusFilter !== 'ALL'

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Incidents</h1>
          <p className={styles.sub}>
            {allIncidents.length > 0
              ? `${allIncidents.length} incident${allIncidents.length !== 1 ? 's' : ''} · showing ${incidents.length} after filters`
              : 'AI-analyzed incidents from your infrastructure'}
          </p>
        </div>
        <div className={styles.headerRight}>
          {filtersActive && (
            <button className={styles.clearBtn} onClick={resetFilters}>
              ✕ Clear filters
            </button>
          )}
          <button className={styles.refreshBtn} onClick={refetch} disabled={loading}>
            {loading ? '⏳' : '↻'} Refresh
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {allIncidents.length > 0 && (
        <div className={styles.filterSection}>
          {/* Severity */}
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Severity</span>
            <div className={styles.filterRow}>
              {SEVERITY_FILTERS.map((s) => {
                const count = s === 'ALL' ? allIncidents.length : (severityCounts[s] || 0)
                return (
                  <button
                    key={s}
                    className={`${styles.filterPill} ${severityFilter === s ? styles.pillActive : ''}`}
                    style={severityFilter === s && s !== 'ALL' ? { '--pill-color': SEVERITY_COLORS[s] } : {}}
                    onClick={() => { setSeverity(s); setOffset(0) }}
                  >
                    {s === 'ALL' ? 'All' : s}
                    {count > 0 && <span className={styles.pillCount}>{count}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Status</span>
            <div className={styles.filterRow}>
              {STATUS_FILTERS.map((s) => {
                const count = s === 'ALL' ? allIncidents.length : (statusCounts[s] || 0)
                return (
                  <button
                    key={s}
                    className={`${styles.filterPill} ${statusFilter === s ? styles.pillActive : ''}`}
                    style={statusFilter === s && s !== 'ALL' ? { '--pill-color': STATUS_COLORS[s] } : {}}
                    onClick={() => { setStatus(s); setOffset(0) }}
                  >
                    {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                    {count > 0 && <span className={styles.pillCount}>{count}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && allIncidents.length === 0 && (
        <EmptyState
          title="No incidents yet"
          message="Run an AI analysis from the Logs page to generate your first incident."
          icon="🚨"
        />
      )}

      {!loading && allIncidents.length > 0 && incidents.length === 0 && (
        <EmptyState
          title="No matching incidents"
          message="Try adjusting your severity or status filters."
          icon="🔍"
        />
      )}

      {!loading && incidents.length > 0 && (
        <IncidentTable incidents={incidents} onRefetch={refetch} />
      )}

      {/* Pagination */}
      {!loading && allIncidents.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={offset === 0}
            onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}
          >
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {Math.floor(offset / PAGE_SIZE) + 1}
          </span>
          <button
            className={styles.pageBtn}
            disabled={allIncidents.length < PAGE_SIZE}
            onClick={() => setOffset((p) => p + PAGE_SIZE)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
