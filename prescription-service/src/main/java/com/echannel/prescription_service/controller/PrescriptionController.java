package com.echannel.prescription_service.controller;

import com.echannel.prescription_service.model.Prescription;
import com.echannel.prescription_service.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<Prescription> create(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescription));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getById(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getByDoctor(doctorId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Prescription>> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(prescriptionService.getByAppointment(appointmentId));
    }
}
