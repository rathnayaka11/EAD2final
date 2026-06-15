package com.echannel.appointment_service.controller;

import com.echannel.appointment_service.dto.AppointmentRequest;
import com.echannel.appointment_service.model.Appointment;
import com.echannel.appointment_service.model.Schedule;
import com.echannel.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> book(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(
                request.getPatientId(),
                request.getDoctorId(),
                request.getAppointment()
        ));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/schedules")
    public ResponseEntity<Schedule> addSchedule(@RequestBody Schedule schedule) {
        appointmentService.addSchedule(schedule);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/schedules/doctor/{doctorId}")
    public ResponseEntity<List<Schedule>> getDoctorSchedules(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorSchedules(doctorId));
    }
}