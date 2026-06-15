from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Payment, PaymentStatus
from app.schemas import PaymentCreate, PaymentResponse
from typing import List
import uuid

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = Payment(
        appointment_id=payment.appointment_id,
        patient_id=payment.patient_id,
        doctor_id=payment.doctor_id,
        amount=payment.amount,
        method=payment.method,
        status=PaymentStatus.PENDING,
        transaction_id=str(uuid.uuid4())
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=List[PaymentResponse])
def get_all_payments(db: Session = Depends(get_db)):
    return db.query(Payment).all()

@router.get("/patient/{patient_id}", response_model=List[PaymentResponse])
def get_payments_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Payment).filter(Payment.patient_id == patient_id).all()

@router.get("/doctor/{doctor_id}", response_model=List[PaymentResponse])
def get_payments_by_doctor(doctor_id: int, db: Session = Depends(get_db)):
    return db.query(Payment).filter(Payment.doctor_id == doctor_id).all()

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.put("/{payment_id}/verify", response_model=PaymentResponse)
def verify_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment.status = PaymentStatus.SUCCESS
    db.commit()
    db.refresh(payment)
    return payment
