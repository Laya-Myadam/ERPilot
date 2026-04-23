from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class PayrollElementRequest(BaseModel):
    element_name: str
    description: str
    classification: str = ""  # Standard Earnings, Supplemental Earnings, Deductions, etc.
    calculation_rule: str = ""  # Flat Amount, Hours x Rate, Formula
    legislation: str = "US"
    recurring: str = "Recurring"
    taxability: str = ""
    special_rules: str = ""

@router.post("/design")
def design_payroll_element(req: PayrollElementRequest):
    prompt = f"""You are an Oracle Cloud Payroll configuration expert. Design a complete payroll element specification for Oracle Cloud Payroll.

Element Name: {req.element_name}
Business Description: {req.description}
Classification: {req.classification or "Determine from description"}
Calculation Rule: {req.calculation_rule or "Determine from description"}
Recurring/Non-Recurring: {req.recurring}
Legislation: {req.legislation}
Taxability: {req.taxability or "Determine from description and legislation"}
Special Rules: {req.special_rules or "None"}

Generate a complete Oracle Cloud Payroll Element design document:

1. **ELEMENT DEFINITION**
   - Element Name (naming convention: ALL_CAPS_WITH_UNDERSCORES)
   - Primary Classification and Secondary Classification
   - Category
   - Effective Date
   - Recurring or Non-Recurring
   - Processing Type (Open / Once Per Period)
   - Calculation Rule
   - Legislatively Required? (Y/N)

2. **INPUT VALUES**
   For each input value provide: Name | Type | UOM | Required | Default | Special Purpose
   Include standard ones (Pay Value, Amount, Rate, Hours) and any custom ones

3. **BALANCE FEEDS**
   Which balances this element feeds into (Gross Pay, Subject to Federal Tax, Subject to State Tax, Net Pay, etc.)
   Balance feed direction (+/-)

4. **FORMULA**
   - Formula Type needed (Payroll / Payroll Access / Element Skip)
   - Write the Fast Formula if one is required
   - Formula name recommendation

5. **ELEMENT ELIGIBILITY**
   - Eligibility rules (All payrolls / specific payroll / assignment criteria)

6. **COSTING**
   - Costing Type recommendation (Fixed Costing / Distributed / No Costing)
   - Recommended account code structure

7. **TAX TREATMENT** (for {req.legislation})
   - Federal tax treatment
   - State/local tax treatment
   - W-2 box (if applicable)
   - Pre-tax or Post-tax

8. **CONFIGURATION STEPS** — exact Oracle Cloud navigation path

9. **TESTING CHECKLIST** — how to validate this element processes correctly

Use exact Oracle Cloud Payroll field names and terminology."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Payroll Element Designer", f"{req.element_name}: {req.description[:60]}", result)
    return {"element": result}
