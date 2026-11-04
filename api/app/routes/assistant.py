import os
import json
import ssl
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/assistant", tags=["AI Health Assistant"])

class ChatRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[Dict[str, Any]]] = []
    userContext: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    disclaimer: str = "This assistant provides general information only. Not a substitute for medical advice."

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    user_msg = req.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    user_context = req.userContext or req.context or {}
    age = user_context.get("age", "Unknown")
    sex = user_context.get("sex", "Unknown")
    role = user_context.get("role", "Screening participant")
    last_result = user_context.get("lastScreeningResult", "No prior screening recorded")

    context_str = f"Age: {age}, Biological Sex: {sex}, Role: {role}, Recent Result: {last_result}"

    system_prompt = (
        "You are the NeuroVoice health assistant — a friendly, calm, and knowledgeable AI that helps "
        "users understand neurological voice health. NeuroVoice screens for four conditions: "
        "Parkinson's disease, Alzheimer's disease, dysarthria, and post-stroke cognitive impairment. "
        "Always answer in simple language that a person with no medical background can understand. "
        "Never give a medical diagnosis. Always recommend seeing a neurologist for health concerns. "
        f"Keep answers under 100 words. If the user asks about their results, use this context: {context_str}. "
        "Respond in the same language the user writes in (Hindi or English)."
    )

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")

    if api_key and len(api_key.strip()) > 5:
        # Build contents array including previous conversation if provided
        contents = []
        if req.conversationHistory:
            for item in req.conversationHistory[-4:]:
                r = "user" if item.get("role") == "user" else "model"
                t = item.get("content") or item.get("text") or ""
                if t:
                    contents.append({"role": r, "parts": [{"text": t}]})

        contents.append({
            "role": "user",
            "parts": [{"text": f"{system_prompt}\n\nUser Question: {user_msg}"}]
        })

        # Models to try in priority order
        candidate_models = [
            "gemini-3.6-flash",
            "gemini-3.7-flash",
            "gemini-3.8-flash",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-pro"
        ]

        # SSL context with fallback for local dev environments
        ssl_ctx = ssl.create_default_context()
        try:
            import certifi
            ssl_ctx.load_verify_locations(certifi.where())
        except Exception:
            ssl_ctx = ssl._create_unverified_context()

        for model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "contents": contents,
                "generationConfig": {
                    "maxOutputTokens": 200,
                    "temperature": 0.4
                }
            }
            try:
                req_data = json.dumps(payload).encode("utf-8")
                api_req = urllib.request.Request(
                    url,
                    data=req_data,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(api_req, context=ssl_ctx, timeout=8.0) as resp:
                    result_json = json.loads(resp.read().decode("utf-8"))
                    candidates = result_json.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        text_parts = [p.get("text", "") for p in parts if "text" in p]
                        combined_text = "".join(text_parts).strip()
                        if combined_text:
                            return ChatResponse(reply=combined_text)
            except Exception as e:
                # Try next model or fallback
                continue

    # Clinical fallback response when offline or before API key responds
    lower_msg = user_msg.lower()
    is_hindi = any("\u0900" <= ch <= "\u097F" for ch in user_msg) or "namaste" in lower_msg or "hindi" in lower_msg

    if "parkinson" in lower_msg:
        if is_hindi:
            reply = (
                "पार्किंसंस रोग मस्तिष्क की गति-नियंत्रण कोशिकाओं को प्रभावित करता है। "
                "आवाज़ में हल्का कंपन (कम्पन), आवाज़ का धीमा होना और एकरस बोलना इसके शुरुआती संकेत हो सकते हैं। "
                "NeuroVoice इन सूक्ष्म परिवर्तनों को मापता है। निश्चित जांच के लिए कृपया न्यूरोलॉजिस्ट से मिलें।"
            )
        else:
            reply = (
                "Parkinson's disease affects brain pathways controlling movement. "
                "Early voice signs often include a softer volume (hypophonia), subtle vocal fold tremors, and reduced pitch inflection. "
                "NeuroVoice screens for these microscopic acoustic shifts. For definitive clinical evaluation, always consult a certified neurologist."
            )
    elif "result" in lower_msg or "mean" in lower_msg:
        if is_hindi:
            reply = (
                "आपके परिणाम आपकी आवाज़ के कंपन, ठहराव और स्पष्टता की तुलना मानक स्वस्थ तालिकाओं से करते हैं। "
                "'Low' जोखिम का अर्थ है सामान्य सीमा। 'Moderate' या 'Elevated' होने पर डॉक्टर से परामर्श करना उचित है।"
            )
        else:
            reply = (
                "Your screening results compare your vocal steadiness, conversational pauses, and speech clarity against healthy baselines. "
                "A 'Low' reading indicates expected acoustic stability. A 'Moderate' or 'Elevated' flag highlights subtle patterns you should review with your doctor."
            )
    elif "dysarthria" in lower_msg:
        if is_hindi:
            reply = (
                "डिस्आर्थ्रिया बोलने वाली मांसपेशियों (होंठ, जीभ, स्वर रज्जु) की कमजोरी के कारण होता है। "
                "इससे शब्द अस्पष्ट या लड़खड़ाते हुए लग सकते हैं। स्पीच थेरेपिस्ट और न्यूरोलॉजिस्ट इसमें मदद कर सकते हैं।"
            )
        else:
            reply = (
                "Dysarthria is a motor speech condition caused by muscle weakness or lack of coordination in the lips, tongue, or vocal folds. "
                "It often leads to slurred consonants or irregular speech timing. A neurologist and speech therapist can provide guidance and rehabilitation."
            )
    elif "doctor" in lower_msg or "specialist" in lower_msg or "should i see" in lower_msg:
        if is_hindi:
            reply = (
                "यदि आपको बोलने में कोई नया बदलाव, कंपन या कमजोरी महसूस हो रही है, तो न्यूरोलॉजिस्ट से मिलना सबसे सुरक्षित कदम है। "
                "NeuroVoice केवल स्क्रीनिंग सहायता देता है, डॉक्टर का विकल्प नहीं है।"
            )
        else:
            reply = (
                "If you or family members notice ongoing changes in your voice loudness, clarity, or steadiness, seeing a neurologist is always recommended. "
                "NeuroVoice provides screening information to support, not replace, a physician's clinical assessment."
            )
    elif "improve" in lower_msg or "health" in lower_msg:
        if is_hindi:
            reply = (
                "आवाज़ के स्वास्थ्य के लिए पर्याप्त पानी पिएं, गहरी सांस लेकर बोलने का अभ्यास करें और गले को अकारण खंखारने से बचें। "
                "यदि कोई समस्या बनी रहती है, तो स्पीच-लैंग्वेज पैथोलॉजिस्ट से मार्गदर्शन लें।"
            )
        else:
            reply = (
                "To support vocal health: stay hydrated, practice diaphragmatic breathing, and avoid excessive throat-clearing. "
                "Gentle daily reading aloud also keeps vocal articulators engaged. Consult an SLP specialist for personalized vocal therapy."
            )
    else:
        if is_hindi:
            reply = (
                "नमस्ते! मैं NeuroVoice स्वास्थ्य सहायक हूँ। मैं पार्किंसंस, अल्जाइमर, डिस्आर्थ्रिया और स्ट्रोक से जुड़े आवाज़ के लक्षणों को समझने में आपकी मदद कर सकता हूँ। "
                "आप अपनी आवाज़ या किसी स्थिति के बारे में क्या जानना चाहते हैं?"
            )
        else:
            reply = (
                "Hello! I am your NeuroVoice health assistant. I can explain vocal biomarkers and neurological conditions like Parkinson's, Alzheimer's, dysarthria, and post-stroke speech recovery. "
                "What would you like to know about your voice or health today?"
            )

    return ChatResponse(reply=reply)
