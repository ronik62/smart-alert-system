package com.alertsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    // ── Alert counts ──────────────────────────────
    private long totalAlerts;
    private long pendingAlerts;
    private long confirmedAlerts;
    private long resolvedAlerts;
    private long suppressedAlerts;

    // ── Alert severity breakdown ──────────────────
    private long alertSev1Count;
    private long alertSev2Count;
    private long alertSev3Count;
    private long alertSev4Count;

    // ── Ticket counts ─────────────────────────────
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;

    // ── Ticket severity breakdown ─────────────────
    private long ticketSev1Count;
    private long ticketSev2Count;
    private long ticketSev3Count;
    private long ticketSev4Count;

    // ── Derived ───────────────────────────────────
    /** False-positive rate: alerts resolved before delay elapsed */
    private double falsePositiveRate;
}
