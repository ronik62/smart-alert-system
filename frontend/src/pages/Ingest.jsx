import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, Info } from 'lucide-react'
import { useAlerts } from '../hooks/useAlerts'
import { useToast  } from '../components/common/Toast'
import styles from './Ingest.module.css'

const DELAY_MAP = { SEV1: 60, SEV2: 120, SEV3: 300, SEV4: 600 }

const SEV_INFO = {
  SEV1: { label: 'Critical',     color: '#ff4d6a', delay: '60s',   sla: '1 hour',   desc: 'Immediate action required. Production down or at risk.' },
  SEV2: { label: 'High',         color: '#ffb020', delay: '2 min', sla: '4 hours',  desc: 'Significant impact. Core functionality degraded.' },
  SEV3: { label: 'Medium',       color: '#4d9eff', delay: '5 min', sla: '24 hours', desc: 'Partial impact. Non-critical service affected.' },
  SEV4: { label: 'Low / Info',   color: '#00d97e', delay: '10 min',sla: '72 hours', desc: 'Informational. No immediate customer impact.' },
}

export default function Ingest({ demoMode }) {
  const { createAlert } = useAlerts(demoMode)
  const toast    = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', source: '', severity: 'SEV2', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const sevInfo = SEV_INFO[form.severity]

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name   = 'Alert name is required'
    if (!form.source.trim()) e.source = 'Source is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const result = await createAlert({
        name:        form.name.trim(),
        source:      form.source.trim(),
        severity:    form.severity,
        description: form.description.trim() || null,
      })
      toast(`Alert ingested — ${form.severity} delay window started`, 'success')
      setForm({ name: '', source: '', severity: 'SEV2', description: '' })
      setTimeout(() => navigate('/alerts'), 800)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.layout}>
        {/* ── Form ── */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Alert Name <span className={styles.required}>*</span>
              </label>
              <input
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. High CPU Usage on prod-db-01"
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Source / Host <span className={styles.required}>*</span>
              </label>
              <input
                value={form.source}
                onChange={set('source')}
                placeholder="e.g. prod-web-01, k8s-cluster, datadog"
                className={errors.source ? styles.inputError : ''}
              />
              {errors.source && <span className={styles.errorMsg}>{errors.source}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Severity</label>
              <div className={styles.sevGrid}>
                {Object.entries(SEV_INFO).map(([sev, info]) => (
                  <label
                    key={sev}
                    className={`${styles.sevOption} ${form.severity === sev ? styles.sevSelected : ''}`}
                    style={{ '--sev-color': info.color }}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={sev}
                      checked={form.severity === sev}
                      onChange={set('severity')}
                      style={{ display: 'none' }}
                    />
                    <span className={styles.sevLabel} style={{ color: info.color }}>{sev}</span>
                    <span className={styles.sevName}>{info.label}</span>
                    <span className={styles.sevDelay}>{info.delay} delay</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={set('description')}
                placeholder="What is happening? Include any relevant metrics, thresholds, or context."
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setForm({ name: '', source: '', severity: 'SEV2', description: '' })}
              >
                Clear
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={submitting}
              >
                {submitting ? 'Ingesting…' : 'Ingest Alert'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Info Panel ── */}
        <div className={styles.infoPanel}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <AlertTriangle size={14} color={sevInfo.color} />
              <span style={{ color: sevInfo.color }}>{form.severity} — {sevInfo.label}</span>
            </div>
            <p className={styles.infoDesc}>{sevInfo.desc}</p>
            <div className={styles.infoRows}>
              <div className={styles.infoRow}>
                <span className={styles.infoKey}><Clock size={11} /> Delay window</span>
                <span className={styles.infoVal}>{sevInfo.delay}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoKey}><AlertTriangle size={11} /> SLA deadline</span>
                <span className={styles.infoVal}>{sevInfo.sla}</span>
              </div>
            </div>
          </div>

          <div className={styles.flowCard}>
            <div className={styles.flowTitle}>How it works</div>
            {[
              { step: '01', label: 'Alert ingested',    sub: 'Enters PENDING state' },
              { step: '02', label: 'Delay window',      sub: `${sevInfo.delay} countdown` },
              { step: '03', label: 'Scheduler checks',  sub: 'Every 15 seconds' },
              { step: '04', label: 'Ticket created',    sub: 'If alert not resolved' },
            ].map((f, i) => (
              <div key={i} className={styles.flowStep}>
                <div className={styles.flowNum}>{f.step}</div>
                <div>
                  <div className={styles.flowLabel}>{f.label}</div>
                  <div className={styles.flowSub}>{f.sub}</div>
                </div>
              </div>
            ))}
            <div className={styles.flowNote}>
              <Info size={11} />
              Resolve before the window elapses to suppress ticket creation.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
