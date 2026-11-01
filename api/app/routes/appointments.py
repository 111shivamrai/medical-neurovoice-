import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import AppointmentCreate, AppointmentModel
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Appointments"])

@router.post("/appointment", response_model=AppointmentModel)
async def book_appointment(payload: AppointmentCreate):
    doctor = db_manager.doctors.get(payload.doctorId)
    doctor_name = doctor["name"] if doctor else "Specialist Doctor"
    doctor_specialty = doctor["specialty"] if doctor else "Neurology"
    hospital = doctor["hospital"] if doctor else "Jabalpur Medical College"

    apt_id = f"apt-{uuid.uuid4().hex[:6]}"
    ref_num = f"JMC-APT-{uuid.uuid4().int % 90000 + 10000}"
    created_at = datetime.utcnow().isoformat() + "Z"

    record = {
        "id": apt_id,
        "userId": payload.userId,
        "doctorId": payload.doctorId,
        "doctorName": doctor_name,
        "doctorSpecialty": doctor_specialty,
        "hospital": hospital,
        "disorder": payload.disorder,
        "dateTime": payload.dateTime,
        "status": "Upcoming",
        "notes": payload.notes,
        "referenceNumber": ref_num,
        "createdAt": created_at,
    }

    db_manager.appointments[apt_id] = record
    return AppointmentModel(**record)

@router.get("/appointments/{uid}", response_model=List[AppointmentModel])
async def list_user_appointments(uid: str):
    results = [
        AppointmentModel(**a) for a in db_manager.appointments.values()
        if a.get("userId") == uid or uid == "default_user"
    ]
    return results
