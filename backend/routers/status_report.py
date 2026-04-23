from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class StatusReportRequest(BaseModel):
    project_name: str
    client_name: str
    report_period: str
    overall_status: str  # Green, Yellow, Red
    accomplishments: str
    in_progress: str
    upcoming: str
    risks_issues: str = ""
    decisions_needed: str = ""
    budget_status: str = ""
    percent_complete: str = ""

@router.post("/generate")
def generate_status_report(req: StatusReportRequest):
    prompt = f"""You are a senior Oracle HCM project manager at Denovo, a consulting firm. Generate a professional, client-ready weekly project status report.

Project: {req.project_name}
Client: {req.client_name}
Report Period: {req.report_period}
Overall Status: {req.overall_status}
Budget Status: {req.budget_status or "On budget"}
% Complete: {req.percent_complete or "Not specified"}

ACCOMPLISHMENTS THIS PERIOD:
{req.accomplishments}

IN PROGRESS:
{req.in_progress}

UPCOMING NEXT PERIOD:
{req.upcoming}

RISKS & ISSUES:
{req.risks_issues or "No critical risks at this time"}

DECISIONS NEEDED FROM CLIENT:
{req.decisions_needed or "None outstanding"}

Generate a polished weekly status report with:

## PROJECT STATUS REPORT
**{req.project_name} | {req.client_name} | {req.report_period}**

### Overall Status: [🟢 GREEN / 🟡 YELLOW / 🔴 RED] — one-line summary

### Executive Summary
2-3 sentences summarizing the week. Written for a non-technical executive (CFO/CHRO). What happened, are we on track, what's next.

### Status Indicators
| Dimension | Status | Notes |
|---|---|---|
| Schedule | 🟢/🟡/🔴 | |
| Budget | 🟢/🟡/🔴 | |
| Scope | 🟢/🟡/🔴 | |
| Quality | 🟢/🟡/🔴 | |
| Resources | 🟢/🟡/🔴 | |

### Accomplishments This Period
(Bullet list — professional, specific, outcome-focused. Not "we worked on X" but "completed X, enabling Y")

### In Progress
(Bullet list with owner and target completion date)

### Next Period Plan
(Bullet list with owner and target dates)

### Risks & Issues Log
| # | Risk/Issue | Severity | Owner | Due Date | Status |
(Only include if risks exist)

### Decisions Required from Client
| # | Decision | Due Date | Impact if Delayed |
(Only include if decisions needed)

### Key Milestones
| Milestone | Planned Date | Status |

Write in a confident, professional consulting tone. Be specific — use names, dates, system names. Do NOT use vague language like "various tasks" or "several items"."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.3,
    )
    result = response.choices[0].message.content
    save_history("Status Report Generator", f"{req.client_name} — {req.report_period}", result)
    return {"report": result}
