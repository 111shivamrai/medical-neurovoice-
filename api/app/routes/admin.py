import io
import csv
from datetime import datetime
from fastapi import APIRouter, Response, HTTPException, Header
from typing import Optional
from app.services.database import db_manager

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/export")
async def export_anonymised_data(authorization: Optional[str] = Header(None)):
    """
    Exports anonymised clinical research dataset in CSV format.
    DPDP Compliant: No names, no emails, no raw audio, no PII.
    Only: Date, Language, Quality Score, Risk Scores (PD, AD, Dysarthria, Stroke), and Extracted Biomarkers.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    # Header Row
    writer.writerow([
        "screening_id",
        "timestamp",
        "language",
        "duration_seconds",
        "quality_score",
        "snr_db",
        "emotion_flag",
        "risk_parkinsons_score",
        "risk_alzheimers_score",
        "risk_dysarthria_score",
        "risk_post_stroke_score",
        "jitter_local_percent",
        "shimmer_local_percent",
        "hnr_db",
        "speech_rate_sps",
        "pause_ratio",
    ])

    for screening in db_manager.screenings.values():
        risks = screening.get("riskScores", {})
        features = screening.get("featureVector", {})

        writer.writerow([
            screening.get("id"),
            screening.get("timestamp"),
            screening.get("language"),
            screening.get("duration", 30.0),
            screening.get("qualityScore", 95.0),
            screening.get("snrDb", 28.0),
            1 if screening.get("emotionFlag") else 0,
            risks.get("pd", 0.0),
            risks.get("ad", 0.0),
            risks.get("dysarthria", 0.0),
            risks.get("postStroke", 0.0),
            features.get("jitter_local_percent", 0.0),
            features.get("shimmer_local_percent", 0.0),
            features.get("hnr_db", 0.0),
            features.get("speech_rate_sps", 0.0),
            features.get("pause_ratio", 0.0),
        ])

    csv_content = output.getvalue()
    output.close()

    filename = f"neurovoice_anonymised_research_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        },
    )
