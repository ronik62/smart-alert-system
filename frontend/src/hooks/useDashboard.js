import { useState, useEffect, useCallback } from 'react'
import { dashboardApi } from '../services/api'
import { MOCK_STATS } from '../services/mockData'

export function useDashboard(useMock = false) {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      if (useMock) { setStats(MOCK_STATS); setLoading(false); return }
      const data = await dashboardApi.getStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [useMock])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}
