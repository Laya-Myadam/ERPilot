from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class ReleaseNotesRequest(BaseModel):
    release_notes: str
    client_modules: list[str] = []

SYSTEM_PROMPT = """You are an Oracle ERP release management expert at Denovo. Analyze Oracle/JDE release notes and identify what's critical, relevant, or safe to ignore.

Output format:

## 🔴 Critical (Action Required)
(Changes that break existing functionality or require immediate action)

## 🟡 Important (Review Required)
(New features or changes that may impact current setup)

## 🟢 Beneficial (Recommended Adoption)
(New features worth enabling for improvement)

## ⚪ Not Applicable
(Changes that don't affect this client's modules)

## Recommended Actions
(Specific steps the consulting team should take before applying this update)

Be specific. Reference program IDs, module names, and configuration settings."""

@router.post("/analyze")
async def analyze_release_notes(req: ReleaseNotesRequest):
    client_context = ""
    if req.client_modules:
        client_context = f"\nClient's active modules: {', '.join(req.client_modules)}"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"{client_context}\n\nRelease Notes to analyze:\n\n{req.release_notes}"}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=2000)
    return {"analysis": result}
