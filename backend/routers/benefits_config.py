from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class BenefitsConfigRequest(BaseModel):
    client_name: str = ""
    plan_types: str
    carriers: str = ""
    enrollment_window_days: str = "30"
    employee_categories: str = ""
    legislation: str = "US"
    special_rules: str = ""

@router.post("/generate")
def generate_benefits_config(req: BenefitsConfigRequest):
    prompt = f"""You are an Oracle Cloud HCM Benefits expert. Generate a complete Benefits Open Enrollment Configuration specification.

Client: {req.client_name or "Not specified"}
Plan Types: {req.plan_types}
Carriers: {req.carriers or "TBD"}
Enrollment Window: {req.enrollment_window_days} days
Employee Categories: {req.employee_categories or "All regular full-time and part-time"}
Legislation: {req.legislation}
Special Rules: {req.special_rules or "None"}

Generate a comprehensive Oracle Cloud HCM Benefits configuration spec:

## 1. BENEFIT PROGRAM SETUP
- Program name and type
- Enrollment period dates and window
- New hire enrollment rules (30/60/90 day windows)
- Default enrollment handling
- Life event vs. open enrollment rules

## 2. BENEFIT PLAN DEFINITIONS
For each plan type ({req.plan_types}):
- Plan name, type, and status
- Coverage start rule (First of next month / Immediate / First of month after 30 days)
- Dependent coverage options and age limits
- Cost structure (Flat / Tiered by coverage level / Age-banded)
- Imputed income calculation (if applicable)

## 3. LIFE EVENT CONFIGURATION
- Qualifying life events: Marriage, Divorce, Birth/Adoption, Loss of other coverage, Death
- Coverage change rules per event
- Documentation requirements per event type
- Retroactive enrollment rules and date rules

## 4. ELIGIBILITY PROFILES
- Eligibility criteria per plan (employment category, hours per week, waiting period)
- Derived factors needed (Length of Service, Employment Category, etc.)
- Part-time vs. full-time eligibility differences
- ACA eligibility tracking requirements

## 5. CARRIER EDI INTEGRATION
- 834 transaction set setup requirements per carrier
- File frequency (daily / weekly) and delivery method (SFTP / API)
- Required data fields per carrier
- Error handling and reconciliation process
- 820 payment file setup (if needed)

## 6. OPEN ENROLLMENT CONFIGURATION STEPS
Ordered list of Oracle HCM screens and setup sequence

## 7. TEST SCENARIOS
5 key test cases: new hire enrollment, life event, open enrollment change, dependent add, termination

## 8. COMMON PITFALLS
Top pitfalls in Oracle Benefits setup

Use exact Oracle Cloud HCM field names and screen paths."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Benefits Config Generator", f"{req.client_name}: {req.plan_types}", result)
    return {"config": result}
