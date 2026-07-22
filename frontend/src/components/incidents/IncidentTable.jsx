import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import AiReportModal from './AiReportModal'
import { assignIncident, updateIncidentStatus } from '../../api/incidentsApi'
import { useAuth } from '../../hooks/useAuth'
import { hasRole, WRITE_ROLES } from '../../utils/roleGuard'
import styles from './IncidentTable.module.css'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

export default function IncidentTable({ incidents, onRefetch }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canWrite = hasRole(user?.role, WRITE_ROLES)

  const [activeReport, setActiveReport] = useState(null)
  const [assigningId, setAssigningId]   = useState(null)
  const [assignValue, setAssignValue]   = useState('')
  const [updatingId, setUpdatingId]     = useState(null)
  const [rowFeedback, setRowFeedback]   = useState({}) // { [id]: 'ok' | 'error' }

  function flashFeedback(id, type) {
    setRowFeedback((prev) => ({ ...prev, [id]: type }))
    setTimeout(() => setRowFeedback((prev) => { const n = {...prev}; delete n[id]; return n }), 1800)
  }

  async function handleAssign(id) {
    if (!assignValue.trim()) return
    setUpdatingId(id)
    try {
      await assignIncident(id, assignValue.trim())
      setAssigningId(null)
      setAssignValue('')
      flashFeedback(id, 'ok')
      onRefetch?.()
    } catch {
      flashFeedback(id, 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleStatusChange(id, status) {
    setUpdatingId(id)
    try {
      await updateIncidentStatus(id, status)
      flashFeedback(id, 'ok')
      onRefetch?.()
    } catch {
      flashFeedback(id, 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  if (!incidents?.length) return null

  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Summary</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => {
              const isUpdating = updatingId === inc.id
              const feedback   = rowFeedback[inc.id]

              return (
                <tr
                  key={inc.id}
                  className={`
                    ${feedback === 'ok'    ? styles.rowOk    : ''}
                    ${feedback === 'error' ? styles.rowError : ''}
                    ${isUpdating           ? styles.rowBusy  : ''}
                  `}
                >
                  {/* ID */}
                  <td>
                    <button className={styles.idLink} onClick={() => navigate(`/incidents/${inc.id}`)}>
                      #{inc.id}
                    </button>
                  </td>

                  {/* Severity */}
                  <td><Badge value={inc.severity} type="severity" /></td>

                  {/* Summary */}
                  <td>
                    <span className={styles.summary} title={inc.summary}>
                      {inc.summary?.length > 60 ? inc.summary.slice(0, 60) + '…' : inc.summary}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    {canWrite ? (
                      <select
                        className={styles.statusSelect}
                        value={inc.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge value={inc.status} type="status" />
                    )}
                  </td>

                  {/* Assigned To */}
                  <td>
                    {assigningId === inc.id ? (
                      <div className={styles.assignRow}>
                        <input
                          className={styles.assignInput}
                          value={assignValue}
                          onChange={(e) => setAssignValue(e.target.value)}
                          placeholder="Username…"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAssign(inc.id)}
                        />
                        <button className={styles.assignSave}   onClick={() => handleAssign(inc.id)} disabled={isUpdating}>✓</button>
                        <button className={styles.assignCancel} onClick={() => { setAssigningId(null); setAssignValue('') }}>✕</button>
                      </div>
                    ) : (
                      <div className={styles.assignedWrap}>
                        <span className={styles.assignedTo}>
                          {inc.assigned_to
                            ? <><span className={styles.assignedDot} />  {inc.assigned_to}</>
                            : <span className={styles.unassigned}>Unassigned</span>
                          }
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className={styles.date}>
                    {new Date(inc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className={styles.actions}>
                      {/* Feedback flash */}
                      {feedback === 'ok'    && <span className={styles.feedbackOk}>✓</span>}
                      {feedback === 'error' && <span className={styles.feedbackErr}>✕ failed</span>}
                      {isUpdating           && <span className={styles.feedbackBusy}>…</span>}

                      <button className={styles.reportBtn} onClick={() => setActiveReport(inc.ai_report)} title="View AI Report">
                        🤖 Report
                      </button>
                      {canWrite && (
                        <button
                          className={styles.assignBtn}
                          onClick={() => { setAssigningId(inc.id); setAssignValue(inc.assigned_to || '') }}
                          title="Assign incident"
                          disabled={isUpdating}
                        >
                          👤
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {activeReport && (
        <AiReportModal report={activeReport} onClose={() => setActiveReport(null)} />
      )}
    </>
  )
}
