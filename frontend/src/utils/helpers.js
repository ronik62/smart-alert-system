import { formatDistanceToNow, format, differenceInSeconds } from 'date-fns'

// ── Severity helpers ──────────────────────────────────────────
export const SEV_CONFIG = {
  SEV1: { label: 'SEV1', color: '#ff4d6a', bg: '#ff4d6a18', dim: '#ff4d6a30', slaHours: 1 },
  SEV2: { label: 'SEV2', color: '#ffb020', bg: '#ffb02018', dim: '#ffb02030', slaHours: 4 },
  SEV3: { label: 'SEV3', color: '#4d9eff', bg: '#4d9eff18', dim: '#4d9eff30', slaHours: 24 },
  SEV4: { label: 'SEV4', color: '#00d97e', bg: '#00d97e18', dim: '#00d97e30', slaHours: 72 },
}

export const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',     color: '#ffb020', bg: '#ffb02018' },
  CONFIRMED:  { label: 'Confirmed',   color: '#ff4d6a', bg: '#ff4d6a18' },
  RESOLVED:   { label: 'Resolved',    color: '#00d97e', bg: '#00d97e18' },
  SUPPRESSED: { label: 'Suppressed',  color: '#8b90a0', bg: '#8b90a018' },
  OPEN:        { label: 'Open',        color: '#ff4d6a', bg: '#ff4d6a18' },
  IN_PROGRESS: { label: 'In Progress', color: '#ffb020', bg: '#ffb02018' },
  CLOSED:      { label: 'Closed',      color: '#8b90a0', bg: '#8b90a018' },
}

export function getSevConfig(sev)    { return SEV_CONFIG[sev]    || SEV_CONFIG.SEV4 }
export function getStatusConfig(st)  { return STATUS_CONFIG[st]  || STATUS_CONFIG.OPEN }

// ── Date/time helpers ─────────────────────────────────────────
export function timeAgo(iso)   { return iso ? formatDistanceToNow(new Date(iso), { addSuffix: true }) : '—' }
export function fmtDate(iso)   { return iso ? format(new Date(iso), 'MMM d, HH:mm') : '—' }
export function fmtTime(iso)   { return iso ? format(new Date(iso), 'HH:mm:ss') : '—' }

export function countdown(iso) {
  if (!iso) return '00:00'
  const secs = Math.max(0, differenceInSeconds(new Date(iso), new Date()))
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export function slaPercent(slaDueAt, createdAt) {
  if (!slaDueAt || !createdAt) return 0
  const total   = new Date(slaDueAt) - new Date(createdAt)
  const elapsed = Date.now()        - new Date(createdAt)
  return Math.min(100, Math.round((elapsed / total) * 100))
}

export function slaColor(pct) {
  if (pct >= 90) return '#ff4d6a'
  if (pct >= 70) return '#ffb020'
  return '#00d97e'
}
