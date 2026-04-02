package com.alertsystem.service;

import com.alertsystem.model.Alert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Background scheduler that drives the false-alert filter.
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Every N ms (configurable via alert.scheduler.interval-ms)   │
 * │                                                              │
 * │  1. Query PENDING alerts where eligibleAt <= NOW             │
 * │  2. For each: call TicketService.createTicketForAlert()      │
 * │     → sets alert to CONFIRMED and creates a ticket           │
 * │                                                              │
 * │  Alerts that resolve (clear) before their eligibleAt         │
 * │  timestamp are marked RESOLVED by AlertService.resolveAlert  │
 * │  and will NOT appear in this query — false-positive filtered! │
 * └──────────────────────────────────────────────────────────────┘
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlertScheduler {

    private final AlertService alertService;
    private final TicketService ticketService;

    /**
     * Fixed-delay scheduler: waits `interval-ms` after each run completes
     * before starting the next one (avoids overlap on slow DB).
     *
     * Default: 15 seconds. Override via alert.scheduler.interval-ms.
     */
    @Scheduled(fixedDelayString = "${alert.scheduler.interval-ms:15000}")
    public void processEligibleAlerts() {
        List<Alert> eligibleAlerts = alertService.getPendingAlertsReadyForTicketing();

        if (eligibleAlerts.isEmpty()) {
            log.debug("Scheduler run: no eligible alerts found.");
            return;
        }

        log.info("Scheduler run: {} alert(s) eligible for ticketing", eligibleAlerts.size());

        for (Alert alert : eligibleAlerts) {
            try {
                ticketService.createTicketForAlert(alert);
            } catch (Exception e) {
                // Log and continue — one failure should not block others
                log.error("Failed to create ticket for alert id={}: {}", alert.getId(), e.getMessage(), e);
            }
        }
    }
}
