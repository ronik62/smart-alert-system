import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar  from './components/layout/Sidebar'
import Header   from './components/layout/Header'
import { ToastProvider } from './components/common/Toast'
import Dashboard from './pages/Dashboard'
import Alerts    from './pages/Alerts'
import Tickets   from './pages/Tickets'
import Ingest    from './pages/Ingest'
import { dashboardApi } from './services/api'
import { fmtTime } from './utils/helpers'
import styles from './App.module.css'

export default function App() {
  const [demoMode,    setDemoMode]    = useState(false)
  const [isLive,      setIsLive]      = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshKey,  setRefreshKey]  = useState(0)

  // Probe the backend; fall back to demo mode if unreachable
  useEffect(() => {
    const check = async () => {
      try {
        await dashboardApi.getStats()
        setDemoMode(false)
        setIsLive(true)
        setLastUpdated(fmtTime(new Date().toISOString()))
      } catch {
        setDemoMode(true)
        setIsLive(false)
      }
    }
    check()
    const t = setInterval(check, 10000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = () => setRefreshKey(k => k + 1)

  return (
    <ToastProvider>
      <div className={styles.shell}>
        <Sidebar isLive={isLive} demoMode={demoMode} />
        <div className={styles.main}>
          <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
          <main className={styles.content} key={refreshKey}>
            {demoMode && (
              <div className={styles.demoBanner}>
                Demo mode — backend offline. Start Spring Boot on port 8080 to connect live data.
              </div>
            )}
            <Routes>
              <Route path="/"        element={<Dashboard demoMode={demoMode} />} />
              <Route path="/alerts"  element={<Alerts    demoMode={demoMode} />} />
              <Route path="/tickets" element={<Tickets   demoMode={demoMode} />} />
              <Route path="/ingest"  element={<Ingest    demoMode={demoMode} />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
