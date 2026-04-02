import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '../components/common/Badge'
import { useTickets } from '../hooks/useTickets'
import { useToast   } from '../components/common/Toast'
import { fmtDate, slaPercent, slaColor } from '../utils/helpers'
import styles from './Tickets.module.css'

const STATUSES   = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const SEVERITIES = ['ALL', 'SEV1', 'SEV2', 'SEV3', 'SEV4']

export default function Tickets({ demoMode }) {
  const { tickets, loading, updateTicket } = useTickets(demoMode)
  const toast = useToast()

  const [search,    setSearch]  = useState('')
  const [sevFilter, setSev]     = useState('ALL')
  const [stFilter,  setSt]      = useState('ALL')

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchSev = sevFilter === 'ALL' || t.severity === sevFilter
      const matchSt  = stFilter  === 'ALL' || t.status   === stFilter
      const matchQ   = !search ||
        t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase())
      return matchSev && matchSt && matchQ
    })
  }, [tickets, search, sevFilter, stFilter])

  const handleUpdate = async (id, status, ticketNum) => {
    try {
      await updateTicket(id, { status })
      toast(`${ticketNum} → ${status.replace('_', ' ')}`, 'success')
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
            placeholder="Search tickets…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            {SEVERITIES.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${sevFilter === s ? styles.active : ''}`}
                onClick={() => setSev(s)}
              >{s}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            {STATUSES.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${stFilter === s ? styles.active : ''}`}
                onClick={() => setSt(s)}
              >{s === 'IN_PROGRESS' ? 'In Progress' : s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <span className={styles.summaryCount}>{filtered.length} tickets</span>
        <span className={styles.summarySub}>
          {tickets.filter(t => t.status === 'OPEN').length} open ·{' '}
          {tickets.filter(t => t.status === 'IN_PROGRESS').length} in progress
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>SLA</th>
              <th>Alert Source</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className={styles.empty}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className={styles.empty}>No tickets match your filters.</td></tr>
            ) : (
              filtered.map(ticket => {
                const pct   = slaPercent(ticket.slaDueAt, ticket.createdAt)
                const color = slaColor(pct)
                return (
                  <tr key={ticket.id} className={styles.row}>
                    <td>
                      <span className={styles.ticketNum}>{ticket.ticketNumber}</span>
                    </td>
                    <td className={styles.titleCell}>
                      <div className={styles.ticketTitle}>{ticket.title}</div>
                    </td>
                    <td><SeverityBadge severity={ticket.severity} /></td>
                    <td><StatusBadge  status={ticket.status} /></td>
                    <td className={styles.dim}>
                      {ticket.assignedTo || <span className={styles.unassigned}>Unassigned</span>}
                    </td>
                    <td>
                      <div className={styles.slaWrap}>
                        <div className={styles.slaLabel} style={{ color }}>
                          {pct}%
                        </div>
                        <div className={styles.slaBar}>
                          <div
                            className={styles.slaFill}
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                        <div className={styles.slaDue}>
                          due {fmtDate(ticket.slaDueAt)}
                        </div>
                      </div>
                    </td>
                    <td className={styles.dim}>{ticket.alertSource}</td>
                    <td className={styles.dim}>{fmtDate(ticket.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        {ticket.status === 'OPEN' && (
                          <button
                            className={styles.btnAction}
                            onClick={() => handleUpdate(ticket.id, 'IN_PROGRESS', ticket.ticketNumber)}
                          >
                            Start
                          </button>
                        )}
                        {ticket.status === 'IN_PROGRESS' && (
                          <button
                            className={`${styles.btnAction} ${styles.btnGreen}`}
                            onClick={() => handleUpdate(ticket.id, 'RESOLVED', ticket.ticketNumber)}
                          >
                            Resolve
                          </button>
                        )}
                        {ticket.status === 'RESOLVED' && (
                          <button
                            className={styles.btnAction}
                            onClick={() => handleUpdate(ticket.id, 'CLOSED', ticket.ticketNumber)}
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
