package com.echannel.appointment_service.dto;

import com.echannel.appointment_service.model.Appointment;
import lombok.Data;

@Data
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Appointment appointment;
}