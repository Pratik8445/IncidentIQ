import { useCallback, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getDashboardSummary, getDashboardSeverity } from '../api/dashboardApi'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { hasRole, WRITE_ROLES } from '../utils/roleGuard'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import styles from './DashboardPage.module.css'

const SEVERITY_COLORS = {
  critical: 'var(--critical)',
  high:     'var(--high)',
  medium:   'var(--medium)',
  low:      'var(--low)',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const canWrite = hasRole(user?.role, WRITE_ROLES)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const {
    data: summary,
    loading: sLoad,
    error: sErr,
    refetch: rSummary,
  } = useFetch(useCallback(() => getDashboardSummary(), []))

  const {
    data: severity,
    loading: sevLoad,
    error: sevErr,
    refetch: rSeverity,
  } = useFetch(useCallback(() => getDashboardSeverity(), []))

  const loading = sLoad || sevLoad

  function handleRefresh() {
    rSummary()
    rSeverity()
    setLastRefresh(new Date())
  }

  const statusData = summary
    ? [
        { name: 'Open',        value: summary.open,        fill: 'var(--status-open)' },
        { name: 'In Progress', value: summary.in_progress,  fill: 'var(--status-progress)' },
        { name: 'Resolved',    value: summary.resolved,     fill: 'var(--status-resolved)' },
        { name: 'Closed',      value: summary.closed,       fill: 'var(--status-closed)' },
      ]
    : []

  const severityData = severity
    ? Object.entries(severity).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        fill: SEVERITY_COLORS[key] || 'var(--brand)',
      }))
    : []

  if (loading) return <Spinner size="lg" />

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>
            Incident overview and system health
            <span className={styles.lastRefresh}>
              · Last updated {lastRefresh.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading}>
            ↻ Refresh
          </button>
          {canWrite && (
            <a href="/logs" className={styles.analyzeLink}>
              🤖 Run AI Analysis →
            </a>
          )}
        </div>
      </div>

      {(sErr || sevErr) && (
        <ErrorMessage
          message={sErr || sevErr}
          onRetry={handleRefresh}
        />
      )}

      {/* Stat Cards — all navigate to /incidents */}
      {summary && (
        <div className={styles.statsGrid}>
          <StatCard label="Total Incidents" value={summary.total_incidents} accent="var(--brand)"           icon="📊" to="/incidents" />
          <StatCard label="Open"            value={summary.open}            accent="var(--status-open)"     icon="🔴" to="/incidents" />
          <StatCard label="In Progress"     value={summary.in_progress}     accent="var(--status-progress)" icon="🔵" to="/incidents" />
          <StatCard label="Resolved"        value={summary.resolved}        accent="var(--status-resolved)" icon="✅" to="/incidents" />
          <StatCard label="Closed"          value={summary.closed}          accent="var(--status-closed)"   icon="🔒" to="/incidents" />
        </div>
      )}

      {/* No data state */}
      {summary && summary.total_incidents === 0 && (
        <div className={styles.emptyHint}>
          <span>🟢</span>
          <span>No incidents yet — system is healthy. Go to <a href="/logs">Logs</a> to ingest data and run an AI analysis.</span>
        </div>
      )}

      {/* Charts */}
      {(statusData.length > 0 || severityData.length > 0) && (
        <div className={styles.chartsGrid}>
          {statusData.length > 0 && (
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Incidents by Status</h2>
                <span className={styles.chartMeta}>Live · /dashboard/summary</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {severityData.length > 0 && (
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Incidents by Severity</h2>
                <span className={styles.chartMeta}>Live · /dashboard/severity</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
