from typing import List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Response
from app.services.database import db_manager
from app.services.pdf_generator import ReportLabPDFGenerator

router = APIRouter(prefix="/api", tags=["Reports"])

@router.get("/reports/{report_id}")
async def get_report_by_id(report_id: str):
    report = db_manager.reports.get(report_id) or db_manager.screenings.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report with ID '{report_id}' not found.")
    return report

@router.get("/reports/user/{uid}")
async def get_user_reports(uid: str):
    results = [
        rep for rep in db_manager.screenings.values()
        if rep.get("userId") == uid or uid == "default_user"
    ]
    return results

@router.api_route("/reports/{report_id}/pdf", methods=["GET", "POST"])
async def generate_pdf_report(report_id: str):
    """
    Generates and returns the official 5-page ReportLab clinical PDF stream.
    Supports both GET and POST requests.
    """
    screening = db_manager.screenings.get(report_id)
    if not screening:
        # Fallback to demo report if arbitrary ID provided
        screening = list(db_manager.screenings.values())[0] if db_manager.screenings else {
            "id": report_id,
            "overallRisk": "Low",
            "scores": {"pd": 12.4, "ad": 14.8, "dysarthria": 8.2, "postStroke": 9.5},
            "features": {"jitter": 0.42, "shimmer": 2.15, "hnr": 24.2, "pauseRatio": 0.18},
            "userName": "Participant",
        }

    # Format patient name and clean filename
    user_name = screening.get("userName") or "Participant"
    first_name = user_name.split()[0] if user_name else "User"
    date_str = datetime.now().strftime("%Y%m%d")
    filename = f"NeuroVoice_Screening_{first_name}_{date_str}.pdf"

    patient_data = {
        "name": user_name,
        "uhid": f"NV-{screening.get('id', report_id)[-6:].upper()}",
        "location": "Regional Health Screening",
    }

    pdf_bytes = ReportLabPDFGenerator.generate_report_pdf(screening, patient_data)

    # Increment download counter if registered
    if report_id in db_manager.reports:
        db_manager.reports[report_id]["downloadCount"] = db_manager.reports[report_id].get("downloadCount", 0) + 1

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )

