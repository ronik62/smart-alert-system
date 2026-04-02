import React from 'react'
import { getSevConfig, getStatusConfig } from '../../utils/helpers'

export function SeverityBadge({ severity }) {
  const cfg = getSevConfig(severity)
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.dim}`,
    }}>
      {cfg.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const cfg = getStatusConfig(status)
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: cfg.color,
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}
