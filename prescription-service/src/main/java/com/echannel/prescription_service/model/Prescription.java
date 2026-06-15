package com.echannel.prescription_service.model;

import jakarta.persistence.*;
import  lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_id")
    private  Long doctorId;

    @Column(name = "patient_id")
    private  Long patientId;

    @Column(name = "appointment_id")
    private Long appointmentId;

    private String diagnosis;
    private  String notes;
    private LocalDate date;

    @ElementCollection
    @CollectionTable(name = "perscription_medicines",
    joinColumns = @JoinColumn(name = "perscription_id"))
    @Column(name = "madicine")
    private List<String> medicines;
}
