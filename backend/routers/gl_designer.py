from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class GLDesignRequest(BaseModel):
    company_name: str = ""
    industry: str = ""
    legal_entities: str = ""
    num_segments: str = "5"
    reporting_requirements: str = ""
    intercompany_needed: bool = True
    has_projects: bool = False

@router.post("/design")
def design_gl_coa(req: GLDesignRequest):
    prompt = f"""You are an Oracle Cloud ERP General Ledger expert. Design a complete Chart of Accounts structure for Oracle Cloud Financials.

Company: {req.company_name or "Not specified"}
Industry: {req.industry or "Not specified"}
Legal Entities: {req.legal_entities or "Single entity"}
Number of Segments: {req.num_segments}
Reporting Requirements: {req.reporting_requirements or "Standard financial statements + management reporting"}
Intercompany Required: {"Yes" if req.intercompany_needed else "No"}
Project Accounting: {"Yes" if req.has_projects else "No"}

Design a complete Oracle Cloud GL Chart of Accounts:

## 1. COA STRUCTURE OVERVIEW
- Recommended segment count and rationale
- Account string format (e.g., XX-XXXXX-XXX-XXXX-XXX)
- Total character length
- Ledger and legal entity alignment

## 2. SEGMENT DESIGN
For each of the {req.num_segments} segments:
| Segment | Name | Length | Type | Purpose | Sample Values |
- Value set type (Independent / Dependent / Table-validated)
- Rollup groups for reporting
- Which segment is the Primary Balancing Segment
- Which segment is the Natural Account Segment

## 3. NATURAL ACCOUNT SEGMENT — ACCOUNT RANGES
- 1000–1999: Assets (with sub-ranges: Cash, AR, Inventory, Fixed Assets)
- 2000–2999: Liabilities (AP, Accruals, Debt)
- 3000–3999: Equity
- 4000–4999: Revenue
- 5000–5999: Cost of Goods Sold
- 6000–7999: Operating Expenses (by function)
- 8000–8999: Other Income/Expense

List 40–60 specific account numbers with names for {req.industry or "a manufacturing/services company"}.

## 4. INTERCOMPANY CONFIGURATION
- Intercompany balancing account setup
- Intercompany receivable / payable accounts
- Elimination ledger approach

## 5. VALUE SET DEFINITIONS
- Value set name, type, format, and validation for each segment

## 6. CROSS-VALIDATION RULES
- 5–8 key rules to prevent invalid account combinations

## 7. ACCOUNT HIERARCHIES
- Recommended parent-child rollup structure for financial statements
- P&L hierarchy
- Balance sheet hierarchy

## 8. ORACLE CONFIGURATION STEPS
Ordered sequence: Value Sets → Account Hierarchy → COA → Ledger → Legal Entity

## 9. COMMON PITFALLS
Top COA design mistakes in Oracle Cloud GL

Use exact Oracle Cloud GL field names and terminology."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("GL Chart of Accounts Designer", f"{req.company_name}: {req.industry}", result)
    return {"design": result}
