import { useState, useEffect, useCallback } from 'react'
import { alertsApi } from '../services/api'
import { MOCK_ALERTS } from '../services/mockData'

export function useAlerts(useMock = false) {
  const [alerts, setAlerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAlerts = useCallback(async () => {
    try {
      if (useMock) { setAlerts(MOCK_ALERTS); setLoading(false); return }
      const data = await alertsApi.getAll()
      setAlerts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [useMock])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  const resolveAlert = async (id) => {
    if (useMock) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a))
      return
    }
    await alertsApi.resolve(id)
    fetchAlerts()
  }

  const suppressAlert = async (id) => {
    if (useMock) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'SUPPRESSED' } : a))
      return
    }
    await alertsApi.suppress(id)
    fetchAlerts()
  }

  const createAlert = async (payload) => {
    if (useMock) {
      const newAlert = {
        id: Date.now(),
        ...payload,
        status: 'PENDING',
        receivedAt: new Date().toISOString(),
        secondsUntilEligible: 60,
        ticketNumber: null,
      }
      setAlerts(prev => [newAlert, ...prev])
      return newAlert
    }
    const result = await alertsApi.create(payload)
    fetchAlerts()
    return result
  }

  return { alerts, loading, error, refetch: fetchAlerts, resolveAlert, suppressAlert, createAlert }
}
