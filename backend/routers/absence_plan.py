from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class AbsencePlanRequest(BaseModel):
    plan_name: str = ""
    leave_type: str  # Vacation, Sick, FMLA, Maternity, PTO, Custom
    policy_description: str
    accrual_rules: str = ""
    carryover_rules: str = ""
    eligibility: str = ""
    legislation: str = "US"
    client_name: str = ""

@router.post("/design")
def design_absence_plan(req: AbsencePlanRequest):
    prompt = f"""You are an Oracle Cloud HCM Absence Management expert. Design a complete Oracle Absence Plan configuration spec based on the client's HR policy below.

Client: {req.client_name or "Not specified"}
Plan Name: {req.plan_name or f"{req.leave_type} Plan"}
Leave Type: {req.leave_type}
Legislation: {req.legislation}

HR Policy (plain English):
{req.policy_description}

Accrual Rules: {req.accrual_rules or "Derive from policy description"}
Carryover Rules: {req.carryover_rules or "Derive from policy description"}
Eligibility: {req.eligibility or "All regular employees unless stated otherwise"}

Generate a complete Oracle Cloud Absence Plan configuration specification:

1. **ABSENCE PLAN SETUP**
   - Plan Name (recommended)
   - Plan Type (Accrual / Compensatory / Qualification / None)
   - Absence Type and Category
   - Unit of Measure (Days/Hours)
   - Plan UOM Conversion Rule

2. **ACCRUAL CONFIGURATION**
   - Accrual Frequency (Per Pay Period / Monthly / Annually / Semi-Monthly)
   - Accrual Rate — exact formula or table
   - Accrual Start Rule (Hire Date / First of Month after Hire / Anniversary)
   - Waiting Period (if any)
   - Maximum Accrual Balance (cap)
   - Accrual Ceiling

3. **CARRYOVER RULES**
   - Carryover Type (None / Fixed Amount / Percentage / Full Balance)
   - Maximum Carryover Amount
   - Carryover Date
   - Forfeited Balance handling

4. **FAST FORMULA REQUIREMENTS**
   - List any Fast Formulas needed for this plan
   - For each formula: name, type (Accrual / Participation / Ceiling), logic description
   - Write the actual Fast Formula code for the most complex rule

5. **ELIGIBILITY PROFILE**
   - Eligibility criteria to configure
   - Derived factors needed (Length of Service, Employment Category, etc.)

6. **BALANCE DIMENSIONS**
   - Required balance dimensions (Inception to Date, Year to Date, Period to Date)

7. **CONFIGURATION STEPS** — ordered list of screens to navigate in Oracle Cloud HCM

8. **TESTING SCENARIOS** — 3-5 test cases to validate this plan works correctly

9. **COMMON PITFALLS** for this type of plan

Be precise with Oracle terminology. Use exact field names as they appear in Oracle Cloud HCM."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Absence Plan Designer", f"{req.leave_type}: {req.plan_name or req.policy_description[:60]}", result)
    return {"plan": result}
