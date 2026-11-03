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
    doctor_specialty = doctor.get("speciality") or doctor.get("specialty") or "Neurology"
    hospital = doctor["hospital"] if doctor else "Regional Specialty Centre"
    phone = doctor.get("phone", "Contact via hospital")

    apt_id = f"apt-{uuid.uuid4().hex[:6]}"
    ref_num = f"NV-APT-{uuid.uuid4().int % 90000 + 10000}"
    created_at = datetime.utcnow().isoformat() + "Z"

    record = {
        "id": apt_id,
        "userId": payload.userId,
        "doctorId": payload.doctorId,
        "doctorName": doctor_name,
        "doctorSpecialty": doctor_specialty,
        "hospital": hospital,
        "phone": phone,
        "disorder": payload.disorder or "Neurological Voice Screening Follow-up",
        "dateTime": payload.dateTime,
        "status": "Awaiting clinic confirmation",
        "notes": payload.notes,
        "referenceNumber": ref_num,
        "reportAttached": payload.reportAttached or "NV-Screening-Latest.pdf",
        "createdAt": created_at,
    }

    if db_manager.is_connected and db_manager.db is not None:
        try:
            db_manager.db.appointments.insert_one(dict(record))
        except Exception:
            pass

    db_manager.appointments[apt_id] = record
    return AppointmentModel(**record)

@router.get("/appointments/{uid}", response_model=List[AppointmentModel])
async def list_user_appointments(uid: str):
    if not uid or uid.strip() in ("", "undefined", "null"):
        return []

    if db_manager.is_connected and db_manager.db is not None:
        try:
            cursor = db_manager.db.appointments.find({"userId": uid})
            return [AppointmentModel(**doc) for doc in cursor]
        except Exception:
            pass

    # Strictly filter by current user's uid only
    results = [
        AppointmentModel(**a) for a in db_manager.appointments.values()
        if a.get("userId") == uid
    ]
    return results

@router.delete("/appointments/{apt_id}")
async def cancel_appointment(apt_id: str):
    if db_manager.is_connected and db_manager.db is not None:
        try:
            db_manager.db.appointments.delete_one({"id": apt_id})
        except Exception:
            pass

    if apt_id in db_manager.appointments:
        del db_manager.appointments[apt_id]

    return {"status": "success", "message": "Appointment cancelled successfully"}
