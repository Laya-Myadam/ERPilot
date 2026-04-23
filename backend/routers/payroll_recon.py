from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class PayrollReconRequest(BaseModel):
    current_run: str
    previous_run: str
    payroll_name: str = ""
    period: str = ""
    employee_count_current: str = ""
    employee_count_previous: str = ""
    notes: str = ""

@router.post("/analyze")
def analyze_payroll_recon(req: PayrollReconRequest):
    prompt = f"""You are a senior Oracle Cloud Payroll consultant performing a parallel run reconciliation analysis.

Payroll: {req.payroll_name or "Not specified"}
Period: {req.period or "Not specified"}
Employee Count — Current Run: {req.employee_count_current or "Not specified"}
Employee Count — Previous Run: {req.employee_count_previous or "Not specified"}

CURRENT RUN TOTALS:
{req.current_run}

PREVIOUS RUN TOTALS:
{req.previous_run}

Additional Notes: {req.notes or "None"}

Perform a full payroll reconciliation analysis:

1. **VARIANCE SUMMARY TABLE**
   For each line item, calculate: Previous | Current | Variance ($) | Variance (%) | Status (OK/REVIEW/INVESTIGATE)

2. **CRITICAL VARIANCES** (>2% or >$10,000 — flag these as red)
   - What the variance is
   - Most likely Oracle Cloud causes (element changes, formula issues, new starters/leavers, rate changes, retroactive pay, tax table updates)
   - Specific investigation steps in Oracle Cloud UI (which screen to navigate to)

3. **HEADCOUNT ANALYSIS** (if counts differ)
   - Explain impact of headcount change on gross pay expectation
   - Flag if variance is unexplained after accounting for headcount

4. **LIKELY ROOT CAUSES** ranked by probability

5. **INVESTIGATION CHECKLIST** — exact steps to resolve each flagged item in Oracle Cloud Payroll

6. **SIGN-OFF RECOMMENDATION** — can this payroll run be approved or does it need re-processing?

Be specific and technical. This is for an Oracle Cloud Payroll consultant, not a general audience."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.1,
    )
    result = response.choices[0].message.content
    save_history("Payroll Reconciliation Analyzer", f"{req.payroll_name or 'Payroll'} - {req.period or 'period'}", result)
    return {"analysis": result}
