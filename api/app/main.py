from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS, ENVIRONMENT, PORT
from app.services.database import db_manager

# Import API routes
from app.routes.analyse import router as analyse_router
from app.routes.reports import router as reports_router
from app.routes.patients import router as patients_router
from app.routes.appointments import router as appointments_router
from app.routes.doctors import router as doctors_router
from app.routes.admin import router as admin_router

app = FastAPI(
    title="NeuroVoice API",
    description="Vocal neurological biomarker research and screening support pipeline.",
    version="2.4.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await db_manager.connect()

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "NeuroVoice FastAPI AI Backend",
        "version": "2.4.0",
        "initiative": "Public Neurological Screening Support",
        "environment": ENVIRONMENT,
        "databaseConnected": db_manager.is_connected,
    }

# Register all Routers
app.include_router(analyse_router)
app.include_router(reports_router)
app.include_router(patients_router)
app.include_router(appointments_router)
app.include_router(doctors_router)
app.include_router(admin_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
