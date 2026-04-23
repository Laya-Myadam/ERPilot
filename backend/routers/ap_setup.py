from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class APSetupRequest(BaseModel):
    client_name: str = ""
    invoice_volume_monthly: str = ""
    invoice_types: str = ""
    payment_methods: str = ""
    approval_levels: str = ""
    po_matching_required: bool = True
    three_way_match: bool = False
    legislation: str = "US"

@router.post("/generate")
def generate_ap_setup(req: APSetupRequest):
    prompt = f"""You are an Oracle Cloud ERP Accounts Payable expert. Generate a complete AP configuration guide.

Client: {req.client_name or "Not specified"}
Monthly Invoice Volume: {req.invoice_volume_monthly or "Not specified"}
Invoice Types: {req.invoice_types or "Standard Invoice, Credit Memo, Prepayment"}
Payment Methods: {req.payment_methods or "Check, ACH, Wire Transfer"}
Approval Levels: {req.approval_levels or "Manager → Director for amounts over $10K → VP for over $50K"}
PO Matching: {"2-way" if req.po_matching_required and not req.three_way_match else ("3-way (PO + Receipt + Invoice)" if req.three_way_match else "No PO matching")}
Legislation: {req.legislation}

Generate a complete Oracle Cloud Accounts Payable configuration specification:

## 1. AP SETUP OVERVIEW
- Business unit and ledger alignment
- AP system options configuration
- Sequence numbering setup

## 2. INVOICE PROCESSING CONFIGURATION
- Invoice types to enable: {req.invoice_types}
- Invoice source setup (manual, EDI, scanned, supplier portal)
- Duplicate invoice detection rules (amount + supplier + date window)
- Hold and release reason codes
- Invoice batching rules

## 3. APPROVAL WORKFLOW (Invoice Approval)
- Threshold-based routing: {req.approval_levels}
- Delegation setup and expiry
- Auto-approval conditions (e.g., PO-matched invoices under tolerance)
- Approval group configuration
- Notification templates

## 4. PO MATCHING RULES
- Match option: {("3-way" if req.three_way_match else "2-way") if req.po_matching_required else "Not applicable"}
- Quantity tolerance % and amount tolerance %
- Receipt accrual and period-end accrual configuration
- Expense reports vs. PO invoices handling

## 5. PAYMENT SETUP
- Payment methods: {req.payment_methods}
- Payment terms to configure (Net 30, Net 45, Net 60, 2/10 Net 30)
- Bank account setup requirements
- Payment batch schedule and cut-off times
- Positive Pay file setup (if check payments)
- ACH/EFT format requirements

## 6. SUPPLIER CONFIGURATION REQUIREMENTS
- Required fields for supplier creation
- Tax classification (1099 reporting in US)
- Supplier merge and duplicate rules
- Supplier bank account verification process
- Supplier portal setup (if self-service)

## 7. TAX CONFIGURATION
- Tax handling: {req.legislation} tax setup
- Use tax self-assessment rules
- Withholding tax setup (if applicable)
- 1099 reporting configuration (US only)

## 8. ORACLE CONFIGURATION STEPS
Ordered sequence in Oracle Cloud AP: System Options → Payment Terms → Lookups → Workflow → Suppliers → Bank Accounts

## 9. TEST SCENARIOS
5 test cases: standard PO invoice, non-PO approval, credit memo application, prepayment, payment run

## 10. KEY AP REPORTS
Essential Oracle AP reports to configure for operations

Use exact Oracle Cloud AP field names and screen paths."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("AP Setup Generator", f"{req.client_name}: {req.invoice_volume_monthly} invoices/month", result)
    return {"setup": result}
