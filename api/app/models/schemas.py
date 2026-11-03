from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RiskScores(BaseModel):
    pd: float = Field(..., description="Parkinson's Disease Risk (0-100)")
    ad: float = Field(..., description="Alzheimer's Disease Risk (0-100)")
    dysarthria: float = Field(..., description="Dysarthria Risk (0-100)")
    postStroke: float = Field(..., description="Post-Stroke Impairment Risk (0-100)")

class FeatureContribution(BaseModel):
    feature: str
    contribution: float  # Positive = raises risk, Negative = lowers risk
    direction: str       # "raises_risk" or "lowers_risk"
    description: str

class VoiceProfileAxis(BaseModel):
    axis: str
    patientValue: float
    healthyAverage: float

class AnalysisResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    timestamp: str
    language: str
    duration: float
    qualityScore: float
    snrDb: float
    emotionFlag: bool
    emotionWarning: Optional[str] = None
    riskScores: RiskScores
    topShapFeatures: List[FeatureContribution]
    voiceProfile: List[VoiceProfileAxis]
    featureVector: Dict[str, float]
    summaryVerdict: str
    recommendation: str

class ReportModel(BaseModel):
    id: str
    screeningId: str
    userId: str
    patientName: str
    generatedAt: str
    downloadCount: int = 0
    riskScores: RiskScores
    summaryVerdict: str
    recommendation: str

class AppointmentCreate(BaseModel):
    userId: str
    doctorId: str
    disorder: Optional[str] = "Neurological Voice Screening Follow-up"
    dateTime: str
    notes: Optional[str] = None
    reportAttached: Optional[str] = "NV-Screening-Latest.pdf"

class AppointmentModel(BaseModel):
    id: str
    userId: str
    doctorId: str
    doctorName: str
    doctorSpecialty: str
    hospital: str
    disorder: str
    dateTime: str
    status: str = "Awaiting clinic confirmation"  # "Awaiting clinic confirmation" | "Confirmed" | "Cancelled"
    notes: Optional[str] = None
    phone: Optional[str] = "Contact via hospital"
    referenceNumber: str
    reportAttached: Optional[str] = None
    createdAt: str

class DoctorModel(BaseModel):
    id: Optional[str] = None
    name: str
    speciality: Optional[str] = "Neurology"
    specialty: Optional[str] = "Neurology"
    qualification: Optional[str] = None
    registration: Optional[str] = None
    hospital: str
    address: str = "Jabalpur"
    city: str = "Jabalpur"
    lat: Optional[float] = None
    lng: Optional[float] = None
    phone: str = "Contact via hospital"
    languages: List[str] = ["Hindi", "English"]
    experience_years: Optional[int] = 10
    conditions_treated: List[str] = []
    available: bool = True
    verified: bool = True
    source_url: Optional[str] = None
    sourceUrl: Optional[str] = None
    sourceName: Optional[str] = None
    distanceKm: Optional[float] = None
    fee: Optional[int] = 500

class NotificationModel(BaseModel):
    id: str
    userId: str
    type: str
    title: str
    message: str
    link: Optional[str] = None
    read: bool = False
    createdAt: str

class PatientHistoryModel(BaseModel):
    uid: str
    name: str
    totalScreenings: int
    currentRiskLevel: str
    lastScreeningDate: Optional[str] = None
    screenings: List[Dict[str, Any]]
