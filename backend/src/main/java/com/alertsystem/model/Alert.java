package com.alertsystem.model;

import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.Severity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents an infrastructure alert received from a monitoring tool
 * (e.g. Prometheus, Datadog, Zabbix, PagerDuty webhook).
 */
@Entity
@Table(name = "alerts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable alert name, e.g. "High CPU on prod-db-01" */
    @Column(nullable = false)
    private String name;

    /** Source system / host that fired the alert */
    @Column(nullable = false)
    private String source;

    /** Short description of what is wrong */
    @Column(length = 1000)
    private String description;

    /** Alert severity (SEV1–SEV4) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    /** Current lifecycle state */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertStatus status;

    /** When the alert was first received */
    @Column(nullable = false)
    private LocalDateTime receivedAt;

    /**
     * Earliest time the alert becomes eligible for ticket creation.
     * Computed as: receivedAt + delay(severity).
     * If the alert resolves before this timestamp it is a false positive.
     */
    @Column(nullable = false)
    private LocalDateTime eligibleAt;

    /** When the alert was resolved (null if still active) */
    private LocalDateTime resolvedAt;

    /** FK to the ticket auto-created for this alert (null until confirmed) */
    @OneToOne(mappedBy = "alert", fetch = FetchType.LAZY)
    private Ticket ticket;
}
