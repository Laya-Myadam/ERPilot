from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class IncidentRequest(BaseModel):
    error_logs: str
    system: str = "JD Edwards"
    severity: str = "Medium"
    affected_users: int = 0

SYSTEM_PROMPT = """You are a senior Oracle ERP systems engineer at Denovo's managed services team. Analyze error logs and draft a professional incident report.

Output format:

## Incident Report

**Severity:** [Critical/High/Medium/Low]
**Status:** Under Investigation
**System:** [System name]

### Incident Summary
(Clear 2-3 sentence description of what happened)

### Root Cause Analysis
**Identified Cause:**
**Contributing Factors:**

### Error Details
| Field | Value |
|-------|-------|
| Error Code | |
| Affected Component | |
| First Occurrence | |
| Affected Users | |

### Impact Assessment
(What is broken, what is still working, business impact)

### Immediate Actions Taken
1.
2.

### Resolution Steps
1. (Step-by-step fix)
2.
3.

### Prevention Recommendations
- (How to prevent recurrence)

### Communication Template
(Ready-to-send client update message)

Be technically precise. Reference JDE program IDs, error codes, and system logs."""

@router.post("/draft")
async def draft_incident_report(req: IncidentRequest):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""System: {req.system}
Severity: {req.severity}
Affected Users: {req.affected_users}

Error Logs / Description:
{req.error_logs}"""}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=2000)
    return {"report": result}
