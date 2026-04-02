package com.alertsystem.controller;

import com.alertsystem.dto.TicketDtos.TicketResponse;
import com.alertsystem.dto.TicketDtos.TicketUpdateRequest;
import com.alertsystem.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API for ticket management.
 *
 * GET    /api/tickets              → list all tickets
 * GET    /api/tickets/{id}         → get ticket by DB id
 * GET    /api/tickets/number/{num} → get ticket by TKT-XXXXX number
 * PATCH  /api/tickets/{id}         → update status / assignee
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }

    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<TicketResponse> getByTicketNumber(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(ticketService.getTicketByNumber(ticketNumber));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketUpdateRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }
}
