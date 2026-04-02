package com.alertsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Smart Alert Monitoring Auto Ticketing System
 *
 * Key flow:
 *  1. External monitoring tools POST alerts to /api/alerts
 *  2. Each alert enters PENDING state with an eligibleAt timestamp
 *     (now + delay window based on severity)
 *  3. AlertScheduler runs every 15 s and promotes PENDING → CONFIRMED
 *     for any alert whose window has elapsed
 *  4. TicketService auto-creates a support ticket for each confirmed alert
 *  5. If the monitoring tool sends a resolve signal before the window elapses,
 *     the alert is marked RESOLVED — false positive, no ticket created
 *  6. React dashboard polls /api/dashboard/stats and renders live counters
 */
@SpringBootApplication
@EnableScheduling
public class SmartAlertSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartAlertSystemApplication.class, args);
    }
}
