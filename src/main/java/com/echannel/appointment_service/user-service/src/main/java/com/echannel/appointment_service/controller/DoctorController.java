package com.echannel.appointment_service.controller;

import com.echannel.appointment_service.model.Doctor;
import com.echannel.appointment_service.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getDoctor(@PathVariable Long userId) {
        try {
            Doctor doctor = doctorRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long userId,
                                          @RequestBody Doctor updated) {
        try {
            Doctor doctor = doctorRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found for userId: " + userId));

            if (updated.getName() != null) doctor.setName(updated.getName());
            if (updated.getSpecialization() != null) doctor.setSpecialization(updated.getSpecialization());
            if (updated.getFee() != null) doctor.setFee(updated.getFee());

            return ResponseEntity.ok(doctorRepository.save(doctor));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}