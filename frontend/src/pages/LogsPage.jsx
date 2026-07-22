import { useState, useCallback } from 'react'
import { getLogs, analyzeIncident } from '../api/logsApi'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { hasRole, WRITE_ROLES } from '../utils/roleGuard'
import LogTable from '../components/logs/LogTable'
import LogForm from '../components/logs/LogForm'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import EmptyState from '../components/ui/EmptyState'
import AiReportModal from '../components/incidents/AiReportModal'
import styles from './LogsPage.module.css'

const LEVELS = ['ALL', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']

const LEVEL_COLORS = {
  DEBUG:    'var(--level-debug)',
  INFO:     'var(--level-info)',
  WARNING:  'var(--level-warning)',
  ERROR:    'var(--level-error)',
  CRITICAL: 'var(--level-critical)',
}

export default function LogsPage() {
  const { user } = useAuth()
  const canWrite = hasRole(user?.role, WRITE_ROLES)

  const [showForm, setShowForm] = useState(false)
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  const { data, loading, error, refetch } = useFetch(
    useCallback(() => getLogs(), [])
  )

  const allLogs = data?.data ?? []

  // Filter client-side — backend supports it too but this avoids extra requests
  const logs = levelFilter === 'ALL'
    ? allLogs
    : allLogs.filter((l) => l.level === levelFilter)

  // Level counts for filter badges
  const levelCounts = allLogs.reduce((acc, l) => {
    acc[l.level] = (acc[l.level] || 0) + 1
    return acc
  }, {})

  async function handleAnalyze() {
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      const res = await analyzeIncident()
      setAnalysisResult(res?.data)
    } catch (err) {
      setAnalyzeError(
        err?.response?.data?.message || 'Failed to run incident analysis.'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Logs</h1>
          <p className={styles.sub}>
            {allLogs.length > 0
              ? `${allLogs.length} entries ingested across all services`
              : 'Ingested log entries from all services'}
          </p>
        </div>
        <div className={styles.actions}>
          {canWrite && (
            <>
              <button className={styles.analyzeBtn} onClick={handleAnalyze} disabled={analyzing || allLogs.length === 0}>
                {analyzing ? '⏳ Analyzing…' : '🤖 Run AI Analysis'}
              </button>
              <button className={styles.addBtn} onClick={() => setShowForm((v) => !v)}>
                {showForm ? '✕ Cancel' : '+ Add Log'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Level filter tabs */}
      {allLogs.length > 0 && (
        <div className={styles.filterBar}>
          {LEVELS.map((lvl) => {
            const count = lvl === 'ALL' ? allLogs.length : (levelCounts[lvl] || 0)
            return (
              <button
                key={lvl}
                className={`${styles.filterBtn} ${levelFilter === lvl ? styles.filterActive : ''}`}
                style={levelFilter === lvl && lvl !== 'ALL' ? { '--lvl-color': LEVEL_COLORS[lvl] } : {}}
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl}
                {count > 0 && <span className={styles.filterCount}>{count}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Analyze error */}
      {analyzeError && <ErrorMessage message={analyzeError} onRetry={handleAnalyze} />}

      {/* Analysis result banner */}
      {analysisResult && (
        <div className={styles.analysisBanner}>
          <div className={styles.bannerLeft}>
            <span className={styles.bannerIcon}>✅</span>
            <div>
              <strong>Incident #{analysisResult.incident_id} created</strong>
              <span className={styles.bannerSub}>
                {' '}· Severity: <strong style={{ color: analysisResult.analysis?.severity === 'CRITICAL' ? 'var(--critical)' : analysisResult.analysis?.severity === 'HIGH' ? 'var(--high)' : 'var(--medium)' }}>{analysisResult.analysis?.severity}</strong>
                {' '}· {analysisResult.analysis?.total_logs} logs analyzed
                {' '}· Top service: {analysisResult.analysis?.top_failing_service}
              </span>
            </div>
          </div>
          <div className={styles.bannerActions}>
            <button className={styles.viewReportBtn} onClick={() => setAnalysisResult({ ...analysisResult, _show: true })}>
              View AI Report
            </button>
            <button className={styles.bannerClose} onClick={() => setAnalysisResult(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Log form */}
      {showForm && canWrite && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Log Entry</h2>
          <LogForm onSuccess={() => { setShowForm(false); refetch() }} />
        </div>
      )}

      {/* Logs table */}
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && allLogs.length === 0 && (
        <EmptyState title="No logs yet" message="Use the Add Log button to ingest your first log entry." icon="📋" />
      )}
      {!loading && allLogs.length > 0 && logs.length === 0 && (
        <EmptyState title={`No ${levelFilter} logs`} message="Try a different filter level." icon="🔍" />
      )}
      {!loading && logs.length > 0 && <LogTable logs={logs} />}

      {/* AI report modal */}
      {analysisResult?._show && (
        <AiReportModal
          report={analysisResult.ai_report}
          onClose={() => setAnalysisResult((prev) => ({ ...prev, _show: false }))}
        />
      )}
    </div>
  )
}
