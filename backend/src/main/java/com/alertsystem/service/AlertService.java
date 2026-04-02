package com.alertsystem.service;

import com.alertsystem.config.DelayConfig;
import com.alertsystem.dto.AlertDtos.AlertRequest;
import com.alertsystem.dto.AlertDtos.AlertResponse;
import com.alertsystem.enums.AlertStatus;
import com.alertsystem.model.Alert;
import com.alertsystem.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final DelayConfig delayConfig;

    // ─────────────────────────────────────────────────────────────────────────
    //  Ingest a new alert
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Ingests an incoming alert and places it in PENDING state.
     *
     * The eligibleAt timestamp is computed here:
     *   eligibleAt = now + delay(severity)
     *
     * The background scheduler will later promote PENDING → CONFIRMED alerts
     * whose eligibleAt has passed without being resolved first.
     */
    @Transactional
    public AlertResponse ingestAlert(AlertRequest request) {
        LocalDateTime now = LocalDateTime.now();
        int delaySeconds = delayConfig.getDelaySeconds(request.getSeverity());

        Alert alert = Alert.builder()
                .name(request.getName())
                .source(request.getSource())
                .description(request.getDescription())
                .severity(request.getSeverity())
                .status(AlertStatus.PENDING)
                .receivedAt(now)
                .eligibleAt(now.plusSeconds(delaySeconds))
                .build();

        Alert saved = alertRepository.save(alert);
        log.info("Alert ingested: id={} name='{}' severity={} eligibleAt={}",
                saved.getId(), saved.getName(), saved.getSeverity(), saved.getEligibleAt());

        return toResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Resolve an alert (false-positive short-circuit)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Marks a PENDING alert as RESOLVED (false positive).
     *
     * Called when the monitoring tool sends a "clear" signal.
     * Because the alert is resolved before its eligibleAt timestamp,
     * no ticket will be generated.
     *
     * Alerts already CONFIRMED are not affected here — the ticket
     * that was created for them must be handled separately.
     */
    @Transactional
    public AlertResponse resolveAlert(Long alertId) {
        Alert alert = findById(alertId);

        if (alert.getStatus() == AlertStatus.PENDING) {
            alert.setStatus(AlertStatus.RESOLVED);
            alert.setResolvedAt(LocalDateTime.now());
            alertRepository.save(alert);
            log.info("Alert id={} resolved before eligibility window — false positive suppressed", alertId);
        } else {
            log.warn("Resolve called on alert id={} with status={} — no state change", alertId, alert.getStatus());
        }

        return toResponse(alert);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Suppress an alert manually
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public AlertResponse suppressAlert(Long alertId) {
        Alert alert = findById(alertId);
        alert.setStatus(AlertStatus.SUPPRESSED);
        alertRepository.save(alert);
        log.info("Alert id={} manually suppressed", alertId);
        return toResponse(alert);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Read operations
    // ─────────────────────────────────────────────────────────────────────────

    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AlertResponse getAlert(Long id) {
        return toResponse(findById(id));
    }

    public List<Alert> getPendingAlertsReadyForTicketing() {
        return alertRepository.findPendingAlertsReadyForTicketing(LocalDateTime.now());
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    public Alert findById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found: " + id));
    }

    /** Maps entity → DTO, including live countdown for the UI */
    public AlertResponse toResponse(Alert a) {
        AlertResponse r = new AlertResponse();
        r.setId(a.getId());
        r.setName(a.getName());
        r.setSource(a.getSource());
        r.setDescription(a.getDescription());
        r.setSeverity(a.getSeverity());
        r.setStatus(a.getStatus());
        r.setReceivedAt(a.getReceivedAt());
        r.setEligibleAt(a.getEligibleAt());
        r.setResolvedAt(a.getResolvedAt());

        if (a.getTicket() != null) {
            r.setTicketId(a.getTicket().getId());
            r.setTicketNumber(a.getTicket().getTicketNumber());
        }

        // Countdown: how many seconds until this alert becomes ticket-eligible
        long secondsLeft = ChronoUnit.SECONDS.between(LocalDateTime.now(), a.getEligibleAt());
        r.setSecondsUntilEligible(Math.max(0, secondsLeft));

        return r;
    }
}
