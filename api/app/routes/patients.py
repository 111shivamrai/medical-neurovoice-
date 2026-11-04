from fastapi import APIRouter
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Patients & Users"])

class PatientUpdateModel(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None

class UserCreateModel(BaseModel):
    uid: str
    name: str
    email: Optional[str] = None
    dob: Optional[str] = None
    sex: Optional[str] = None
    role: Optional[str] = None
    photoURL: Optional[str] = None
    createdAt: Optional[str] = None
    onboardingComplete: bool = True

@router.get("/users/{uid}")
async def get_user_by_uid(uid: str):
    if not uid or uid.strip() in ("", "undefined", "null"):
        return {"exists": False, "user": None}

    user_data = None
    if db_manager.is_connected and db_manager.db is not None:
        try:
            user_data = db_manager.db.users.find_one({"uid": uid}, {"_id": 0})
        except Exception:
            pass

    if not user_data:
        user_data = db_manager.users.get(uid)

    if user_data:
        return {"exists": True, "user": user_data}
    return {"exists": False, "user": None}

@router.post("/users/create")
async def create_user(payload: UserCreateModel):
    user_dict = payload.dict()
    if not user_dict.get("createdAt"):
        user_dict["createdAt"] = datetime.utcnow().isoformat() + "Z"

    # Save to in-memory store
    db_manager.users[payload.uid] = user_dict

    # Save to MongoDB users collection
    if db_manager.is_connected and db_manager.db is not None:
        try:
            db_manager.db.users.update_one(
                {"uid": payload.uid},
                {"$set": user_dict},
                upsert=True
            )
        except Exception as e:
            print("MongoDB save user exception:", e)

    return {"status": "success", "user": user_dict}

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
            # Exclude any legacy demo screenings (Fix 6)
            screenings = list(
                db_manager.db.screenings.find(
                    {"userId": uid, "isDemo": {"$ne": True}},
                    {"_id": 0}
                ).sort("timestamp", -1)
            )
        except Exception:
            pass

    if not screenings:
        screenings = [
            s for s in db_manager.screenings.values()
            if s.get("userId") == uid and not s.get("isDemo")
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

    # Display name priority order (Fix 6, Fix 10):
    # 1. user.displayName, 2. users.name, 3. email prefix
    email = user_data.get("email") or ""
    email_prefix = email.split("@")[0] if "@" in email else None
    resolved_name = user_data.get("displayName") or user_data.get("name") or email_prefix or "Screening Participant"

    return {
        "uid": uid,
        "name": resolved_name,
        "email": user_data.get("email"),
        "gender": user_data.get("gender") or user_data.get("sex") or "Prefer not to say",
        "location": user_data.get("location") or "Madhya Pradesh, India",
        "bio": user_data.get("bio") or "", # Truly empty for new users (Fix 10)
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
    if payload.bio is not None:
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
