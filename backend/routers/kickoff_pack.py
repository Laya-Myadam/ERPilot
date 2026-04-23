from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class KickoffPackRequest(BaseModel):
    project_name: str
    client_name: str
    modules: str
    go_live_date: str
    project_start_date: str = ""
    client_team: str = ""
    denovo_team: str = ""
    legacy_system: str = ""
    employee_count: str = ""
    special_constraints: str = ""

@router.post("/generate")
def generate_kickoff_pack(req: KickoffPackRequest):
    prompt = f"""You are a senior Oracle HCM project manager at Denovo. Generate a complete Project Kickoff Pack for a new client engagement.

Project: {req.project_name}
Client: {req.client_name}
Modules: {req.modules}
Go-Live Date: {req.go_live_date}
Project Start: {req.project_start_date or "Immediate"}
Client Team: {req.client_team or "To be confirmed"}
Denovo Team: {req.denovo_team or "To be assigned"}
Legacy System: {req.legacy_system or "Not specified"}
Employee Count: {req.employee_count or "Not specified"}
Constraints: {req.special_constraints or "None noted"}

Generate a complete kickoff pack with ALL of the following sections:

---
# PROJECT KICKOFF PACK
## {req.project_name} | {req.client_name}

---
## 1. PROJECT CHARTER

### Project Overview
- Objective (1 paragraph)
- Success Criteria (3-5 measurable outcomes)
- In Scope (bullet list)
- Out of Scope (bullet list — be explicit to prevent scope creep)
- Key Assumptions (numbered list)
- Known Constraints

### Project Governance
| Role | Responsibility | Decision Authority |
|---|---|---|
| Executive Sponsor (Client) | | |
| Project Owner (Client) | | |
| IT Lead (Client) | | |
| Payroll/HR Lead (Client) | | |
| Project Manager (Denovo) | | |
| Lead Consultant (Denovo) | | |
| Engagement Director (Denovo) | | |

---
## 2. RACI MATRIX

| Activity | Client Sponsor | Client PM | Client SME | Denovo PM | Denovo Consultant |
|---|---|---|---|---|---|
| Requirements gathering | | | | | |
| System configuration | | | | | |
| Data migration | | | | | |
| Integration development | | | | | |
| Testing (SIT) | | | | | |
| UAT coordination | | | | | |
| Training delivery | | | | | |
| Go-live decision | | | | | |
| Hypercare support | | | | | |

(R=Responsible, A=Accountable, C=Consulted, I=Informed)

---
## 3. PROJECT MILESTONE PLAN

| Phase | Milestone | Target Date | Owner | Status |
|---|---|---|---|---|
| Initiation | Kickoff complete | | | |
| Discovery | Current-state documented | | | |
| Design | Configuration workbook signed off | | | |
| Build | All configuration complete | | | |
| Testing | SIT complete | | | |
| Testing | UAT sign-off | | | |
| Cutover | Parallel run #1 | | | |
| Cutover | Parallel run #2 | | | |
| Go-Live | Go/no-go decision | | | |
| Go-Live | Production go-live | {req.go_live_date} | | |
| Hypercare | Hypercare complete | | | |

(Backfill realistic dates working backward from {req.go_live_date})

---
## 4. COMMUNICATION PLAN

| Meeting | Frequency | Attendees | Owner | Purpose |
|---|---|---|---|---|
| Weekly Status Call | Weekly | PM + Leads | Denovo PM | Progress, risks, decisions |
| Steering Committee | Monthly | Sponsors | Denovo ED | Executive update |
| Working Sessions | As needed | SMEs + Consultants | Denovo Lead | Configuration decisions |
| Go/No-Go Review | Pre go-live | All | Denovo PM | Cutover approval |

**Status Report:** Weekly, delivered every Friday by 5pm.
**Escalation Path:** Consultant → PM → Engagement Director → Client Sponsor

---
## 5. OPEN ITEMS & DECISIONS LOG (Initial)

| # | Item | Owner | Due Date | Priority | Status |
|---|---|---|---|---|---|
(List 10-15 decisions that must be made in the first 2 weeks — org structure, legal entities, payroll frequency, etc.)

---
## 6. RISK REGISTER (Initial)

| # | Risk | Probability | Impact | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
(List 8-10 common Oracle HCM implementation risks with H/M/L ratings)

---
## 7. FIRST 30 DAYS PLAN

Week 1: (bullets — what Denovo does, what client does)
Week 2: (bullets)
Week 3: (bullets)
Week 4: (bullets — what should be complete by end of month 1)

---
## 8. WHAT WE NEED FROM YOU (Client Checklist)

Items client must provide within first 2 weeks:
- [ ] Item 1
(List 10-15 specific items: org charts, existing policies, data extracts, system access, SME availability, etc.)

Be specific to Oracle HCM. Use realistic dates. Write in professional consulting language."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000,
        temperature=0.3,
    )
    result = response.choices[0].message.content
    save_history("Project Kickoff Pack", f"{req.client_name}: {req.project_name}", result)
    return {"pack": result}
