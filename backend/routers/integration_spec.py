from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class IntegrationSpecRequest(BaseModel):
    integration_name: str = ""
    source_system: str
    target_system: str
    direction: str = "Bidirectional"  # Source to Target / Target to Source / Bidirectional
    data_objects: str
    frequency: str = "Real-time"
    business_purpose: str
    volume: str = ""
    special_requirements: str = ""

@router.post("/generate")
def generate_integration_spec(req: IntegrationSpecRequest):
    prompt = f"""You are a senior Oracle Cloud integration architect. Generate a complete integration specification document.

Integration Name: {req.integration_name or f"{req.source_system} ↔ {req.target_system}"}
Source System: {req.source_system}
Target System: {req.target_system}
Direction: {req.direction}
Data Objects / Entities: {req.data_objects}
Frequency: {req.frequency}
Business Purpose: {req.business_purpose}
Volume: {req.volume or "Not specified"}
Special Requirements: {req.special_requirements or "None"}

Generate a complete integration specification:

## INTEGRATION SPECIFICATION
**{req.integration_name or f"{req.source_system} to {req.target_system}"}**

### 1. OVERVIEW
| Field | Value |
|---|---|
| Integration Name | |
| Source System | |
| Target System | |
| Direction | |
| Trigger | Real-time / Scheduled / Event-driven |
| Frequency | |
| Protocol | REST API / SOAP / SFTP / Oracle Integration Cloud |
| Data Format | JSON / XML / CSV / HDL |

### 2. BUSINESS PURPOSE
What this integration does and why it's needed. Business outcome it enables.

### 3. FIELD MAPPING
| Source Field | Source Object | Target Field | Target Object | Transform Required | Notes |
|---|---|---|---|---|---|
(List all fields being passed — be specific with Oracle Cloud field names and API names)

### 4. TRANSFORMATION RULES
For each non-trivial mapping, document the transformation logic:
- Data type conversions
- Code/value mapping tables (e.g., source status "A" = Oracle "ACTIVE")
- Calculated fields
- Default values when source is null

### 5. ERROR HANDLING
| Error Type | Detection Method | Action | Notification |
|---|---|---|---|
| Missing required field | Validation pre-send | Reject record, log error | Email to integration admin |
| Duplicate record | Key lookup | Skip or update based on rule | Log warning |
| Target system unavailable | HTTP 500/timeout | Retry 3x, then queue | Alert |
| Invalid value | Validation | Reject record | Error report |

### 6. VOLUME & PERFORMANCE
- Records per run: ___
- Peak volume: ___
- SLA — data must arrive within: ___
- Batch vs real-time decision rationale:

### 7. SECURITY & COMPLIANCE
- Authentication method: OAuth 2.0 / API Key / Certificate
- Data encryption: In-transit / At-rest
- PII fields (mask/encrypt): List any SSN, DOB, salary fields
- Audit logging: Yes/No

### 8. TESTING PLAN
| Test Scenario | Test Data | Expected Result |
|---|---|---|
| Happy path — new record | | |
| Update existing record | | |
| Delete / inactivate | | |
| Error — missing required field | | |
| High volume test | | |

### 9. IMPLEMENTATION STEPS
Numbered steps to build this integration using Oracle Integration Cloud (OIC) or equivalent.

### 10. MONITORING & SUPPORT
- How to monitor this integration in production
- Common failure modes and how to diagnose
- On-call runbook for integration failures

Use exact Oracle Cloud API names and field names where applicable."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Integration Spec Generator", f"{req.source_system} → {req.target_system}: {req.data_objects[:50]}", result)
    return {"spec": result}
