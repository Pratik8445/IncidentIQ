import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { getIncident, assignIncident, updateIncidentStatus } from '../api/incidentsApi'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { hasRole, WRITE_ROLES } from '../utils/roleGuard'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import AiReportModal from '../components/incidents/AiReportModal'
import styles from './IncidentDetailPage.module.css'

const STATUS_FLOW = [
  { key: 'OPEN',        label: 'Open',        color: 'var(--status-open)' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'var(--status-progress)' },
  { key: 'RESOLVED',    label: 'Resolved',    color: 'var(--status-resolved)' },
  { key: 'CLOSED',      label: 'Closed',      color: 'var(--status-closed)' },
]

export default function IncidentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const canWrite = hasRole(user?.role, WRITE_ROLES)

  const { data, loading, error, refetch } = useFetch(
    useCallback(() => getIncident(id), [id])
  )

  const incident = data?.data

  const [showReport,   setShowReport]   = useState(false)
  const [assignValue,  setAssignValue]  = useState('')
  const [updating,     setUpdating]     = useState(false)
  const [updateError,  setUpdateError]  = useState(null)
  const [successMsg,   setSuccessMsg]   = useState(null)

  function flash(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 2500)
  }

  async function handleStatusChange(status) {
    if (incident?.status === status) return
    setUpdating(true)
    setUpdateError(null)
    try {
      await updateIncidentStatus(id, status)
      flash(`Status updated to ${status.replace('_', ' ')}`)
      refetch()
    } catch (err) {
      setUpdateError(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  async function handleAssign(e) {
    e.preventDefault()
    if (!assignValue.trim()) return
    setUpdating(true)
    setUpdateError(null)
    try {
      await assignIncident(id, assignValue.trim())
      flash(`Assigned to ${assignValue.trim()}`)
      setAssignValue('')
      refetch()
    } catch (err) {
      setUpdateError(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to assign incident.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <Spinner size="lg" />
  if (error)    return <ErrorMessage message={error} onRetry={refetch} />
  if (!incident) return <ErrorMessage message="Incident not found." />

  const currentStatusIdx = STATUS_FLOW.findIndex((s) => s.key === incident.status)

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.back} onClick={() => navigate('/incidents')}>
        ← Back to Incidents
      </button>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.heroId}>Incident #{incident.id}</div>
          <div className={styles.heroBadges}>
            <Badge value={incident.severity} type="severity" />
            <Badge value={incident.status}   type="status" />
          </div>
          <div className={styles.heroSpacer} />
          {canWrite && (
            <button
              className={styles.refreshHero}
              onClick={refetch}
              disabled={updating}
              title="Refresh incident data"
            >
              ↻
            </button>
          )}
        </div>
        <h1 className={styles.heroSummary}>{incident.summary}</h1>
        <div className={styles.heroDates}>
          <span>📅 Created: {new Date(incident.created_at).toLocaleString()}</span>
          <span>🔄 Updated: {new Date(incident.updated_at).toLocaleString()}</span>
          {incident.resolved_at && (
            <span>✅ Resolved: {new Date(incident.resolved_at).toLocaleString()}</span>
          )}
        </div>

        {/* Status timeline */}
        <div className={styles.timeline}>
          {STATUS_FLOW.map((s, idx) => {
            const isPast    = idx < currentStatusIdx
            const isCurrent = idx === currentStatusIdx
            return (
              <div key={s.key} className={styles.timelineStep}>
                <div
                  className={`${styles.timelineDot} ${isCurrent ? styles.dotCurrent : ''} ${isPast ? styles.dotPast : ''}`}
                  style={isCurrent ? { background: s.color, borderColor: s.color } : {}}
                />
                <span
                  className={`${styles.timelineLabel} ${isCurrent ? styles.labelCurrent : ''}`}
                  style={isCurrent ? { color: s.color } : {}}
                >
                  {s.label}
                </span>
                {idx < STATUS_FLOW.length - 1 && (
                  <div className={`${styles.timelineBar} ${isPast || isCurrent ? styles.barFilled : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Feedback */}
      {successMsg  && <div className={styles.successBanner}>✓ {successMsg}</div>}
      {updateError && <ErrorMessage message={updateError} />}

      {/* Detail grid */}
      <div className={styles.detailGrid}>
        {/* Left: meta + actions */}
        <div className={styles.metaCard}>
          <h2 className={styles.sectionTitle}>Details</h2>

          <div className={styles.metaRow}>
            <span className={styles.metaKey}>Assigned To</span>
            <span className={styles.metaVal}>
              {incident.assigned_to
                ? <span className={styles.assignedUser}>👤 {incident.assigned_to}</span>
                : <em className={styles.none}>Unassigned</em>
              }
            </span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaKey}>Status</span>
            <Badge value={incident.status} type="status" />
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaKey}>Severity</span>
            <Badge value={incident.severity} type="severity" />
          </div>

          {/* Actions — ADMIN / ENGINEER only */}
          {canWrite && (
            <div className={styles.actionsSection}>
              <h3 className={styles.actionTitle}>Update Status</h3>
              <div className={styles.statusBtns}>
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s.key}
                    className={`${styles.statusBtn} ${incident.status === s.key ? styles.statusActive : ''}`}
                    style={incident.status === s.key ? { '--s-color': s.color } : {}}
                    onClick={() => handleStatusChange(s.key)}
                    disabled={updating || incident.status === s.key}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <h3 className={styles.actionTitle}>Assign To</h3>
              <form className={styles.assignForm} onSubmit={handleAssign}>
                <input
                  className={styles.assignInput}
                  value={assignValue}
                  onChange={(e) => setAssignValue(e.target.value)}
                  placeholder={incident.assigned_to ? `Currently: ${incident.assigned_to}` : 'Enter username…'}
                  disabled={updating}
                />
                <button className={styles.assignBtn} type="submit" disabled={updating || !assignValue.trim()}>
                  {updating ? '…' : 'Assign'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: AI report */}
        <div className={styles.reportCard}>
          <div className={styles.reportHeader}>
            <div className={styles.reportTitleWrap}>
              <h2 className={styles.sectionTitle}>🤖 AI Incident Report</h2>
              <span className={styles.reportMeta}>Generated by Groq · llama-3.3-70b-versatile</span>
            </div>
            <button className={styles.expandBtn} onClick={() => setShowReport(true)}>
              Expand ↗
            </button>
          </div>
          <pre className={styles.reportPreview}>
            {incident.ai_report?.slice(0, 700)}
            {incident.ai_report?.length > 700 ? '\n\n…' : ''}
          </pre>
        </div>
      </div>

      {showReport && (
        <AiReportModal report={incident.ai_report} onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}
