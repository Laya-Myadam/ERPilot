from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class OTLScheduleRequest(BaseModel):
    schedule_name: str = ""
    shift_pattern: str
    overtime_rules: str = ""
    employee_type: str = ""  # Hourly, Salaried, Union, etc.
    legislation: str = "US"
    pay_period: str = "Biweekly"
    special_rules: str = ""

@router.post("/generate")
def generate_otl_schedule(req: OTLScheduleRequest):
    prompt = f"""You are an Oracle Time and Labor (OTL) configuration expert. Generate a complete Oracle Cloud OTL work schedule and time configuration specification.

Schedule Name: {req.schedule_name or "Derive from shift pattern"}
Shift Pattern: {req.shift_pattern}
Overtime Rules: {req.overtime_rules or "Standard FLSA overtime (time and a half over 40 hours/week)"}
Employee Type: {req.employee_type or "Hourly non-exempt"}
Legislation: {req.legislation}
Pay Period: {req.pay_period}
Special Rules: {req.special_rules or "None"}

Generate a complete Oracle Cloud Time and Labor configuration spec:

1. **WORK SCHEDULE DEFINITION**
   - Schedule Name
   - Schedule Category (Fixed / Flexible / Project)
   - Time Zone
   - Work Week Definition (start day)

2. **SHIFT PATTERNS**
   For each shift: Name | Start Time | End Time | Duration | Days Active | Paid Hours | Unpaid Break

3. **WORK SCHEDULE ASSIGNMENT**
   - Schedule Pattern (weekly / biweekly)
   - Day-by-day breakdown for full cycle
   - Scheduled hours per period

4. **OVERTIME CONFIGURATION**
   - Overtime Rule Name
   - Overtime Threshold (daily / weekly / both)
   - Overtime Rate Multiplier
   - Overtime Period (7-day week definition)
   - Double-time rules (if applicable)
   - Consecutive day rules (if applicable)

5. **TIME CARD RULES**
   - Time Card Period
   - Submission Deadline
   - Auto-population rules
   - Rounding rules (if any — e.g., round to nearest 15 min)

6. **PAYROLL INTEGRATION**
   - Time Card to Payroll transfer rules
   - Element mapping (Regular Hours → Regular Pay element, OT Hours → OT Pay element)
   - Transfer frequency

7. **FAST FORMULAS NEEDED**
   - List any OTL Fast Formulas required
   - Write the overtime calculation formula

8. **APPROVAL WORKFLOW**
   - Recommended approval hierarchy
   - Escalation rules

9. **CONFIGURATION STEPS** in Oracle Cloud HCM

10. **TEST SCENARIOS** — 4 scenarios to validate (normal week, overtime week, holiday, partial week)

Use exact Oracle Cloud OTL terminology and field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("OTL Work Schedule Generator", f"{req.schedule_name or req.shift_pattern[:60]}", result)
    return {"schedule": result}
