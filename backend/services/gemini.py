"""
Gemini AI service wrapper for Sarthi AI.
Provides chat completions and SSE streaming for AI Reasoning.
"""
import os
import google.generativeai as genai
from typing import AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=_api_key)

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
    if not model_name:
        model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-flash-latest")
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=SYSTEM_PROMPT,
    )


async def chat_with_gemini(
    message: str,
    history: list[dict],
    profile: dict | None = None,
    language: str = "EN",
) -> str:
    """Non-streaming chat completion."""
    model = get_model()
    
    context = ""
    if profile:
        context = f"\nUser profile context: Age={profile.get('age')}, State={profile.get('state')}, Income=₹{profile.get('income')}, Category={profile.get('category').upper()}, Education={profile.get('education')}, Occupation={profile.get('occupation')}, Gender={profile.get('gender')}.\n"
    
    lang_instruction = "Please respond in Hindi." if language == "HI" else "Please respond in English."
    full_message = f"{context}{lang_instruction}\n\nUser question: {message}"

    # Build chat history
    chat_history = []
    for item in history:
        chat_history.append({
            "role": item["role"],
            "parts": [item["content"]]
        })
    
    chat = model.start_chat(history=chat_history)
    response = chat.send_message(full_message)
    return response.text


async def stream_reasoning(profile: dict, language: str = "EN") -> AsyncGenerator[str, None]:
    """
    Streams step-by-step AI reasoning for a citizen profile.
    Used by the AIReasoningModal.jsx component via SSE.
    """
    model = get_model()

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

    response = model.generate_content(prompt, stream=True)
    
    for chunk in response:
        if chunk.text:
            lines = chunk.text.split("\n")
            for line in lines:
                line = line.strip()
                if line.startswith("STEP:"):
                    yield line[5:].strip()
