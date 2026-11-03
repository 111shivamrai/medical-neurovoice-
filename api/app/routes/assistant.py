import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/assistant", tags=["AI Health Assistant"])

class ChatContext(BaseModel):
    conditions: Optional[List[str]] = []
    age: Optional[int] = 50
    language: Optional[str] = "English"

class ChatRequest(BaseModel):
    message: str
    context: Optional[ChatContext] = None

class ChatResponse(BaseModel):
    reply: str
    disclaimer: str = "This assistant provides general information only. It is not a doctor."

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    user_msg = req.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    ctx = req.context or ChatContext()
    lang = ctx.language or "English"
    conditions_str = ", ".join(ctx.conditions) if ctx.conditions else "None noted"

    system_prompt = (
        f"You are a friendly health information assistant for NeuroVoice, a neurological voice screening tool used in India. "
        f"You help users understand neurological conditions like Parkinson's disease, Alzheimer's disease, dysarthria, and post-stroke changes. "
        f"Always respond in {lang}. Be warm and clear. Never give a medical diagnosis. "
        f"Always recommend seeing a qualified neurologist for health concerns. Keep answers under 150 words. "
        f"If asked about the user's screening results, their context is: conditions={conditions_str}, age={ctx.age}."
    )

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")

    # Attempt calling official Gemini API if API key is present
    if api_key and len(api_key) > 10:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"System Instructions: {system_prompt}\n\nUser Question: {user_msg}"}],
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 250,
                "temperature": 0.4,
            },
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            api_req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(api_req, timeout=8.0) as resp:
                result_json = json.loads(resp.read().decode("utf-8"))
                candidates = result_json.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return ChatResponse(reply=parts[0]["text"].strip())
        except Exception as e:
            # Fall back to curated clinical knowledge responses if API call encounters network/quota limits
            print(f"[NeuroVoice AI Assistant] Gemini API notice: {e}. Using verified clinical knowledge base fallback.")

    # High-quality verified clinical knowledge base fallback
    lower_msg = user_msg.lower()
    if "parkinson" in lower_msg:
        if lang.lower().startswith("hi"):
            reply = (
                "पार्किंसंस रोग मस्तिष्क की तंत्रिका कोशिकाओं (डोपामाइन न्यूरॉन्स) को प्रभावित करता है। "
                "शुरुआती लक्षणों में आवाज में धीमापन (कम आवाज़), कंपन, मांसपेशियों में जकड़न और चाल में धीमापन शामिल हैं। "
                "NeuroVoice आवाज में सूक्ष्म कंपन (Jitter) की जांच करता है। उचित मूल्यांकन के लिए कृपया एक योग्य न्यूरोलॉजिस्ट से परामर्श लें।"
            )
        else:
            reply = (
                "Parkinson's disease is a neurodegenerative condition affecting dopamine-producing brain cells. "
                "Early voice signs often include reduced vocal volume (hypophonia), subtle pitch tremor, and a flatter monotone cadence. "
                "NeuroVoice screens for these microscopic vocal fold tremors. If you have concerns, we encourage you to schedule an evaluation with a certified movement disorders neurologist."
            )
    elif "result" in lower_msg or "mean" in lower_msg:
        if lang.lower().startswith("hi"):
            reply = (
                f"NeuroVoice परिणाम आपकी आवाज के कंपन, ठहराव और स्पष्टता को सामान्य स्वास्थ्य मानकों से तुलना करते हैं। "
                f"वर्तमान प्रोफ़ाइल: {conditions_str}। 'Low' का अर्थ है सामान्य सीमा में; 'Moderate' या 'Elevated' का अर्थ है कि डॉक्टर को अपनी आवाज दिखाना उपयोगी रहेगा।"
            )
        else:
            reply = (
                f"Your NeuroVoice screening compares your vocal cord stability, conversational pauses, and speech cadence against peer-reviewed normative ranges. "
                f"Current profile context: {conditions_str}. A 'Low' band indicates measurements within typical baselines. 'Moderate' or 'Elevated' bands highlight subtle acoustic deviations worth discussing with your doctor."
            )
    elif "doctor" in lower_msg or "specialist" in lower_msg:
        if lang.lower().startswith("hi"):
            reply = (
                "यदि आप बोलने में कठिनाई, अचानक लड़खड़ाहट, या हाथों में कंपन महसूस कर रहे हैं, तो न्यूरोलॉजिस्ट से मिलना सबसे अच्छा कदम है। "
                "आप हमारे Care टैब में जाकर सत्यापित न्यूरोलॉजिस्ट देख सकते हैं।"
            )
        else:
            reply = (
                "If you notice ongoing changes in your voice volume, speech clarity, or limb tremors, seeing a neurologist is always recommended. "
                "NeuroVoice is an objective screening support tool to assist your consultation. You can view verified specialists in the 'Specialists' tab above."
            )
    elif "improve" in lower_msg or "exercise" in lower_msg or "health" in lower_msg:
        if lang.lower().startswith("hi"):
            reply = (
                "आवाज के स्वास्थ्य के लिए पर्याप्त पानी पिएं (हाइड्रेशन), गहरी सांस लेने के साथ 'आ...' ध्वनि का अभ्यास करें, और गले पर अधिक जोर न डालें। "
                "एक स्पीच थेरेपिस्ट (SLP) आपकी आवाज के अनुसार विशेष व्यायाम बता सकते हैं।"
            )
        else:
            reply = (
                "To support vocal health: stay well hydrated, practice diaphragmatic breathing, and perform daily sustained vowel phonation exercises. "
                "Avoid clearing your throat harshly. A certified Speech-Language Pathologist (SLP) can design vocal strengthening exercises tailored specifically to your speech pattern."
            )
    else:
        if lang.lower().startswith("hi"):
            reply = (
                "मैं NeuroVoice स्वास्थ्य सहायक हूँ। मैं तंत्रिका संबंधी स्थितियों जैसे पार्किंसंस, अल्जाइमर, डिस्आर्थ्रिया और स्ट्रोक के बारे में जानकारी दे सकता हूँ। "
                "कृपया ध्यान दें कि यह निदान नहीं है; किसी भी स्वास्थ्य समस्या के लिए कृपया डॉक्टर से परामर्श लें।"
            )
        else:
            reply = (
                "I am here to help you understand neurological speech biomarkers and conditions like Parkinson's disease, Alzheimer's disease, dysarthria, and post-stroke speech recovery. "
                "Always remember that NeuroVoice provides acoustic screening support, not a clinical diagnosis. Please consult a qualified neurologist for personal medical care."
            )

    return ChatResponse(reply=reply)
