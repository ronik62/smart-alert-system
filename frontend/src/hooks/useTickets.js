import { useState, useEffect, useCallback } from 'react'
import { ticketsApi } from '../services/api'
import { MOCK_TICKETS } from '../services/mockData'

export function useTickets(useMock = false) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchTickets = useCallback(async () => {
    try {
      if (useMock) { setTickets(MOCK_TICKETS); setLoading(false); return }
      const data = await ticketsApi.getAll()
      setTickets(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [useMock])

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [fetchTickets])

  const updateTicket = async (id, payload) => {
    if (useMock) {
      setTickets(prev => prev.map(t =>
        t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t
      ))
      return
    }
    await ticketsApi.update(id, payload)
    fetchTickets()
  }

  return { tickets, loading, error, refetch: fetchTickets, updateTicket }
}
