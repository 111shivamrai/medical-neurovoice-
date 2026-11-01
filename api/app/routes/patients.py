from fastapi import APIRouter
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Patients"])

@router.get("/patient/{uid}")
async def get_patient_history(uid: str):
    screenings = [
        s for s in db_manager.screenings.values()
        if s.get("userId") == uid or uid == "default_user"
    ]

    return {
        "uid": uid,
        "name": "Rameshwar Patel",
        "age": 64,
        "gender": "Male",
        "location": "Sehora, Jabalpur District, Madhya Pradesh",
        "totalScreenings": len(screenings),
        "currentRiskLevel": "Low",
        "lastScreeningDate": screenings[0]["timestamp"] if screenings else "2026-10-31T00:30:00Z",
        "screenings": screenings,
    }
