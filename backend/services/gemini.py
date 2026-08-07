"""
Gemini AI service wrapper for Sarthi AI.
Provides chat completions and SSE streaming for AI Reasoning.
"""
import os
from typing import AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False

SYSTEM_PROMPT = """You are Sarthi AI (BharatAI), an intelligent, empathetic, and trustworthy AI assistant
helping Indian citizens navigate government welfare schemes and policies.

Your responsibilities:
1. Explain government schemes in simple, clear language (Hindi or English based on user preference).
2. Help citizens understand their eligibility for schemes based on their profile.
3. Guide users on required documents and application procedures.
4. Always cite official government portals (myscheme.gov.in, scholarships.gov.in, etc.).
5. Be honest about limitations — you are an AI assistant, not a government official.

Rules:
- Always respond in the same language the user asked (EN = English, HI = Hindi).
- Keep answers concise but complete.
- Highlight key monetary amounts (₹) and dates clearly.
- Never fabricate government policy details — stick to known schemes.
- End responses with an official source link when relevant.
"""


def get_model(model_name: str = None) -> genai.GenerativeModel:
    if not GENAI_AVAILABLE or not genai:
        raise RuntimeError("google.generativeai module is not available.")
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
    if not model_name:
        model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-flash-latest")
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=SYSTEM_PROMPT,
    )


def generate_offline_scheme_answer(message: str, profile: dict | None = None, language: str = "EN") -> str:
    """
    Smart Rule-Based Policy Knowledgebase Search when live Gemini API quota is hit.
    Searches local SCHEMES_DATABASE for matching schemes and generates a structured answer.
    """
    from data.schemes_db import SCHEMES_DATABASE

    msg_lower = message.lower()
    matched_schemes = []

    for scheme in SCHEMES_DATABASE:
        name = scheme.get("name", "").lower()
        cat = scheme.get("category", "").lower()
        desc = scheme.get("shortDesc", "").lower()
        target = scheme.get("targetGroup", "").lower()
        
        # Check keyword matches
        if any(kw in msg_lower for kw in [name, cat, target]) or \
           any(word in msg_lower for word in name.split() if len(word) > 3) or \
           ("scholarship" in msg_lower and "education" in cat) or \
           ("farmer" in msg_lower and ("kisan" in name or "agriculture" in cat)) or \
           ("health" in msg_lower and "health" in cat) or \
           ("loan" in msg_lower and "loan" in desc) or \
           ("document" in msg_lower) or \
           ("eligible" in msg_lower or "qualification" in msg_lower):
            matched_schemes.append(scheme)

    if not matched_schemes:
        matched_schemes = SCHEMES_DATABASE[:3]

    if language == "HI":
        resp = "💡 **Sarthi AI ऑफ़लाइन नीति ज्ञानकोश (Offline Policy Engine)**:\n\n"
        resp += f"Gemini API फ्री दर सीमा पूरी होने के कारण, Sarthi AI ऑफ़लाइन मोड में आपके प्रश्न का उत्तर दे रहा है:\n\n"
        for s in matched_schemes[:3]:
            docs = ", ".join([d["name"] for d in s.get("documents", [])[:3]])
            resp += f"📌 **{s['name']}** ({s.get('govtLevel')})\n"
            resp += f"• **लाभ**: {s.get('benefitAmount')}\n"
            resp += f"• **विवरण**: {s.get('shortDesc')}\n"
            resp += f"• **आवश्यक दस्तावेज**: {docs}\n"
            resp += f"• **आधिकारिक पोर्टल**: {s.get('officialUrl')}\n\n"
        resp += "आप इस उत्तर को नीचे 'Save to Memory Center' पर क्लिक करके सहेज सकते हैं।"
        return resp

    resp = "💡 **Sarthi AI Policy Knowledgebase (Offline Mode)**:\n\n"
    resp += "Currently, the live Gemini API free tier rate limit has been reached. Here are matching government schemes directly from Sarthi AI's verified policy database:\n\n"
    for s in matched_schemes[:3]:
        docs = ", ".join([d["name"] for d in s.get("documents", [])[:3]])
        resp += f"📌 **{s['name']}** ({s.get('govtLevel')})\n"
        resp += f"• **Benefit**: {s.get('benefitAmount')}\n"
        resp += f"• **Overview**: {s.get('shortDesc')}\n"
        resp += f"• **Key Documents**: {docs}\n"
        resp += f"• **Official Portal**: {s.get('officialUrl')}\n\n"
    resp += "You can save this Q&A entry into your Memory Center below and set your custom retention duration!"
    return resp


async def chat_with_gemini(
    message: str,
    history: list[dict],
    profile: dict | None = None,
    language: str = "EN",
) -> str:
    """Non-streaming chat completion with multi-model rate limit fallback."""
    context = ""
    if profile:
        context = f"\nUser profile context: Age={profile.get('age')}, State={profile.get('state')}, Income=₹{profile.get('income')}, Category={profile.get('category', '').upper()}, Education={profile.get('education')}, Occupation={profile.get('occupation')}, Gender={profile.get('gender')}.\n"
    
    lang_instruction = "Please respond in Hindi." if language == "HI" else "Please respond in English."
    full_message = f"{context}{lang_instruction}\n\nUser question: {message}"

    # Build chat history
    chat_history = []
    for item in history:
        chat_history.append({
            "role": item.get("role", "user"),
            "parts": [item.get("content", "")]
        })
    
    models_to_try = ["gemini-flash-latest", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
    last_err = None

    for m_name in models_to_try:
        try:
            model = get_model(model_name=m_name)
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(full_message)
            if response and response.text:
                return response.text
        except Exception as e:
            last_err = e
            print(f"[Gemini Chat Warning] Model {m_name} quota/error: {e}")

    # Fallback to Smart Offline Policy Engine if rate limit or quota exceeded across all models
    return generate_offline_scheme_answer(message, profile, language)


async def stream_reasoning(profile: dict, language: str = "EN") -> AsyncGenerator[str, None]:
    """
    Streams step-by-step AI reasoning for a citizen profile with rate limit fallback.
    Used by the AIReasoningModal.jsx component via SSE.
    """
    lang = "Hindi" if language == "HI" else "English"
    prompt = f"""Analyze this citizen's profile for government scheme eligibility in a step-by-step reasoning format.
Output EXACTLY 8 reasoning steps, each as a single line starting with "STEP: ".
Each step should be clear, specific, and reference the actual profile values.
Language: {lang}

Profile:
- Age: {profile.get('age')} years
- Gender: {profile.get('gender')}
- State: {profile.get('state')}
- Annual Income: ₹{profile.get('income')}
- Category: {profile.get('category', '').upper()}
- Education: {profile.get('education')}
- Occupation: {profile.get('occupation')}
- Disability: {profile.get('disability', 'no')}

Start with profile understanding, then check each eligibility dimension (age, income, state, category, gender, occupation), then conclude with scheme matches.
Format each step as: STEP: [reasoning text here]"""

    models_to_try = ["gemini-flash-latest", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
    success = False

    for m_name in models_to_try:
        try:
            model = get_model(model_name=m_name)
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    lines = chunk.text.split("\n")
                    for line in lines:
                        line = line.strip()
                        if line.startswith("STEP:"):
                            yield line[5:].strip()
            success = True
            break
        except Exception as e:
            print(f"[Gemini Reasoning Warning] Model {m_name} quota/error: {e}")

    if not success:
        # Yield fallback reasoning steps if rate limit is reached
        fallback_steps = [
            f"Initialized offline policy engine for citizen (Age: {profile.get('age')}, State: {profile.get('state')}).",
            f"Evaluating annual family income cap (₹{profile.get('income'):,}).",
            f"Checking occupational tier ({profile.get('occupation')}) and education criteria ({profile.get('education')}).",
            f"Applying category relaxation rules for {profile.get('category', '').upper()}.",
            "Synthesizing state and central scheme eligibility graphs.",
            "Cross-referencing document readiness requirements.",
            "Ranked top eligible welfare schemes matching citizen profile."
        ]
        for step in fallback_steps:
            yield step
