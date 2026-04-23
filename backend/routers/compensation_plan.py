from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class CompensationPlanRequest(BaseModel):
    client_name: str = ""
    plan_type: str
    grade_structure: str = ""
    budget_percent: str = ""
    performance_ratings: str = ""
    approval_workflow: str = ""
    plan_cycle: str = "Annual"
    special_rules: str = ""

@router.post("/design")
def design_compensation_plan(req: CompensationPlanRequest):
    prompt = f"""You are an Oracle Cloud HCM Compensation expert. Design a complete Compensation Plan configuration spec.

Client: {req.client_name or "Not specified"}
Plan Type: {req.plan_type}
Plan Cycle: {req.plan_cycle}
Grade Structure: {req.grade_structure or "TBD — derive standard corporate grade structure"}
Budget %: {req.budget_percent or "TBD"}
Performance Ratings: {req.performance_ratings or "1-5 scale"}
Approval Workflow: {req.approval_workflow or "Manager → HR → Finance"}
Special Rules: {req.special_rules or "None"}

Generate a complete Oracle Cloud HCM Compensation Plan design:

## 1. COMPENSATION PLAN SETUP
- Plan name, type, and status
- Plan cycle start/end dates
- Currency and rounding rules
- Worker eligibility criteria
- Proration rules (new hires, leaves, terminations mid-cycle)

## 2. SALARY GRADE STRUCTURE
- Grade names and codes (recommended for this industry)
- Minimum / Midpoint / Maximum for each grade
- Grade step progression rules
- Compa-ratio bands (Below / At / Above market)
- Red circle / green circle handling

## 3. MERIT / INCREASE MATRIX
| Performance Rating | Below Band (<80%) | In Band (80-120%) | Above Band (>120%) |
- Recommended % increase per cell
- Budget distribution method
- Rounding rules

## 4. APPROVAL WORKFLOW CONFIGURATION
- Approval hierarchy levels
- Amount-based routing thresholds
- Delegation rules and expiry
- Auto-approval conditions
- Notification templates

## 5. BONUS PLAN DETAILS (if applicable)
- Target bonus % by grade/role
- Performance modifier table
- Proration methodology
- Funding source and accrual approach

## 6. ORACLE CONFIGURATION STEPS
Ordered list of Compensation screens and setup sequence

## 7. FAST FORMULA REQUIREMENTS
Any formulas needed (proration, eligibility, amount calculation)

## 8. KEY REPORTS AND ANALYTICS
Recommended compensation analytics to configure

## 9. TEST SCENARIOS
4 test cases: standard merit, new hire proration, performance override, manager budget reallocation

Use exact Oracle Cloud HCM Compensation field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Compensation Plan Designer", f"{req.client_name}: {req.plan_type}", result)
    return {"plan": result}
