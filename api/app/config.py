import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

PORT: int = int(os.getenv("PORT", 8000))
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
MONGODB_URI: str = os.getenv("MONGODB_URI", "")
DATABASE_NAME: str = os.getenv("DATABASE_NAME", "neurovoice")
CORS_ORIGINS: List[str] = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "neurovoice-3c2c7")
GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service-account.json")

# Initialize Firebase Admin SDK if service account file exists
try:
    import firebase_admin
    from firebase_admin import credentials

    cred_path = GOOGLE_APPLICATION_CREDENTIALS
    if not os.path.isabs(cred_path):
        api_dir = os.path.dirname(os.path.dirname(__file__))
        root_dir = os.path.dirname(api_dir)
        if os.path.exists(os.path.join(api_dir, cred_path)):
            cred_path = os.path.join(api_dir, cred_path)
        elif os.path.exists(os.path.join(root_dir, cred_path)):
            cred_path = os.path.join(root_dir, cred_path)
        else:
            cred_path = os.path.join(api_dir, cred_path)
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully.")
    else:
        print(f"Service account file not found at {cred_path}. Operating in mock dev auth mode.")
except Exception as e:
    print(f"Firebase Admin initialization note: {e}")
