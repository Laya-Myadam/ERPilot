from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ParallelRunRequest(BaseModel):
    client_name: str = ""
    payroll_name: str = ""
    parallel_run_number: str = "1"  # 1st, 2nd, 3rd parallel run
    pay_period: str = ""
    legacy_system: str = ""
    employee_count: str = ""
    modules: str = "Payroll"
    special_focus: str = ""

@router.post("/generate")
def generate_parallel_run_checklist(req: ParallelRunRequest):
    prompt = f"""You are a senior Oracle Cloud Payroll consultant generating a detailed parallel run checklist and validation guide.

Client: {req.client_name or "Client"}
Payroll: {req.payroll_name or "Primary Payroll"}
Parallel Run Number: {req.parallel_run_number}
Pay Period: {req.pay_period or "Current period"}
Legacy System (being replaced): {req.legacy_system or "Not specified"}
Employee Count: {req.employee_count or "Not specified"}
Modules in Parallel: {req.modules}
Special Focus Areas: {req.special_focus or "Standard parallel run validation"}

Generate a comprehensive parallel run checklist and validation guide:

## PRE-RUN CHECKLIST
### Oracle Cloud Setup Verification
- [ ] All employees loaded and active in Oracle
- [ ] Pay frequencies match legacy
- [ ] Element entries loaded for all recurring elements
- [ ] Tax withholding elections migrated
- [ ] Direct deposit/payment methods set up
- [ ] Payroll calendars configured and active
(Add 10 more specific pre-run checks)

## PARALLEL RUN EXECUTION STEPS
Numbered steps to run payroll in Oracle Cloud for this parallel period, including:
- Which processes to run and in what order
- Required input parameters
- How long each step typically takes
- How to validate each step completed successfully

## RECONCILIATION VALIDATION MATRIX

### 1. HEADCOUNT RECONCILIATION
| Check | Legacy | Oracle | Variance | Pass/Fail | Action |
- Active employees processed
- New hires this period
- Terminations this period
- Employees on leave

### 2. GROSS PAY RECONCILIATION
| Pay Component | Legacy Total | Oracle Total | $ Variance | % Variance | Acceptable? |
- Regular Pay
- Overtime Pay
- Bonus/Supplemental
- Commission
- Retroactive Pay
- Total Gross Pay

### 3. TAX RECONCILIATION
| Tax Type | Legacy | Oracle | Variance | Notes |
- Federal Income Tax (FIT)
- Social Security Employee
- Medicare Employee
- Social Security Employer
- Medicare Employer
- State Income Tax (by state)
- Local Taxes
- Total Tax Withholding

### 4. DEDUCTIONS RECONCILIATION
| Deduction | Legacy | Oracle | Variance | Notes |
- 401(k) Pre-tax
- Medical/Dental/Vision
- FSA/HSA
- Life Insurance
- Garnishments
- Total Deductions

### 5. NET PAY RECONCILIATION
| | Legacy | Oracle | Variance |
- Total Net Pay
- ACH/Direct Deposit Total
- Check Total

## VARIANCE INVESTIGATION GUIDE
For each common variance type, document:
- **Threshold**: what % or $ amount triggers investigation
- **Likely Causes**: top 3 reasons this variance occurs in Oracle Cloud
- **Where to Look**: exact Oracle Cloud navigation path to investigate
- **Resolution**: how to fix each cause

## SIGN-OFF CRITERIA FOR {req.parallel_run_number} PARALLEL RUN
Define specific pass/fail thresholds:
- Gross Pay variance acceptable: ±___%
- Net Pay variance acceptable: ±___%
- Tax variance acceptable: ±___%
- Headcount variance acceptable: ___
- Sign-off authority: Who approves

## POST-RUN ACTIONS
- Documentation to retain
- Issues log template
- Escalation path for critical variances
- Timeline to next parallel run or go-live decision

## PARALLEL RUN SIGN-OFF TEMPLATE
(Formal sign-off document with signature lines for: Payroll Manager, IT Lead, Oracle Consultant, Client Project Sponsor)

Use exact Oracle Cloud Payroll terminology. Be specific about navigation paths."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Parallel Run Checklist", f"{req.client_name or 'Client'} — Run #{req.parallel_run_number} {req.payroll_name}", result)
    return {"checklist": result}
