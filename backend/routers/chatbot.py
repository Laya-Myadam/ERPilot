from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.groq_client import stream_completion
from services.rag_service import build_context

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []

SYSTEM_PROMPT = """You are an expert Oracle ERP consultant at Denovo (part of Argano), specializing in JD Edwards EnterpriseOne and Oracle Cloud ERP. You have 15+ years of experience implementing and supporting Oracle ERP systems.

Answer questions clearly and precisely. Use technical JDE/Oracle terminology correctly. If asked about a specific module, process, or error, provide actionable guidance. Structure complex answers with numbered steps or bullet points.

You always:
- Reference specific program IDs (e.g., P4210, P0911) when relevant
- Mention relevant AAIs, processing options, or configuration steps
- Flag common pitfalls or gotchas
- Keep answers focused and practical"""

@router.post("/chat")
async def chat(req: ChatRequest):
    context = build_context(req.message)
    system = SYSTEM_PROMPT
    if context:
        system += f"\n\nRelevant knowledge base context:\n{context}"

    messages = [{"role": "system", "content": system}]
    for h in req.history[-10:]:
        messages.append(h)
    messages.append({"role": "user", "content": req.message})

    def generate():
        for chunk in stream_completion(messages, temperature=0.2, max_tokens=1024):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")
