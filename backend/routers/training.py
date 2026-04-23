from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion
from database import save_history

router = APIRouter()


class TrainingRequest(BaseModel):
    module: str
    system: str = "JD Edwards EnterpriseOne"
    user_role: str
    client_name: str = ""
    config_notes: str = ""


SYSTEM_PROMPT = """You are a senior Oracle ERP training consultant at Denovo with 15+ years of experience creating end-user training materials for JD Edwards and Oracle Cloud implementations.

Generate a complete, professional end-user training guide in this format:

## Training Guide: [Module Name]
**System:** [ERP System] | **Role:** [User Role] | **Version:** [Version]
**Prepared by:** Denovo Consulting | **Date:** [Current]

---

## Module Overview
Brief description of what this module does and why this user role needs it.

## Learning Objectives
By the end of this guide, users will be able to:
- (3-5 specific, measurable objectives)

## Prerequisites
- System access and security roles required
- Prior knowledge or training needed
- Business process knowledge assumed

---

## Key Concepts
Explain 3-4 core concepts the user must understand before starting (with ERP-specific terminology defined simply).

---

## Step-by-Step Procedures

### Task 1: [Most Common Task Name]
**When to use:** (Business scenario)
**Menu Path:** (Exact JDE menu path or Oracle Cloud navigation, e.g., G03B11 > Customer Master)

| Step | Action | Screenshot Note | Tips & Warnings |
|------|--------|-----------------|-----------------|
| 1 | (Exact click/field instruction) | [Screen: X] | ⚠️ or 💡 note |
(Continue all steps)

**Expected Result:** What the user should see when done correctly.

### Task 2: [Second Most Common Task]
(Same format — include 3-4 tasks minimum)

---

## Common Errors & How to Fix Them

| Error Message | Likely Cause | Resolution |
|---------------|--------------|------------|
| (Real Oracle/JDE error) | (Reason) | (Step to fix) |

---

## Quick Reference Card
| Action | Menu Path / Button | Shortcut |
|--------|-------------------|----------|
(Top 8 most-used actions condensed)

---

## Practice Exercises
1. (Hands-on exercise with specific test data to enter)
2. (Second exercise)
3. (Third exercise)

---

## Knowledge Check
1. (Multiple choice or true/false question)
2. (Scenario-based question)
3. (Third question)

Use real JDE menu paths (G-menus), form names (P-numbers), and Oracle Cloud navigation paths. Write for a non-technical business user — avoid jargon, use plain English."""


@router.post("/generate")
async def generate_training(req: TrainingRequest):
    client_ctx = f"Client: {req.client_name}" if req.client_name else ""
    config_ctx = f"\nConfiguration notes: {req.config_notes}" if req.config_notes else ""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Generate a complete training guide for:\nModule: {req.module}\nSystem: {req.system}\nUser Role: {req.user_role}\n{client_ctx}{config_ctx}"}
    ]
    result = chat_completion(messages, temperature=0.2, max_tokens=4000)
    save_history("Training Material Generator", f"{req.module} - {req.user_role}", result)
    return {"guide": result}
