from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class MigrationRequest(BaseModel):
    current_system: str
    target_system: str = "Oracle Cloud ERP"
    modules: list[str] = []
    customizations: str = ""
    integrations: str = ""
    data_volume: str = ""
    go_live_target: str = ""

SYSTEM_PROMPT = """You are a cloud migration architect at Denovo specializing in Oracle ERP migrations. Analyze the client's environment and produce a migration readiness assessment.

Output format:

## Migration Readiness Score: X/100

## Module Readiness
| Module | Readiness | Risk Level | Notes |
|--------|-----------|------------|-------|
(Score each module)

## 🔴 High Risk Areas
(Items that could derail the migration)

## 🟡 Medium Risk Areas
(Items requiring careful planning)

## 🟢 Ready to Migrate
(Low risk, straightforward migration)

## Customization Impact Analysis
(Assess custom code/mods that may not exist in Cloud)

## Integration Complexity
(Assess existing integrations and rework needed)

## Recommended Approach
(EXPRESSLAUNCH vs phased migration vs lift-and-shift recommendation)

## Estimated Timeline
(High-level milestone estimate)

## Prerequisites Before Migration
(What must be done first)

Reference Denovo's EXPRESSPATH methodology for Oracle Cloud migrations."""

@router.post("/analyze")
async def analyze_migration(req: MigrationRequest):
    modules_str = ", ".join(req.modules) if req.modules else "Not specified"
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""Assess migration readiness for:
Current System: {req.current_system}
Target: {req.target_system}
Active Modules: {modules_str}
Customizations: {req.customizations or 'Not specified'}
Integrations: {req.integrations or 'Not specified'}
Data Volume: {req.data_volume or 'Not specified'}
Target Go-Live: {req.go_live_target or 'Not specified'}"""}
    ]
    result = chat_completion(messages, temperature=0.2, max_tokens=2500)
    return {"assessment": result}
