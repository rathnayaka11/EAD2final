package com.echannel.prescription_service.service;

import com.echannel.prescription_service.model.Prescription;
import com.echannel.prescription_service.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import  java.time.LocalDate;
import  java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private  final PrescriptionRepository prescriptionRepository;


    public Prescription createPrescription(Prescription prescription) {
        prescription.setDate(LocalDate.now());
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public Prescription getById(Long id) {
        return prescriptionRepository.findById(id).orElseThrow();
    }

    public List<Prescription> getByAppointment(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }
}
