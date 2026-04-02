import React from 'react'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className={styles.card} style={{ '--accent': accent || '#8b90a0' }}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {Icon && <Icon size={14} color={accent || '#555c6e'} />}
      </div>
      <div className={styles.value} style={{ color: accent || '#e8eaf0' }}>
        {value ?? '—'}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
      <div className={styles.glow} />
    </div>
  )
}
