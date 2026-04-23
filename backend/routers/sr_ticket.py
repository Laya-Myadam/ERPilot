from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class SRTicketRequest(BaseModel):
    product: str          # Oracle Cloud HCM, Oracle Cloud Payroll, JDE, etc.
    module: str
    severity: str         # 1-Critical, 2-High, 3-Medium, 4-Low
    problem_summary: str
    steps_to_reproduce: str = ""
    expected_behavior: str = ""
    actual_behavior: str = ""
    error_messages: str = ""
    workaround_tried: str = ""
    business_impact: str = ""
    environment: str = "Production"

@router.post("/generate")
def generate_sr_ticket(req: SRTicketRequest):
    prompt = f"""You are an expert Oracle support engineer and consultant. Generate a perfectly structured Oracle Service Request (SR) that will get fast resolution from Oracle Support.

Product: {req.product}
Module: {req.module}
Severity: {req.severity}
Environment: {req.environment}
Problem: {req.problem_summary}
Steps to Reproduce: {req.steps_to_reproduce or "Not yet documented"}
Expected Behavior: {req.expected_behavior or "Derive from problem description"}
Actual Behavior: {req.actual_behavior or "Derive from problem description"}
Error Messages: {req.error_messages or "None provided"}
Workarounds Tried: {req.workaround_tried or "None attempted"}
Business Impact: {req.business_impact or "Operations affected"}

Generate a complete Oracle SR with:

## SR TITLE
(Concise, specific, searchable — include product, module, and exact error if available. Max 100 chars.)

## PROBLEM STATEMENT
Clear 2-3 sentence description of the issue. Include: what the user was doing, what happened, when it started.

## SEVERITY JUSTIFICATION
Why this severity level is appropriate. For Sev 1-2, include business impact dollar amount or users affected.

## ENVIRONMENT DETAILS
| Field | Value |
|---|---|
| Product | |
| Module | |
| Version/Release | |
| Environment | |
| Legislation | |
| Tenant Name | (if applicable) |

## STEPS TO REPRODUCE
Exact numbered steps. Be specific — include menu paths, field values, dates used.

## EXPECTED BEHAVIOR
What should happen.

## ACTUAL BEHAVIOR
What actually happens. Include exact error codes, messages, UI behavior.

## ERROR DETAILS
Paste exact error messages. Include any relevant log excerpts.

## DIAGNOSTIC INFORMATION
List all diagnostics already collected:
- [ ] Screenshot attached
- [ ] Error log attached
- [ ] Transaction ID / Process ID
- [ ] Affected employee/record IDs (anonymized)
- [ ] Date/time of first occurrence

## BUSINESS IMPACT
Quantified impact: X users affected, process Y is blocked, go-live at risk on [date], financial close delayed.

## WORKAROUNDS ATTEMPTED
What has already been tried and results.

## ADDITIONAL CONTEXT
Any recent changes (patches applied, config changes, new hires, period close, etc.) that preceded the issue.

## QUESTIONS FOR ORACLE SUPPORT
3-5 specific technical questions to accelerate resolution.

Write this so a Tier 1 Oracle Support analyst immediately understands the issue and can escalate properly. Be technical and precise."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Oracle SR Ticket Writer", f"{req.product} {req.module}: {req.problem_summary[:60]}", result)
    return {"ticket": result}
