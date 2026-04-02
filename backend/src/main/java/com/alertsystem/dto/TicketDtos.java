package com.alertsystem.dto;

import com.alertsystem.enums.Severity;
import com.alertsystem.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class TicketDtos {

    /** Update ticket status / assignee */
    @Data
    public static class TicketUpdateRequest {
        @NotNull
        private TicketStatus status;
        private String assignedTo;
    }

    /** Full ticket response */
    @Data
    public static class TicketResponse {
        private Long id;
        private String ticketNumber;
        private String title;
        private String description;
        private Severity severity;
        private TicketStatus status;
        private String assignedTo;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime slaDueAt;
        private Long alertId;
        private String alertSource;
    }
}
