from typing import List
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

@router.post("/reports/{report_id}/pdf")
async def generate_pdf_report(report_id: str):
    """
    Generates and returns the official 5-page ReportLab clinical PDF stream.
    """
    screening = db_manager.screenings.get(report_id)
    if not screening:
        # Fallback to demo report if arbitrary ID provided
        screening = list(db_manager.screenings.values())[0]

    patient_data = {
        "name": "Rameshwar Patel",
        "uhid": "JMC-2026-8812",
        "location": "Jabalpur Rural",
    }

    pdf_bytes = ReportLabPDFGenerator.generate_report_pdf(screening, patient_data)

    # Increment download counter if registered
    if report_id in db_manager.reports:
        db_manager.reports[report_id]["downloadCount"] = db_manager.reports[report_id].get("downloadCount", 0) + 1

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=NeuroVoice_Report_{report_id}.pdf"
        },
    )
