from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion
from database import save_history

router = APIRouter()


class GoLiveRequest(BaseModel):
    project_name: str
    client_name: str
    go_live_date: str
    modules: list[str] = []
    erp_system: str = "JD Edwards EnterpriseOne"
    team_size: int = 5
    cutover_window: str = "Weekend (48 hours)"
    special_considerations: str = ""


SYSTEM_PROMPT = """You are a senior Oracle ERP project manager at Denovo with extensive go-live and cutover experience across JD Edwards and Oracle Cloud implementations.

Generate a comprehensive, production-ready Go-Live & Cutover Checklist. Be extremely detailed and specific — this document will be used by the actual delivery team on go-live weekend.

Format:

## Go-Live & Cutover Plan
**Project:** [Name] | **Client:** [Client] | **Go-Live Date:** [Date]
**System:** [ERP] | **Cutover Window:** [Window]

---

## Pre-Cutover Checklist (T-2 Weeks)

### Infrastructure & Access
- [ ] (Specific task with owner role, e.g., "Confirm production environment URLs shared with all users — IT Admin")
(10+ items)

### Data Migration Final Checks
- [ ] (Specific validation with table/object name)
(8+ items)

### Training Completion
- [ ] (Specific training milestone)
(5+ items)

### Sign-offs Required
| Sign-off | Owner | Due Date | Status |
|----------|-------|----------|--------|
(List all required approvals)

---

## Cutover Day -1 (Friday / Day Before)

### Morning Tasks (8am–12pm)
- [ ] [Time] [Task] — Owner: [Role]

### Afternoon Tasks (12pm–5pm)
- [ ] [Time] [Task] — Owner: [Role]

### Evening / System Freeze (5pm onwards)
- [ ] [Time] Communicate system freeze to all users — PM
- [ ] [Time] (All cutover tasks with exact times)
(15+ items total for Day -1)

---

## Cutover Night (Go-Live Eve)

### Data Migration Execution
| Step | Task | Owner | Start Time | Duration | Status |
|------|------|-------|------------|----------|--------|
(All migration steps in sequence with realistic durations)

### System Configuration Final Steps
- [ ] [Time] (Task)
(10+ items)

### Validation Checkpoints
- [ ] [Time] (Specific validation — what to check and expected result)
(10+ items)

---

## Go-Live Morning Checklist

### Pre-Opening (6am–8am)
- [ ] (Task)
(8+ items)

### Hypercare Support Plan
| Time Slot | Support Coverage | Contact |
|-----------|-----------------|---------|
| 8am–12pm | (Role) | [placeholder] |
(Cover full first week)

---

## Rollback Decision Tree
**Rollback trigger conditions:**
- [ ] (Condition that would trigger rollback)
(3-5 conditions)

**Rollback procedure:**
1. (Step)
(5+ rollback steps)

**Rollback decision deadline:** [Specific time — e.g., Monday 10am]
**Decision maker:** [Role]

---

## Post Go-Live (First Week)

### Daily Checks
- [ ] (Morning check task)
(5 daily items)

### Issue Escalation Path
| Severity | Response Time | Escalation Path |
|----------|--------------|-----------------|
| Critical | 15 min | (Path) |
| High | 1 hour | (Path) |
| Medium | 4 hours | (Path) |

---

## Key Contacts
| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|--------------|
| Denovo PM | | | | 24/7 cutover weekend |
| Lead Consultant | | | | 24/7 cutover weekend |
| Client IT Lead | | | | |
| Oracle Support | | | | SR# [placeholder] |

Be specific to the ERP modules in scope. Reference real JDE objects, batch jobs, and Oracle Cloud processes where relevant."""


@router.post("/generate")
async def generate_golive_checklist(req: GoLiveRequest):
    modules_str = ", ".join(req.modules) if req.modules else "To be confirmed"
    special = f"\nSpecial considerations: {req.special_considerations}" if req.special_considerations else ""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""Generate a complete go-live checklist for:
Project: {req.project_name}
Client: {req.client_name}
ERP System: {req.erp_system}
Go-Live Date: {req.go_live_date}
Modules in scope: {modules_str}
Team Size: {req.team_size} consultants
Cutover Window: {req.cutover_window}{special}"""}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=4000)
    save_history("Go-Live Checklist Generator", f"{req.project_name} - {req.client_name}", result)
    return {"checklist": result}
