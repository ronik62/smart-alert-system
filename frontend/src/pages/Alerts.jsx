import React, { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '../components/common/Badge'
import { useAlerts } from '../hooks/useAlerts'
import { useToast  } from '../components/common/Toast'
import { fmtDate, countdown } from '../utils/helpers'
import styles from './Alerts.module.css'

const SEVERITIES = ['ALL', 'SEV1', 'SEV2', 'SEV3', 'SEV4']
const STATUSES   = ['ALL', 'PENDING', 'CONFIRMED', 'RESOLVED', 'SUPPRESSED']

export default function Alerts({ demoMode }) {
  const { alerts, loading, resolveAlert, suppressAlert } = useAlerts(demoMode)
  const toast = useToast()

  const [search,   setSearch]   = useState('')
  const [sevFilter, setSev]     = useState('ALL')
  const [stFilter,  setSt]      = useState('ALL')

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      const matchSev = sevFilter === 'ALL' || a.severity === sevFilter
      const matchSt  = stFilter  === 'ALL' || a.status   === stFilter
      const matchQ   = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.source.toLowerCase().includes(search.toLowerCase())
      return matchSev && matchSt && matchQ
    })
  }, [alerts, search, sevFilter, stFilter])

  const handleResolve = async (id, name) => {
    try {
      await resolveAlert(id)
      toast(`Alert "${name}" resolved — false positive suppressed`, 'success')
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  const handleSuppress = async (id, name) => {
    try {
      await suppressAlert(id)
      toast(`Alert "${name}" suppressed`, 'info')
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  return (
    <div className={`${styles.page} fade-in`}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search alerts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <Filter size={13} color="var(--text3)" />
          <div className={styles.filterGroup}>
            {SEVERITIES.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${sevFilter === s ? styles.active : ''}`}
                onClick={() => setSev(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            {STATUSES.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${stFilter === s ? styles.active : ''}`}
                onClick={() => setSt(s)}
              >
                {s === 'IN_PROGRESS' ? 'In Progress' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className={styles.summaryBar}>
        <span className={styles.summaryCount}>{filtered.length} alerts</span>
        <span className={styles.summarySub}>
          {alerts.filter(a => a.status === 'PENDING').length} pending ·{' '}
          {alerts.filter(a => a.status === 'CONFIRMED').length} confirmed
        </span>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alert Name</th>
              <th>Source</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Delay Countdown</th>
              <th>Received</th>
              <th>Ticket</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className={styles.empty}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className={styles.empty}>No alerts match your filters.</td></tr>
            ) : (
              filtered.map(alert => (
                <tr key={alert.id} className={styles.row}>
                  <td className={styles.idCell}>#{alert.id}</td>
                  <td className={styles.nameCell}>
                    <div className={styles.alertName}>{alert.name}</div>
                    {alert.description && (
                      <div className={styles.alertDesc}>{alert.description}</div>
                    )}
                  </td>
                  <td className={styles.mono}>{alert.source}</td>
                  <td><SeverityBadge severity={alert.severity} /></td>
                  <td><StatusBadge  status={alert.status} /></td>
                  <td>
                    {alert.status === 'PENDING' ? (
                      <Countdown eligibleAt={alert.eligibleAt} />
                    ) : (
                      <span className={styles.dim}>—</span>
                    )}
                  </td>
                  <td className={styles.dim}>{fmtDate(alert.receivedAt)}</td>
                  <td>
                    {alert.ticketNumber ? (
                      <span className={styles.ticketChip}>{alert.ticketNumber}</span>
                    ) : (
                      <span className={styles.dim}>—</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {alert.status === 'PENDING' && (
                        <>
                          <button
                            className={styles.btnGreen}
                            onClick={() => handleResolve(alert.id, alert.name)}
                          >
                            Resolve
                          </button>
                          <button
                            className={styles.btnGray}
                            onClick={() => handleSuppress(alert.id, alert.name)}
                          >
                            Suppress
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Live countdown timer component
function Countdown({ eligibleAt }) {
  const [tick, setTick] = useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const val = countdown(eligibleAt)
  const urgent = val !== '00:00' && val.startsWith('00:0') && parseInt(val.split(':')[1]) < 30
  return (
    <span className={`${styles.countdown} ${urgent ? styles.urgent : ''}`}>
      {val === '00:00' ? 'Eligible' : val}
    </span>
  )
}
