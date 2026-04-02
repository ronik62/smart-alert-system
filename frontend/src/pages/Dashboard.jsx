import React from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  AlertTriangle, Ticket, ShieldCheck, TrendingDown,
  Activity, Clock
} from 'lucide-react'
import StatCard from '../components/common/StatCard'
import { useDashboard } from '../hooks/useDashboard'
import { useAlerts }    from '../hooks/useAlerts'
import { useTickets }   from '../hooks/useTickets'
import styles from './Dashboard.module.css'

const SEV_COLORS   = ['#ff4d6a', '#ffb020', '#4d9eff', '#00d97e']
const STATUS_COLORS = ['#ffb020', '#ff4d6a', '#00d97e', '#555c6e']
const TICKET_COLORS = ['#ff4d6a', '#ffb020', '#00d97e', '#555c6e']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      {label && <div className={styles.tooltipLabel}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ demoMode }) {
  const { stats }   = useDashboard(demoMode)
  const { alerts }  = useAlerts(demoMode)
  const { tickets } = useTickets(demoMode)

  if (!stats) {
    return <div className={styles.loading}>Loading dashboard…</div>
  }

  const sevData = [
    { name: 'SEV1', value: stats.alertSev1Count },
    { name: 'SEV2', value: stats.alertSev2Count },
    { name: 'SEV3', value: stats.alertSev3Count },
    { name: 'SEV4', value: stats.alertSev4Count },
  ]

  const alertStatusData = [
    { name: 'Pending',    value: stats.pendingAlerts },
    { name: 'Confirmed',  value: stats.confirmedAlerts },
    { name: 'Resolved',   value: stats.resolvedAlerts },
    { name: 'Suppressed', value: stats.suppressedAlerts },
  ]

  const ticketStatusData = [
    { name: 'Open',        value: stats.openTickets },
    { name: 'In Progress', value: stats.inProgressTickets },
    { name: 'Resolved',    value: stats.resolvedTickets },
    { name: 'Closed',      value: stats.closedTickets },
  ]

  const ticketSevBar = [
    { sev: 'SEV1', Open: stats.ticketSev1Count, tickets: stats.ticketSev1Count },
    { sev: 'SEV2', Open: stats.ticketSev2Count, tickets: stats.ticketSev2Count },
    { sev: 'SEV3', Open: stats.ticketSev3Count, tickets: stats.ticketSev3Count },
    { sev: 'SEV4', Open: stats.ticketSev4Count, tickets: stats.ticketSev4Count },
  ]

  // Build last-10-alerts activity for area chart
  const recentActivity = alerts.slice(-10).map((a, i) => ({
    name: `#${a.id}`,
    alerts: 1,
    tickets: a.ticketNumber ? 1 : 0,
  }))

  return (
    <div className={`${styles.page} fade-in`}>
      {/* ── Stat Cards ── */}
      <div className={styles.statGrid}>
        <StatCard
          label="Total Alerts"
          value={stats.totalAlerts}
          icon={AlertTriangle}
          accent="#8b90a0"
          sub={`${stats.pendingAlerts} pending`}
        />
        <StatCard
          label="Confirmed Alerts"
          value={stats.confirmedAlerts}
          icon={Activity}
          accent="#ff4d6a"
          sub="Passed delay window"
        />
        <StatCard
          label="Open Tickets"
          value={stats.openTickets}
          icon={Ticket}
          accent="#ffb020"
          sub={`${stats.totalTickets} total`}
        />
        <StatCard
          label="False Positive Rate"
          value={`${stats.falsePositiveRate}%`}
          icon={ShieldCheck}
          accent="#00d97e"
          sub="Filtered before ticketing"
        />
      </div>

      {/* ── Second Row Stats ── */}
      <div className={styles.statGrid}>
        <StatCard
          label="Pending"
          value={stats.pendingAlerts}
          icon={Clock}
          accent="#ffb020"
          sub="In delay window"
        />
        <StatCard
          label="Suppressed"
          value={stats.suppressedAlerts}
          accent="#555c6e"
          sub="Manually suppressed"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressTickets}
          accent="#4d9eff"
          sub="Tickets being worked"
        />
        <StatCard
          label="Resolved"
          value={stats.resolvedAlerts}
          icon={TrendingDown}
          accent="#00d97e"
          sub="No ticket needed"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className={styles.chartRow}>
        {/* Severity Donut */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Alert severity breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sevData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {sevData.map((_, i) => (
                  <Cell key={i} fill={SEV_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {sevData.map((d, i) => (
              <div key={d.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: SEV_COLORS[i] }} />
                <span className={styles.legendLabel}>{d.name}</span>
                <span className={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Status Donut */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Alert status distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={alertStatusData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {alertStatusData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {alertStatusData.map((d, i) => (
              <div key={d.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: STATUS_COLORS[i] }} />
                <span className={styles.legendLabel}>{d.name}</span>
                <span className={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Status Donut */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Ticket status distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ticketStatusData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {ticketStatusData.map((_, i) => (
                  <Cell key={i} fill={TICKET_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {ticketStatusData.map((d, i) => (
              <div key={d.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: TICKET_COLORS[i] }} />
                <span className={styles.legendLabel}>{d.name}</span>
                <span className={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className={styles.chartRowWide}>
        {/* Tickets per severity bar */}
        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.chartTitle}>Tickets by severity</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ticketSevBar} barSize={32}>
              <XAxis dataKey="sev" tick={{ fill: '#555c6e', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555c6e', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
                {ticketSevBar.map((_, i) => (
                  <Cell key={i} fill={SEV_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity area */}
        <div className={styles.chartCard} style={{ flex: 2 }}>
          <div className={styles.chartTitle}>Recent alert activity</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={recentActivity}>
              <defs>
                <linearGradient id="gAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ff4d6a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff4d6a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d97e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d97e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#555c6e', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555c6e', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="alerts"  stroke="#ff4d6a" fill="url(#gAlerts)"  strokeWidth={2} name="Alerts" />
              <Area type="monotone" dataKey="tickets" stroke="#00d97e" fill="url(#gTickets)" strokeWidth={2} name="Tickets" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
