package com.alertsystem.repository;

import com.alertsystem.enums.AlertStatus;
import com.alertsystem.enums.Severity;
import com.alertsystem.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    /** All alerts in a given status */
    List<Alert> findByStatus(AlertStatus status);

    /** Alerts by severity */
    List<Alert> findBySeverity(Severity severity);

    /**
     * Core scheduler query:
     * Find PENDING alerts whose eligibility window has passed —
     * these are real alerts that should become tickets.
     */
    @Query("SELECT a FROM Alert a WHERE a.status = 'PENDING' AND a.eligibleAt <= :now")
    List<Alert> findPendingAlertsReadyForTicketing(LocalDateTime now);

    /** Dashboard: count by status */
    long countByStatus(AlertStatus status);

    /** Dashboard: count by severity */
    long countBySeverity(Severity severity);
}
