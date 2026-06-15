package com.echannel.appointment_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Global user ID from Auth Service
    @Column(nullable = false)
    private Long patientUserId;

    // ✅ Global user ID from Auth Service
    @Column(nullable = false)
    private Long doctorUserId;

    private LocalDate date;

    private LocalTime time;

    private Double fee;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String type;

    @Column(length = 1000)
    private String notes;

    public enum AppointmentStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }
}