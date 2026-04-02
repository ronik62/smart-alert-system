# Smart Alert Monitoring — React Dashboard

A production-grade React frontend for the **Smart Alert Monitoring & Auto Ticketing System**.  
Connects to a Spring Boot backend that auto-generates support tickets from infrastructure alerts.

---

## Features

| Feature | Details |
|---|---|
| **Live Dashboard** | Real-time stats, severity/status breakdown charts |
| **Alert Management** | Filter, search, resolve, and suppress incoming alerts |
| **Auto-Ticket Tracking** | SLA progress bars, status workflow, assignee tracking |
| **Ingest Form** | Manually push alerts with severity-aware delay info |
| **Demo Mode** | Fully interactive with mock data when backend is offline |
| **Auto-polling** | Refreshes every 5 seconds when connected to backend |

## Tech Stack

- **React 18** + **React Router v6**
- **Recharts** — area, bar, and pie charts
- **Axios** — API layer with interceptors
- **date-fns** — date formatting
- **Lucide React** — icons
- **CSS Modules** — scoped styling, no CSS-in-JS overhead
- **Vite** — fast dev server with API proxy

---

## Project Structure

```
src/
├── components/
│   ├── common/          # Badge, StatCard, Toast
│   └── layout/          # Sidebar, Header
├── hooks/               # useAlerts, useTickets, useDashboard
├── pages/               # Dashboard, Alerts, Tickets, Ingest
├── services/            # api.js (axios), mockData.js
└── utils/               # helpers (formatters, sev/status config)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Spring Boot backend running on `localhost:8080` *(optional — demo mode works offline)*

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (auto-proxies /api to localhost:8080)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

### Environment Variables

Copy `.env.example` → `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Backend API

This frontend expects the following endpoints from the Spring Boot backend:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts` | List all alerts |
| `POST` | `/api/alerts` | Ingest a new alert |
| `POST` | `/api/alerts/{id}/resolve` | Resolve (false positive) |
| `POST` | `/api/alerts/{id}/suppress` | Suppress alert |
| `GET` | `/api/tickets` | List all tickets |
| `PATCH` | `/api/tickets/{id}` | Update ticket status |
| `GET` | `/api/dashboard/stats` | Aggregated stats |

---

## Alert Severity & Delay Matrix

| Severity | Delay Window | SLA |
|---|---|---|
| SEV1 — Critical | 60 seconds | 1 hour |
| SEV2 — High | 2 minutes | 4 hours |
| SEV3 — Medium | 5 minutes | 24 hours |
| SEV4 — Low | 10 minutes | 72 hours |

If an alert is **resolved before the delay elapses**, no ticket is created (false-positive filtered).

---

## Demo Mode

When the backend is unreachable, the app automatically enters **Demo Mode**:
- Pre-seeded mock alerts and tickets are loaded
- All interactions (resolve, suppress, update ticket) work via local state
- A banner at the top indicates demo mode is active

---

## License

MIT
