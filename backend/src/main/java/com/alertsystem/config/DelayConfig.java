package com.alertsystem.config;

import com.alertsystem.enums.Severity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Central place to resolve per-severity delay windows.
 *
 * Values are injected from application.properties so they can be tuned
 * per environment without code changes.
 */
@Component
public class DelayConfig {

    @Value("${alert.delay.sev1:60}")
    private int sev1DelaySeconds;

    @Value("${alert.delay.sev2:120}")
    private int sev2DelaySeconds;

    @Value("${alert.delay.sev3:300}")
    private int sev3DelaySeconds;

    @Value("${alert.delay.sev4:600}")
    private int sev4DelaySeconds;

    /**
     * Returns the delay window (seconds) for the given severity.
     *
     * SEV1 gets the shortest window (60 s) because it is critical —
     * we want real tickets fast.
     * SEV4 gets the longest window (600 s) to aggressively filter noise.
     */
    public int getDelaySeconds(Severity severity) {
        return switch (severity) {
            case SEV1 -> sev1DelaySeconds;
            case SEV2 -> sev2DelaySeconds;
            case SEV3 -> sev3DelaySeconds;
            case SEV4 -> sev4DelaySeconds;
        };
    }

    /**
     * SLA hours by severity (used to compute ticket slaDueAt).
     * SEV1 = 1 h, SEV2 = 4 h, SEV3 = 24 h, SEV4 = 72 h
     */
    public int getSlaHours(Severity severity) {
        return switch (severity) {
            case SEV1 -> 1;
            case SEV2 -> 4;
            case SEV3 -> 24;
            case SEV4 -> 72;
        };
    }
}
