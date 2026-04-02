package com.alertsystem.repository;

import com.alertsystem.enums.Severity;
import com.alertsystem.enums.TicketStatus;
import com.alertsystem.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findBySeverity(Severity severity);

    boolean existsByAlertId(Long alertId);

    long countByStatus(TicketStatus status);

    long countBySeverity(Severity severity);
}
