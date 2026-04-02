import React from 'react'
import { useLocation } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import styles from './Header.module.css'

const TITLES = {
  '/':        { title: 'Dashboard',    sub: 'System overview & metrics' },
  '/alerts':  { title: 'Alerts',       sub: 'Incoming infrastructure alerts' },
  '/tickets': { title: 'Tickets',      sub: 'Auto-generated support tickets' },
  '/ingest':  { title: 'Ingest Alert', sub: 'Manually push a new alert' },
}

export default function Header({ onRefresh, lastUpdated }) {
  const { pathname } = useLocation()
  const meta = TITLES[pathname] || TITLES['/']

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.sub}>{meta.sub}</p>
      </div>
      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated}>
            Updated {lastUpdated}
          </span>
        )}
        <button className={styles.refreshBtn} onClick={onRefresh} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  )
}
