from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class SOWRequest(BaseModel):
    project_name: str
    client_name: str
    project_scope: str
    modules: list[str] = []
    timeline_weeks: int = 12
    team_size: int = 3

SYSTEM_PROMPT = """You are a senior engagement manager at Denovo (part of Argano), an Oracle ERP consulting firm. Generate a professional Statement of Work (SOW) document.

The SOW must include:
1. Project Overview & Objectives
2. Scope of Work (in scope / out of scope)
3. Deliverables with acceptance criteria
4. Project Phases & Timeline
5. Team Structure & Roles
6. Assumptions & Dependencies
7. Change Management Process
8. Pricing Summary (placeholder rates)
9. Terms & Conditions Summary

Use professional consulting language. Be specific about ERP modules, deliverables, and milestones. Reference Denovo's EXPRESSLAUNCH methodology where appropriate."""

@router.post("/generate")
async def generate_sow(req: SOWRequest):
    modules_str = ", ".join(req.modules) if req.modules else "To be determined during discovery"
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""Generate a complete SOW for:
Project: {req.project_name}
Client: {req.client_name}
Scope Description: {req.project_scope}
Oracle/JDE Modules: {modules_str}
Timeline: {req.timeline_weeks} weeks
Consulting Team Size: {req.team_size} consultants"""}
    ]
    result = chat_completion(messages, temperature=0.2, max_tokens=3000)
    return {"sow": result}
