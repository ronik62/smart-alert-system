package com.alertsystem.model;

import com.alertsystem.enums.Severity;
import com.alertsystem.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A support ticket auto-created when an alert passes the delay window.
 * Maps 1-to-1 to the Alert that triggered it.
 */
@Entity
@Table(name = "tickets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Auto-generated ticket reference, e.g. "TKT-0042" */
    @Column(nullable = false, unique = true)
    private String ticketNumber;

    /** Title copied from the triggering alert */
    @Column(nullable = false)
    private String title;

    /** Full description including alert metadata */
    @Column(length = 2000)
    private String description;

    /** Severity inherited from the alert */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    /** Current ticket status */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    /** Alert that triggered this ticket (owning side of 1-1) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id", nullable = false)
    private Alert alert;

    /** Assignee (free text; plug in LDAP/user service later) */
    private String assignedTo;

    /** When the ticket was created */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** When the ticket was last updated */
    private LocalDateTime updatedAt;

    /** SLA deadline based on severity */
    private LocalDateTime slaDueAt;
}
