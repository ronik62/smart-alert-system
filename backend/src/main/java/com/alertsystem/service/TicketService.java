package com.alertsystem.service;

import com.alertsystem.config.DelayConfig;
import com.alertsystem.dto.TicketDtos.TicketResponse;
import com.alertsystem.dto.TicketDtos.TicketUpdateRequest;
import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.TicketStatus;
import com.alertsystem.model.Alert;
import com.alertsystem.model.Ticket;
import com.alertsystem.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final DelayConfig delayConfig;

    /** Simple in-memory counter — replace with DB sequence in prod */
    private static final AtomicLong ticketCounter = new AtomicLong(1);

    // ─────────────────────────────────────────────────────────────────────────
    //  Auto-ticket creation (called by the scheduler)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Creates a support ticket for a confirmed alert.
     *
     * This is the core "auto ticketing" step:
     * 1. Alert delay window has elapsed → alert is real (not false positive)
     * 2. Alert status is promoted to CONFIRMED
     * 3. A ticket is created with SLA deadline based on severity
     *
     * Idempotent: if a ticket already exists for this alert, it is skipped.
     */
    @Transactional
    public Ticket createTicketForAlert(Alert alert) {
        // Idempotency guard
        if (ticketRepository.existsByAlertId(alert.getId())) {
            log.warn("Ticket already exists for alert id={}. Skipping.", alert.getId());
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        int slaHours = delayConfig.getSlaHours(alert.getSeverity());

        String ticketNumber = generateTicketNumber();

        String description = buildTicketDescription(alert);

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .title("[" + alert.getSeverity() + "] " + alert.getName())
                .description(description)
                .severity(alert.getSeverity())
                .status(TicketStatus.OPEN)
                .alert(alert)
                .createdAt(now)
                .updatedAt(now)
                .slaDueAt(now.plusHours(slaHours))
                .build();

        // Promote alert to CONFIRMED
        alert.setStatus(AlertStatus.CONFIRMED);

        Ticket saved = ticketRepository.save(ticket);

        log.info("✅ Ticket created: {} | severity={} | alert='{}' | slaDue={}",
                ticketNumber, alert.getSeverity(), alert.getName(), saved.getSlaDueAt());

        return saved;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Read operations
    // ─────────────────────────────────────────────────────────────────────────

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicket(Long id) {
        return toResponse(findById(id));
    }

    public TicketResponse getTicketByNumber(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketNumber));
        return toResponse(ticket);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Update operations
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse updateTicket(Long id, TicketUpdateRequest request) {
        Ticket ticket = findById(id);
        ticket.setStatus(request.getStatus());
        if (request.getAssignedTo() != null) {
            ticket.setAssignedTo(request.getAssignedTo());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return toResponse(ticketRepository.save(ticket));
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    private String generateTicketNumber() {
        return String.format("TKT-%05d", ticketCounter.getAndIncrement());
    }

    private String buildTicketDescription(Alert alert) {
        return String.format("""
                Auto-generated ticket from Smart Alert Monitoring System
                ─────────────────────────────────────────────────────
                Alert ID   : %d
                Alert Name : %s
                Source     : %s
                Severity   : %s
                Received At: %s
                Confirmed At: %s
                ─────────────────────────────────────────────────────
                Description: %s
                """,
                alert.getId(),
                alert.getName(),
                alert.getSource(),
                alert.getSeverity(),
                alert.getReceivedAt(),
                LocalDateTime.now(),
                alert.getDescription() != null ? alert.getDescription() : "N/A"
        );
    }

    public TicketResponse toResponse(Ticket t) {
        TicketResponse r = new TicketResponse();
        r.setId(t.getId());
        r.setTicketNumber(t.getTicketNumber());
        r.setTitle(t.getTitle());
        r.setDescription(t.getDescription());
        r.setSeverity(t.getSeverity());
        r.setStatus(t.getStatus());
        r.setAssignedTo(t.getAssignedTo());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());
        r.setSlaDueAt(t.getSlaDueAt());
        if (t.getAlert() != null) {
            r.setAlertId(t.getAlert().getId());
            r.setAlertSource(t.getAlert().getSource());
        }
        return r;
    }
}
