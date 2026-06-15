package com.echannel.prescription_service.repository;

import com.echannel.prescription_service.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository  extends JpaRepository<Prescription,Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDoctorId(Long doctorId);
    List<Prescription> findByAppointmentId(Long appointmentId);
}
