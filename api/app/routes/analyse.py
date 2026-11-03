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
    task_a: Optional[UploadFile] = File(None),
    task_b: Optional[UploadFile] = File(None),
    task_c: Optional[UploadFile] = File(None),
    taskA: Optional[UploadFile] = File(None),
    taskB: Optional[UploadFile] = File(None),
    taskC: Optional[UploadFile] = File(None),
    language: str = Form("hi"),
    user_id: Optional[str] = Form("default_user"),
    userId: Optional[str] = Form(None),
    userName: Optional[str] = Form(None),
    user_name: Optional[str] = Form(None),
    age: int = Form(45),
    gender: str = Form("unspecified"),
    prompt_type: str = Form("sustained_vowel"),
    opt_in_store_audio: bool = Form(False),
):
    """
    Receives voice audio (either 3 sequential tasks task_a/task_b/task_c or a single recording),
    runs 9-stage acoustic signal pipeline (Librosa + Parselmouth + SHAP),
    and returns multi-disorder research risk scores with explainability.
    """
    effective_task_a = task_a or taskA
    effective_task_b = task_b or taskB
    effective_task_c = task_c or taskC

    is_multi_task = bool(effective_task_a and effective_task_b and effective_task_c)

    if not is_multi_task:
        upload = audio or file or effective_task_a
        if not upload:
            raise HTTPException(status_code=400, detail="Missing audio file payload. Provide task_a, task_b, task_c or a single audio file.")
        
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

        if not opt_in_store_audio:
            del audio_bytes
    else:
        # Multi-task processing: Task A (vowel), Task B (reading), Task C (monologue)
        bytes_a = await effective_task_a.read()
        bytes_b = await effective_task_b.read()
        bytes_c = await effective_task_c.read()

        for name, b in [("Task A", bytes_a), ("Task B", bytes_b), ("Task C", bytes_c)]:
            if len(b) > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail=f"{name} audio exceeds 10MB limit.")
            if len(b) < 100:
                raise HTTPException(status_code=400, detail=f"{name} audio file is empty or corrupted.")

        try:
            results = pipeline.process_three_tasks(
                audio_a=bytes_a,
                audio_b=bytes_b,
                audio_c=bytes_c,
                language=language,
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Multi-task acoustic analysis error: {str(e)}")

        if not opt_in_store_audio:
            del bytes_a
            del bytes_b
            del bytes_c

    screening_id = f"scr-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.utcnow().isoformat() + "Z"
    effective_uid = userId or user_id or "default_user"
    effective_name = userName or user_name or "Participant"

    risk_data = results["risk_scores"]
    scores = RiskScores(
        pd=risk_data.get("pd", 10.0),
        ad=risk_data.get("ad", 12.0),
        dysarthria=risk_data.get("dysarthria", 8.0),
        postStroke=risk_data.get("post_stroke", 6.0),
    )

    highest_risk = max(scores.pd, scores.ad, scores.dysarthria, scores.postStroke)
    if highest_risk < 26.0:
        verdict = "Low Acoustic Deviation"
        rec = "Routine periodic wellness screening recommended. No acute vocal markers detected."
    elif highest_risk < 51.0:
        verdict = "Moderate Vocal Biomarker Perturbation"
        rec = f"Consultation recommended: {results.get('recommended_specialist', 'Neurologist')}."
    else:
        verdict = "Elevated Acoustic Biomarker Perturbation"
        rec = f"Prioritized clinical consultation advised: {results.get('recommended_specialist', 'Neurologist')}."

    record = {
        "id": screening_id,
        "userId": effective_uid,
        "userName": effective_name,
        "timestamp": now_iso,
        "language": language,
        "duration": results["quality"]["duration"],
        "qualityScore": results["quality"]["score"],
        "snrDb": results["quality"]["snr"],
        "qualityFlag": results["quality"]["flag"],
        "bands": results.get("bands", {}),
        "confidence": results.get("confidence", "medium"),
        "isInconclusive": results.get("isInconclusive", False),
        "emotionFlag": results.get("emotion_flag", False),
        "emotionWarning": "Elevated acoustic arousal detected. Results may be influenced by situational stress." if results.get("emotion_flag") else None,
        "riskScores": scores.dict(),
        "topShapFeatures": results["shap_values"],
        "voiceProfile": results.get("radar") or pipeline._generate_radar_profile(results["features"]),
        "featureVector": results["features"],
        "summaryVerdict": verdict,
        "recommendation": rec,
        "specialist": results.get("recommended_specialist", "Neurologist"),
        "suggestions": results.get("suggestions", {}),
        "disclaimer": results.get("disclaimer", "NeuroVoice provides screening indications, not a medical diagnosis."),
        "tasks": results.get("tasks", None),
    }

    # Save to MongoDB or in-memory fallback
    await db_manager.save_screening(record)

    return record
