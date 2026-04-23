from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ARRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # ar_setup | credit_policy | collections | revenue_recognition
    context: str
    legislation: str = "US"

@router.post("/generate")
def generate(req: ARRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "ar_setup":
        prompt = header + f"""You are an Oracle Cloud ERP Accounts Receivable expert. Generate a complete AR configuration guide.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud AR setup:

## 1. AR SYSTEM OPTIONS
- Business unit and ledger alignment
- AR accounting period setup
- Statement and dunning cycle configuration

## 2. INVOICE CONFIGURATION
- Invoice types to enable: Standard, Credit Memo, Debit Memo, Chargeback
- Invoice numbering sequences
- Memo line setup for common charge types
- Invoice print template setup

## 3. PAYMENT TERMS
- Payment terms to configure (Net 30 / Net 45 / 2/10 Net 30 / COD / Prepaid)
- Split payment term setup
- Discount terms configuration

## 4. RECEIPT PROCESSING
- Receipt methods: Check, ACH, Wire, Credit Card, Lock Box
- Lock box file format setup (BAI2 / custom)
- Auto cash application rules
- Remittance advice matching rules
- Unapplied receipts handling

## 5. CUSTOMER SETUP
- Required customer fields
- Customer account hierarchy (parent/child)
- Ship-to vs. bill-to site setup
- Tax exemption setup

## 6. ACCOUNTING SETUP
- AR accounting flexfield mapping
- Unearned revenue vs. earned revenue accounts
- Clearing account configuration

## 7. ORACLE CONFIGURATION STEPS
Ordered setup sequence

## 8. TEST SCENARIOS
4 test cases: invoice creation, receipt application, credit memo, partial payment

Use exact Oracle Cloud AR field names."""

    elif req.tool_type == "credit_policy":
        prompt = header + f"""You are an Oracle Cloud ERP Credit Management expert. Generate a complete Customer Credit Policy configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Credit Management setup:

## 1. CREDIT POLICY RULES
- Credit limit setting methodology (manual / formula-based / credit bureau)
- Credit limit amounts by customer tier
- Credit limit review frequency
- Auto-credit limit increase rules

## 2. CREDIT HOLD CONFIGURATION
- Credit hold triggers: (overdue balance / exceeded credit limit / days past due)
- Hold types: Manual / Automatic / Order hold
- Hold release process and approvals
- Emergency order release procedure

## 3. CREDIT REVIEW WORKFLOW
- Who reviews credit applications (Credit Analyst → Credit Manager → CFO)
- New customer credit application process
- Credit review triggers (periodic / event-based)
- Credit scoring model setup

## 4. CUSTOMER RISK CLASSIFICATION
- Risk categories: Low / Medium / High / Prepay-Only
- Criteria for each risk level
- Automatic reclassification rules

## 5. DUNNING SETUP
- Dunning letter templates (Level 1 / 2 / 3 / Final Demand)
- Dunning trigger: days overdue per letter level
- Dunning schedule configuration
- Exclusion rules (disputed invoices, VIP customers)

## 6. ORACLE CONFIGURATION STEPS
Credit Management setup sequence

## 7. TEST SCENARIOS
3 scenarios: new customer credit, credit hold trigger, credit review

Use exact Oracle Cloud Credit Management field names."""

    elif req.tool_type == "collections":
        prompt = header + f"""You are an Oracle Cloud ERP Collections expert. Generate a complete Collections Workflow configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Collections setup:

## 1. COLLECTIONS STRATEGY
- Strategy name and type (automated / manual / hybrid)
- Aging bucket definitions (Current / 1–30 / 31–60 / 61–90 / 90+)
- Strategy assignment rules by customer segment / risk / amount

## 2. COLLECTOR ASSIGNMENT
- Collector assignment rules (by amount / territory / industry / customer)
- Collector workload balancing
- Escalation to senior collector / manager threshold

## 3. DUNNING AND CONTACT ACTIONS
- Contact activity types: call, email, letter, legal referral
- Automated dunning sequence with timing
- Promise-to-pay tracking and follow-up rules
- Dispute creation and management process

## 4. DELINQUENCY MANAGEMENT
- Delinquency threshold by customer tier
- Write-off approval workflow and thresholds
- Bad debt provision calculation method
- Recovery process after write-off

## 5. PAYMENT PLAN SETUP
- Payment arrangement configuration
- Installment plan approval workflow
- Monitoring of payment plan compliance

## 6. ORACLE CONFIGURATION STEPS
Collections setup sequence

## 7. REPORTS
Key Oracle AR Collections reports to configure

Use exact Oracle Cloud Collections field names."""

    else:  # revenue_recognition
        prompt = header + f"""You are an Oracle Cloud Revenue Management expert (ASC 606 / IFRS 15). Generate a complete Revenue Recognition configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Revenue Management setup:

## 1. ASC 606 / IFRS 15 FRAMEWORK
- Performance obligation identification approach
- Standalone selling price (SSP) determination methodology
- Variable consideration estimation

## 2. CONTRACT SETUP
- Contract types to configure
- Multi-element arrangement setup
- Contract modification handling
- Contract combination rules

## 3. PERFORMANCE OBLIGATION CONFIGURATION
- Performance obligation types: point-in-time vs. over-time
- Satisfaction method per obligation type
- Output vs. input method selection

## 4. REVENUE ALLOCATION
- SSP allocation method (relative SSP / residual approach)
- Discount allocation rules
- Variable consideration allocation rules

## 5. DEFERRAL AND RECOGNITION SCHEDULE
- Deferred revenue account setup
- Recognition schedule generation
- Automatic recognition run configuration
- Manual override and approval process

## 6. JOURNAL ENTRY MAPPING
- Revenue recognition accounting entries
- Contract asset / contract liability accounts
- Unbilled receivable account

## 7. ORACLE CONFIGURATION STEPS
Revenue Management module setup sequence

## 8. DISCLOSURE REPORTS
Required ASC 606 disclosure reports in Oracle

Use exact Oracle Cloud Revenue Management field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"ERP AR: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
