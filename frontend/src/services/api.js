import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── Response interceptor for consistent error handling ──
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error'
    return Promise.reject(new Error(message))
  }
)

// ── Alerts ──
export const alertsApi = {
  getAll:   ()         => api.get('/alerts'),
  getById:  (id)       => api.get(`/alerts/${id}`),
  create:   (payload)  => api.post('/alerts', payload),
  resolve:  (id)       => api.post(`/alerts/${id}/resolve`),
  suppress: (id)       => api.post(`/alerts/${id}/suppress`),
}

// ── Tickets ──
export const ticketsApi = {
  getAll:    ()              => api.get('/tickets'),
  getById:   (id)            => api.get(`/tickets/${id}`),
  getByNum:  (num)           => api.get(`/tickets/number/${num}`),
  update:    (id, payload)   => api.patch(`/tickets/${id}`, payload),
}

// ── Dashboard ──
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}

export default api
