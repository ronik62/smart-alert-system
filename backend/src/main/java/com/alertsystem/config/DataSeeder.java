package com.alertsystem.config;

import com.alertsystem.dto.AlertDtos.AlertRequest;
import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.Severity;
import com.alertsystem.model.Alert;
import com.alertsystem.repository.AlertRepository;
import com.alertsystem.service.AlertService;
import com.alertsystem.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds realistic demo data so the dashboard renders something meaningful
 * on first startup. Remove or disable in production.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AlertService alertService;
    private final TicketService ticketService;
    private final AlertRepository alertRepository;

    @Override
    public void run(String... args) {
        log.info("Seeding demo data...");

        // ── Seed some already-confirmed alerts with tickets ─────────────────
        seedConfirmedAlert("High CPU Usage", "prod-web-01", Severity.SEV1,
                "CPU sustained above 95% for extended period", -120);

        seedConfirmedAlert("Memory Leak Detected", "prod-api-02", Severity.SEV2,
                "Heap memory growing unbounded, OOM imminent", -300);

        seedConfirmedAlert("Disk Space Critical", "prod-db-01", Severity.SEV2,
                "Disk at 92% capacity on /data partition", -600);

        seedConfirmedAlert("Slow DB Queries", "prod-db-02", Severity.SEV3,
                "P99 query latency exceeded 5000ms threshold", -900);

        // ── Seed pending alerts (still in delay window) ─────────────────────
        seedPendingAlert("SSL Certificate Expiring", "prod-lb-01", Severity.SEV3,
                "Certificate expires in 7 days", 200);

        seedPendingAlert("High Error Rate", "prod-api-01", Severity.SEV1,
                "5xx error rate spiked to 12% in last 5 minutes", 45);

        // ── Seed a resolved false-positive ──────────────────────────────────
        seedResolvedAlert("Network Blip", "prod-net-01", Severity.SEV4,
                "Brief packet loss spike — self-resolved");

        log.info("Demo data seeded successfully.");
    }

    private void seedConfirmedAlert(String name, String source, Severity sev,
                                    String desc, int secondsOffset) {
        LocalDateTime received = LocalDateTime.now().plusSeconds(secondsOffset);

        Alert alert = Alert.builder()
                .name(name).source(source).description(desc)
                .severity(sev).status(AlertStatus.PENDING)
                .receivedAt(received)
                .eligibleAt(received.plusSeconds(10)) // already elapsed
                .build();

        alert = alertRepository.save(alert);
        ticketService.createTicketForAlert(alert);
    }

    private void seedPendingAlert(String name, String source, Severity sev,
                                  String desc, int secondsUntilEligible) {
        LocalDateTime now = LocalDateTime.now();
        Alert alert = Alert.builder()
                .name(name).source(source).description(desc)
                .severity(sev).status(AlertStatus.PENDING)
                .receivedAt(now)
                .eligibleAt(now.plusSeconds(secondsUntilEligible))
                .build();
        alertRepository.save(alert);
    }

    private void seedResolvedAlert(String name, String source, Severity sev, String desc) {
        LocalDateTime now = LocalDateTime.now();
        Alert alert = Alert.builder()
                .name(name).source(source).description(desc)
                .severity(sev).status(AlertStatus.RESOLVED)
                .receivedAt(now.minusMinutes(10))
                .eligibleAt(now.plusMinutes(5))
                .resolvedAt(now.minusMinutes(8))
                .build();
        alertRepository.save(alert);
    }
}
