package com.alertsystem.service;

import com.alertsystem.dto.DashboardStats;
import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.Severity;
import com.alertsystem.enums.TicketStatus;
import com.alertsystem.repository.AlertRepository;
import com.alertsystem.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlertRepository alertRepository;
    private final TicketRepository ticketRepository;

    public DashboardStats getStats() {
        long totalAlerts    = alertRepository.count();
        long pendingAlerts  = alertRepository.countByStatus(AlertStatus.PENDING);
        long confirmedAlerts= alertRepository.countByStatus(AlertStatus.CONFIRMED);
        long resolvedAlerts = alertRepository.countByStatus(AlertStatus.RESOLVED);
        long suppressed     = alertRepository.countByStatus(AlertStatus.SUPPRESSED);

        long totalTickets     = ticketRepository.count();
        long openTickets      = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress       = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets  = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closedTickets    = ticketRepository.countByStatus(TicketStatus.CLOSED);

        // False-positive rate = resolved alerts (no ticket) / total alerts
        double fpRate = totalAlerts == 0 ? 0.0
                : Math.round((resolvedAlerts * 100.0 / totalAlerts) * 10) / 10.0;

        return DashboardStats.builder()
                .totalAlerts(totalAlerts)
                .pendingAlerts(pendingAlerts)
                .confirmedAlerts(confirmedAlerts)
                .resolvedAlerts(resolvedAlerts)
                .suppressedAlerts(suppressed)
                .alertSev1Count(alertRepository.countBySeverity(Severity.SEV1))
                .alertSev2Count(alertRepository.countBySeverity(Severity.SEV2))
                .alertSev3Count(alertRepository.countBySeverity(Severity.SEV3))
                .alertSev4Count(alertRepository.countBySeverity(Severity.SEV4))
                .totalTickets(totalTickets)
                .openTickets(openTickets)
                .inProgressTickets(inProgress)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .ticketSev1Count(ticketRepository.countBySeverity(Severity.SEV1))
                .ticketSev2Count(ticketRepository.countBySeverity(Severity.SEV2))
                .ticketSev3Count(ticketRepository.countBySeverity(Severity.SEV3))
                .ticketSev4Count(ticketRepository.countBySeverity(Severity.SEV4))
                .falsePositiveRate(fpRate)
                .build();
    }
}
