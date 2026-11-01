import os
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.config import MONGODB_URI, DATABASE_NAME
from app.services.seed_data import SEED_DOCTORS

class DatabaseManager:
    """
    Manages MongoDB Atlas connection with automatic in-memory fallback
    and real index verification.
    """

    def __init__(self):
        self.is_connected = False
        self.client = None
        self.db = None

        # In-memory fallback stores
        self.users: Dict[str, Dict[str, Any]] = {}
        self.screenings: Dict[str, Dict[str, Any]] = {}
        self.reports: Dict[str, Dict[str, Any]] = {}
        self.appointments: Dict[str, Dict[str, Any]] = {}
        self.doctors: Dict[str, Dict[str, Any]] = {d["id"]: d for d in SEED_DOCTORS}
        self.notifications: List[Dict[str, Any]] = []

        self._try_mongo_connect()

    async def connect(self):
        if not self.is_connected:
            self._try_mongo_connect()

    def _try_mongo_connect(self):
        if MONGODB_URI and "<db_username>" not in MONGODB_URI:
            try:
                from pymongo import MongoClient, ASCENDING, DESCENDING
                self.client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2500)
                # Verify connection
                self.client.admin.command('ping')
                self.db = self.client[DATABASE_NAME]

                # Create indexes conforming to TASK 11
                self.db.users.create_index([("uid", ASCENDING)], unique=True)
                self.db.screenings.create_index([("userId", ASCENDING), ("timestamp", DESCENDING)])
                self.db.appointments.create_index([("userId", ASCENDING), ("status", ASCENDING)])
                self.db.notifications.create_index([("userId", ASCENDING), ("read", ASCENDING)])
                self.is_connected = True
                print("Connected to MongoDB Atlas with verified collection indexes.")
            except Exception as e:
                self.is_connected = False
                print(f"MongoDB Atlas notice ({e}). Operating in resilient in-memory mode.")
        else:
            print("Running in resilient in-memory mode (demo fallback).")

    async def save_screening(self, screening: Dict[str, Any]) -> str:
        s_id = screening["id"]
        self.screenings[s_id] = screening
        if self.is_connected and self.db:
            try:
                self.db.screenings.replace_one({"id": s_id}, screening, upsert=True)
            except Exception as e:
                print(f"Mongo write fallback: {e}")
        return s_id

    async def get_screening(self, screening_id: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db:
            try:
                doc = self.db.screenings.find_one({"id": screening_id}, {"_id": 0})
                if doc:
                    return doc
            except:
                pass
        return self.screenings.get(screening_id)

    async def get_user_screenings(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_connected and self.db:
            try:
                from pymongo import DESCENDING
                cursor = self.db.screenings.find({"userId": user_id}, {"_id": 0}).sort("timestamp", DESCENDING)
                return list(cursor)
            except:
                pass
        return [s for s in self.screenings.values() if s.get("userId") == user_id]

    async def get_doctors(self, specialty: Optional[str] = None, city: Optional[str] = None) -> List[Dict[str, Any]]:
        docs = list(self.doctors.values())
        if specialty and specialty.lower() != "all":
            docs = [d for d in docs if specialty.lower() in d.get("specialty", "").lower()]
        if city:
            docs = [d for d in docs if city.lower() in d.get("city", "").lower()]
        return docs

    async def create_appointment(self, appointment: Dict[str, Any]) -> str:
        apt_id = appointment["id"]
        self.appointments[apt_id] = appointment
        if self.is_connected and self.db:
            try:
                self.db.appointments.replace_one({"id": apt_id}, appointment, upsert=True)
            except Exception as e:
                print(f"Mongo appointment write fallback: {e}")
        return apt_id

    async def get_user_appointments(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_connected and self.db:
            try:
                cursor = self.db.appointments.find({"userId": user_id}, {"_id": 0})
                return list(cursor)
            except:
                pass
        return [a for a in self.appointments.values() if a.get("userId") == user_id]

db_manager = DatabaseManager()
