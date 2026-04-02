// Demo data shown when the Spring Boot backend is not running.
// Gives interviewers / reviewers a fully interactive experience.

export const MOCK_STATS = {
  totalAlerts: 11,
  pendingAlerts: 2,
  confirmedAlerts: 7,
  resolvedAlerts: 2,
  suppressedAlerts: 0,
  alertSev1Count: 3,
  alertSev2Count: 4,
  alertSev3Count: 3,
  alertSev4Count: 1,
  totalTickets: 7,
  openTickets: 3,
  inProgressTickets: 2,
  resolvedTickets: 2,
  closedTickets: 0,
  ticketSev1Count: 2,
  ticketSev2Count: 3,
  ticketSev3Count: 2,
  ticketSev4Count: 0,
  falsePositiveRate: 18.2,
}

const now = new Date()
const ago = (m) => new Date(now - m * 60000).toISOString()
const from = (m) => new Date(+now + m * 60000).toISOString()

export const MOCK_ALERTS = [
  { id: 1, name: 'High CPU Usage',          source: 'prod-web-01',  severity: 'SEV1', status: 'CONFIRMED', receivedAt: ago(120), eligibleAt: ago(119), secondsUntilEligible: 0,  ticketNumber: 'TKT-00001', description: 'CPU sustained above 95% for extended period' },
  { id: 2, name: 'Memory Leak Detected',    source: 'prod-api-02',  severity: 'SEV2', status: 'CONFIRMED', receivedAt: ago(90),  eligibleAt: ago(88),  secondsUntilEligible: 0,  ticketNumber: 'TKT-00002', description: 'Heap memory growing unbounded, OOM imminent' },
  { id: 3, name: 'Disk Space Critical',     source: 'prod-db-01',   severity: 'SEV2', status: 'CONFIRMED', receivedAt: ago(60),  eligibleAt: ago(58),  secondsUntilEligible: 0,  ticketNumber: 'TKT-00003', description: 'Disk at 92% on /data partition' },
  { id: 4, name: 'DB Query Latency High',   source: 'prod-db-02',   severity: 'SEV3', status: 'CONFIRMED', receivedAt: ago(45),  eligibleAt: ago(40),  secondsUntilEligible: 0,  ticketNumber: 'TKT-00004', description: 'P99 query latency exceeded 5000ms' },
  { id: 5, name: 'SSL Certificate Expiry',  source: 'prod-lb-01',   severity: 'SEV3', status: 'PENDING',   receivedAt: ago(2),   eligibleAt: from(3),  secondsUntilEligible: 180, ticketNumber: null,        description: 'Certificate expires in 7 days' },
  { id: 6, name: 'High Error Rate',         source: 'prod-api-01',  severity: 'SEV1', status: 'PENDING',   receivedAt: ago(0.5), eligibleAt: from(0.7),secondsUntilEligible: 42,  ticketNumber: null,        description: '5xx error rate spiked to 12%' },
  { id: 7, name: 'Network Blip',            source: 'prod-net-01',  severity: 'SEV4', status: 'RESOLVED',  receivedAt: ago(30),  eligibleAt: from(10), secondsUntilEligible: 0,  ticketNumber: null,        description: 'Brief packet loss — self-resolved' },
  { id: 8, name: 'Load Balancer Restart',   source: 'prod-lb-02',   severity: 'SEV2', status: 'CONFIRMED', receivedAt: ago(180), eligibleAt: ago(178), secondsUntilEligible: 0,  ticketNumber: 'TKT-00005', description: 'Load balancer restarted unexpectedly' },
  { id: 9, name: 'Pod CrashLoopBackOff',    source: 'k8s-cluster',  severity: 'SEV1', status: 'CONFIRMED', receivedAt: ago(20),  eligibleAt: ago(19),  secondsUntilEligible: 0,  ticketNumber: 'TKT-00006', description: 'payment-service pod in CrashLoopBackOff' },
  { id:10, name: 'Redis Connection Timeout',source: 'prod-cache-01',severity: 'SEV3', status: 'CONFIRMED', receivedAt: ago(15),  eligibleAt: ago(14),  secondsUntilEligible: 0,  ticketNumber: 'TKT-00007', description: 'Redis connection pool exhausted' },
  { id:11, name: 'DNS Resolution Flap',     source: 'prod-dns-01',  severity: 'SEV2', status: 'RESOLVED',  receivedAt: ago(50),  eligibleAt: from(20), secondsUntilEligible: 0,  ticketNumber: null,        description: 'Intermittent DNS failures' },
]

export const MOCK_TICKETS = [
  { id:1, ticketNumber:'TKT-00001', title:'[SEV1] High CPU Usage',          severity:'SEV1', status:'OPEN',        assignedTo:'ops-team',   alertId:1, alertSource:'prod-web-01',  createdAt: ago(119), updatedAt: ago(100), slaDueAt: from(-59) },
  { id:2, ticketNumber:'TKT-00002', title:'[SEV2] Memory Leak Detected',    severity:'SEV2', status:'IN_PROGRESS', assignedTo:'dev-team',   alertId:2, alertSource:'prod-api-02',  createdAt: ago(88),  updatedAt: ago(50),  slaDueAt: from(132) },
  { id:3, ticketNumber:'TKT-00003', title:'[SEV2] Disk Space Critical',     severity:'SEV2', status:'OPEN',        assignedTo:null,         alertId:3, alertSource:'prod-db-01',   createdAt: ago(58),  updatedAt: ago(58),  slaDueAt: from(182) },
  { id:4, ticketNumber:'TKT-00004', title:'[SEV3] DB Query Latency High',   severity:'SEV3', status:'RESOLVED',    assignedTo:'db-team',    alertId:4, alertSource:'prod-db-02',   createdAt: ago(40),  updatedAt: ago(10),  slaDueAt: from(1400) },
  { id:5, ticketNumber:'TKT-00005', title:'[SEV2] Load Balancer Restart',   severity:'SEV2', status:'IN_PROGRESS', assignedTo:'infra-team', alertId:8, alertSource:'prod-lb-02',   createdAt: ago(178), updatedAt: ago(90),  slaDueAt: from(62) },
  { id:6, ticketNumber:'TKT-00006', title:'[SEV1] Pod CrashLoopBackOff',    severity:'SEV1', status:'OPEN',        assignedTo:null,         alertId:9, alertSource:'k8s-cluster',  createdAt: ago(19),  updatedAt: ago(19),  slaDueAt: from(41) },
  { id:7, ticketNumber:'TKT-00007', title:'[SEV3] Redis Connection Timeout',severity:'SEV3', status:'RESOLVED',    assignedTo:'cache-team', alertId:10,alertSource:'prod-cache-01', createdAt: ago(14),  updatedAt: ago(5),   slaDueAt: from(1426) },
]
