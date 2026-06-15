from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class PaymentMethod(str, Enum):
    VISA = "VISA"
    MASTERCARD = "MASTERCARD"
    FRIMI = "FRIMI"

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class PaymentCreate(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    amount: float
    method: PaymentMethod

class PaymentResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    amount: float
    method: PaymentMethod
    status: PaymentStatus
    transaction_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True