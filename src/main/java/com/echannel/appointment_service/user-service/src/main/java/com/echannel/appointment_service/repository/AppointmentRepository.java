package com.echannel.appointment_service.repository;

import com.echannel.appointment_service.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientUserId(Long patientUserId);

    List<Appointment> findByDoctorUserId(Long doctorUserId);

    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
}