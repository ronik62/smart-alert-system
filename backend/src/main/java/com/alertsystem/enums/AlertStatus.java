package com.alertsystem.enums;

/**
 * Lifecycle states of an incoming alert.
 *
 * PENDING   → received, sitting in delay window (false-alert filter active)
 * CONFIRMED → delay window elapsed, alert is real → ticket will be created
 * RESOLVED  → alert cleared before delay elapsed (false positive — no ticket)
 * SUPPRESSED→ manually or policy-suppressed, no ticket generated
 */
public enum AlertStatus {
    PENDING,
    CONFIRMED,
    RESOLVED,
    SUPPRESSED
}
