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
    disorder: str
    dateTime: str
    notes: Optional[str] = None

class AppointmentModel(BaseModel):
    id: str
    userId: str
    doctorId: str
    doctorName: str
    doctorSpecialty: str
    hospital: str
    disorder: str
    dateTime: str
    status: str  # "Upcoming" | "Completed" | "Cancelled"
    notes: Optional[str] = None
    referenceNumber: str
    createdAt: str

class DoctorModel(BaseModel):
    id: str
    name: str
    specialty: str
    hospital: str
    city: str
    phone: str
    languages: List[str]
    photoURL: Optional[str] = None
    available: bool = True
    distanceKm: Optional[float] = None

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
