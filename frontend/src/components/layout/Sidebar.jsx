import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Bell, Ticket, Plus, Shield, Wifi, WifiOff
} from 'lucide-react'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts',  icon: Bell,            label: 'Alerts' },
  { to: '/tickets', icon: Ticket,          label: 'Tickets' },
  { to: '/ingest',  icon: Plus,            label: 'Ingest Alert' },
]

export default function Sidebar({ isLive, demoMode }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Shield size={18} color="#0a0b0d" strokeWidth={2.5} />
        </div>
        <div>
          <div className={styles.logoName}>AlertOps</div>
          <div className={styles.logoSub}>Auto Ticketing System</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={`${styles.statusChip} ${demoMode ? styles.demo : styles.live}`}>
          {demoMode ? (
            <><WifiOff size={11} /> Demo mode</>
          ) : isLive ? (
            <><span className={styles.pulse} /> Live</>
          ) : (
            <><Wifi size={11} /> Connecting…</>
          )}
        </div>
        <div className={styles.footerMeta}>
          {demoMode ? 'Backend offline' : 'localhost:8080'}
        </div>
      </div>
    </aside>
  )
}
