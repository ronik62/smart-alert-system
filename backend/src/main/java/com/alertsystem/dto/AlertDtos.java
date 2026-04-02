package com.alertsystem.dto;

import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.Severity;
import com.alertsystem.enums.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

// ─────────────────────────────────────────────
//  Alert DTOs
// ─────────────────────────────────────────────

public class AlertDtos {

    /** Payload to create / ingest a new alert */
    @Data
    public static class AlertRequest {
        @NotBlank(message = "Alert name is required")
        private String name;

        @NotBlank(message = "Source is required")
        private String source;

        private String description;

        @NotNull(message = "Severity is required")
        private Severity severity;
    }

    /** Returned for every alert read/create response */
    @Data
    public static class AlertResponse {
        private Long id;
        private String name;
        private String source;
        private String description;
        private Severity severity;
        private AlertStatus status;
        private LocalDateTime receivedAt;
        private LocalDateTime eligibleAt;
        private LocalDateTime resolvedAt;
        private Long ticketId;           // null until ticket is created
        private String ticketNumber;     // null until ticket is created
        private long secondsUntilEligible; // countdown for UI
    }
}
