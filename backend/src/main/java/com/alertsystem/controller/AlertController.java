package com.alertsystem.controller;

import com.alertsystem.dto.AlertDtos.AlertRequest;
import com.alertsystem.dto.AlertDtos.AlertResponse;
import com.alertsystem.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API for alert ingestion and management.
 *
 * POST   /api/alerts          → ingest a new alert (starts delay window)
 * GET    /api/alerts          → list all alerts
 * GET    /api/alerts/{id}     → get single alert
 * POST   /api/alerts/{id}/resolve   → mark as resolved (false-positive)
 * POST   /api/alerts/{id}/suppress  → manually suppress
 */
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    public ResponseEntity<AlertResponse> ingestAlert(@Valid @RequestBody AlertRequest request) {
        AlertResponse response = alertService.ingestAlert(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertResponse> getAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlert(id));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<AlertResponse> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id));
    }

    @PostMapping("/{id}/suppress")
    public ResponseEntity<AlertResponse> suppressAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.suppressAlert(id));
    }
}
