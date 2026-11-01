from typing import List, Optional
from fastapi import APIRouter, Query
from app.models.schemas import DoctorModel
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Doctors"])

@router.get("/doctors", response_model=List[DoctorModel])
async def list_doctors(
    specialty: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
):
    results = list(db_manager.doctors.values())

    if specialty:
        results = [d for d in results if specialty.lower() in d["specialty"].lower()]

    if city:
        results = [d for d in results if city.lower() in d["city"].lower()]

    if language:
        results = [d for d in results if any(language.lower() in lang.lower() for lang in d.get("languages", []))]

    return [DoctorModel(**d) for d in results]
