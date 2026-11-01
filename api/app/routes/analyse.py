import uuid
import os
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from app.models.schemas import AnalysisResponse, RiskScores
from app.pipeline.acoustic import RealAcousticPipeline
from app.services.database import db_manager

router = APIRouter(prefix="/api", tags=["Analysis"])
pipeline = RealAcousticPipeline()

ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".webm", ".ogg"}
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB

@router.post("/analyse")
async def analyse_voice_recording(
    audio: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None),
    language: str = Form("hi"),
    user_id: Optional[str] = Form("default_user"),
    userId: Optional[str] = Form(None),
    age: int = Form(45),
    gender: str = Form("unspecified"),
    prompt_type: str = Form("sustained_vowel"),
    opt_in_store_audio: bool = Form(False),
):
    """
    Receives voice audio, runs 9-stage acoustic signal pipeline (Librosa + Parselmouth + SHAP),
    and returns multi-disorder research risk scores with explainability.
    """
    upload = audio or file
    if not upload:
        raise HTTPException(status_code=400, detail="Missing audio file payload.")

    # 1. Validate file extension
    ext = os.path.splitext(upload.filename or "")[1].lower()
    if ext and ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # 2. Read and validate file size
    audio_bytes = await upload.read()
    if len(audio_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Audio file exceeds 10MB limit.")
    if len(audio_bytes) < 100:
        raise HTTPException(status_code=400, detail="Audio file is empty or corrupted.")

    effective_uid = userId or user_id or "default_user"

    # 3. Process through Real Acoustic Pipeline
    try:
        results = pipeline.process_audio(
            audio_bytes=audio_bytes,
            filename=upload.filename or "recording.wav",
            language=language,
            age=age,
            gender=gender,
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Acoustic analysis error: {str(e)}")

    # 4. Immediate disposal of raw audio bytes unless user opted in
    if not opt_in_store_audio:
        del audio_bytes

    screening_id = f"scr-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.utcnow().isoformat() + "Z"

    risk_data = results["risk_scores"]
    scores = RiskScores(
        pd=risk_data.get("pd", 10.0),
        ad=risk_data.get("ad", 12.0),
        dysarthria=risk_data.get("dysarthria", 8.0),
        postStroke=risk_data.get("post_stroke", 6.0),
    )

    highest_risk = max(scores.pd, scores.ad, scores.dysarthria, scores.postStroke)
    if highest_risk < 30.0:
        verdict = "Low Acoustic Deviation"
        rec = "Routine periodic wellness screening recommended. No acute vocal markers detected."
    elif highest_risk < 60.0:
        verdict = "Moderate Vocal Biomarker Perturbation"
        rec = f"Consultation recommended: {results['recommended_specialist']}."
    else:
        verdict = "Elevated Acoustic Biomarker Perturbation"
        rec = f"Prioritized clinical consultation advised: {results['recommended_specialist']}."

    record = {
        "id": screening_id,
        "userId": effective_uid,
        "timestamp": now_iso,
        "language": language,
        "duration": results["quality"]["duration"],
        "qualityScore": results["quality"]["score"],
        "snrDb": results["quality"]["snr"],
        "qualityFlag": results["quality"]["flag"],
        "emotionFlag": results["emotion_flag"],
        "emotionWarning": "Elevated acoustic arousal detected. Results may be influenced by situational stress." if results["emotion_flag"] else None,
        "riskScores": scores.dict(),
        "topShapFeatures": results["shap_values"],
        "voiceProfile": results["radar"],
        "featureVector": results["features"],
        "summaryVerdict": verdict,
        "recommendation": rec,
        "specialist": results["recommended_specialist"],
        "disclaimer": results["disclaimer"],
    }

    # Save to MongoDB or in-memory fallback
    await db_manager.save_screening(record)

    return record
