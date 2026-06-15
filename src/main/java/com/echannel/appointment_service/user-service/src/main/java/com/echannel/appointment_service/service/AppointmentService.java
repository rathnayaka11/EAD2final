package com.echannel.appointment_service.service;

import com.echannel.appointment_service.model.Appointment;
import com.echannel.appointment_service.model.Schedule;
import com.echannel.appointment_service.repository.AppointmentRepository;
import com.echannel.appointment_service.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;

    // ✅ BOOK APPOINTMENT (Microservice Safe)
    public Appointment bookAppointment(Long patientUserId,
                                       Long doctorUserId,
                                       Appointment details) {

        Appointment appointment = Appointment.builder()
                .patientUserId(patientUserId)
                .doctorUserId(doctorUserId)
                .date(details.getDate())
                .time(details.getTime())
                .fee(details.getFee()) // Later can fetch from doctor-service via Feign
                .status(Appointment.AppointmentStatus.PENDING)
                .type(details.getType())
                .notes(details.getNotes())
                .build();

        return appointmentRepository.save(appointment);
    }

    // ✅ GET BY PATIENT
    public List<Appointment> getAppointmentsByPatient(Long patientUserId) {
        return appointmentRepository.findByPatientUserId(patientUserId);
    }

    // ✅ GET BY DOCTOR
    public List<Appointment> getAppointmentsByDoctor(Long doctorUserId) {
        return appointmentRepository.findByDoctorUserId(doctorUserId);
    }

    // ✅ UPDATE STATUS
    public Appointment updateStatus(Long id, String status) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(
                Appointment.AppointmentStatus.valueOf(status.toUpperCase())
        );

        return appointmentRepository.save(appointment);
    }

    // ✅ CANCEL
    public void cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    // ✅ ADD SCHEDULE
    public void addSchedule(Schedule schedule) {
        scheduleRepository.save(schedule);
    }

    // ✅ GET DOCTOR SCHEDULES
    public List<Schedule> getDoctorSchedules(Long doctorUserId) {
        return scheduleRepository.findByDoctorUserId(doctorUserId);
    }
}