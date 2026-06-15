package com.echannel.appointment_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long userId;

    private String name;
    private String fullName;
    private String email;
    private String specialty;
    private String specialization;
    private String hospital;
    private String phone;
    private String gender;
    private String profileImage;
    private String slmcNumber;
    private String accountStatus;
    private Double consultationFee;
    private Double fee;
}