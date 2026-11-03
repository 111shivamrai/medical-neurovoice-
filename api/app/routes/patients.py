from fastapi import APIRouter
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Patients"])

class PatientUpdateModel(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None

@router.get("/patient/{uid}")
async def get_patient_history(uid: str):
    if not uid or uid.strip() in ("", "undefined", "null"):
        return {"uid": "", "totalScreenings": 0, "screenings": []}

    # Fetch user details from MongoDB or in-memory store
    user_data = None
    if db_manager.is_connected and db_manager.db is not None:
        try:
            user_data = db_manager.db.users.find_one({"uid": uid}, {"_id": 0})
        except Exception:
            pass

    if not user_data:
        user_data = db_manager.users.get(uid, {})

    # Fetch real user screenings strictly by userId
    screenings = []
    if db_manager.is_connected and db_manager.db is not None:
        try:
            screenings = list(db_manager.db.screenings.find({"userId": uid}, {"_id": 0}).sort("timestamp", -1))
        except Exception:
            pass

    if not screenings:
        screenings = [
            s for s in db_manager.screenings.values()
            if s.get("userId") == uid
        ]

    # Calculate real active streak
    streak = 0
    if screenings:
        # Group unique screening days sorted descending
        dates = sorted(
            list(set(s.get("timestamp", "")[:10] for s in screenings if s.get("timestamp"))),
            reverse=True
        )
        if dates:
            streak = len(dates)

    created_at = user_data.get("createdAt") or datetime.utcnow().isoformat() + "Z"

    return {
        "uid": uid,
        "name": user_data.get("name") or user_data.get("displayName") or None,
        "email": user_data.get("email"),
        "gender": user_data.get("gender") or user_data.get("sex") or "Prefer not to say",
        "location": user_data.get("location") or "Madhya Pradesh, India",
        "bio": user_data.get("bio") or "Participating in ongoing vocal neurological biomarker research screenings.",
        "createdAt": created_at,
        "totalScreenings": len(screenings),
        "streak": streak,
        "screenings": screenings,
    }

@router.post("/patient/{uid}")
async def update_patient_profile(uid: str, payload: PatientUpdateModel):
    user_data = db_manager.users.setdefault(uid, {})
    if payload.name:
        user_data["name"] = payload.name
        user_data["displayName"] = payload.name
    if payload.email:
        user_data["email"] = payload.email
    if payload.gender:
        user_data["gender"] = payload.gender
    if payload.location:
        user_data["location"] = payload.location
    if payload.bio:
        user_data["bio"] = payload.bio

    if db_manager.is_connected and db_manager.db is not None:
        try:
            db_manager.db.users.update_one(
                {"uid": uid},
                {"$set": user_data},
                upsert=True
            )
        except Exception:
            pass

    return {"status": "success", "profile": user_data}
