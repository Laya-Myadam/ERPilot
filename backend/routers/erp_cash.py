from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class CashRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # bank_recon | forecasting | bank_account | netting
    context: str
    legislation: str = "US"

@router.post("/generate")
def generate(req: CashRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "bank_recon":
        prompt = header + f"""You are an Oracle Cloud Cash Management expert. Generate a complete Bank Statement Reconciliation configuration.

Requirements:
{req.context}

## 1. BANK ACCOUNT SETUP
- Bank / branch / account structure in Oracle
- Account types: Operating / Payroll / Petty Cash / Concentration
- Account currency setup

## 2. BANK STATEMENT IMPORT
- Import file formats supported: BAI2, MT940, CAMT.053, CSV
- Automated import setup (SFTP / bank API)
- Manual upload process fallback

## 3. AUTO-RECONCILIATION RULES
Configure matching rules in priority order:
| Rule Priority | Match Type | Match Criteria |
1. Perfect match: Amount + Reference number
2. Near match: Amount ± tolerance + date range
3. Partial match: Partial payments
4. Manual match: Exception handling

## 4. MATCHING TOLERANCES
- Amount tolerance: $X or X%
- Date tolerance: ±X days
- Reference matching: exact / contains / fuzzy

## 5. EXCEPTION HANDLING
- Unmatched bank line process
- Unmatched system transaction process
- Bank error recording
- Outstanding check / deposit-in-transit

## 6. RECONCILIATION APPROVAL
- Who reviews reconciliation (Treasury Analyst / Controller)
- Monthly sign-off process
- Escalation for unreconciled items

## 7. ORACLE CONFIGURATION STEPS
Cash Management reconciliation setup sequence

## 8. KEY REPORTS
Bank reconciliation summary, outstanding items, aging unreconciled

Use exact Oracle Cloud Cash Management field names."""

    elif req.tool_type == "forecasting":
        prompt = header + f"""You are an Oracle Cloud Cash Management expert. Generate a complete Cash Forecasting configuration.

Requirements:
{req.context}

## 1. FORECAST MODEL SETUP
- Forecast horizon: daily / weekly / 13-week / annual
- Forecast sources to include:
  - AR: expected receipts by aging bucket
  - AP: scheduled payments by due date
  - Payroll: next pay dates
  - Treasury: debt payments, interest
  - Projects: expected billings and receipts

## 2. CASH POSITION REPORT
- Daily cash position: opening + receipts - disbursements = closing
- Bank account grouping by currency / entity / purpose
- Intraday liquidity monitoring setup

## 3. FORECAST ACCURACY TRACKING
- Forecast vs. actual variance reporting
- Variance threshold alerts
- Forecast adjustment audit trail

## 4. ROLLING FORECAST PROCESS
- Weekly update cadence
- Who inputs forecast data (AP, AR, Treasury)
- Approval and lock process

## 5. LIQUIDITY ANALYSIS
- Minimum cash buffer policy
- Short-term investment trigger threshold
- Credit line draw trigger threshold
- Alert when cash falls below minimum

## 6. ORACLE CONFIGURATION STEPS
Cash Forecasting setup in Oracle Cloud

## 7. INTEGRATION SOURCES
How each Oracle module feeds the forecast (AR, AP, Payroll, GL)

Use exact Oracle Cloud Cash Management field names."""

    elif req.tool_type == "bank_account":
        prompt = header + f"""You are an Oracle Cloud Cash Management expert. Generate a complete Bank Account Setup Checklist.

Requirements:
{req.context}

## 1. BANK SETUP IN ORACLE
Step-by-step:
1. Create Bank (institution details, routing number, SWIFT/BIC)
2. Create Branch (branch name, address, BIC)
3. Create Bank Account (account number, currency, account type)

## 2. BANK ACCOUNT FIELDS REQUIRED
| Field | Description | Required |
- Account Name
- Account Number (masked)
- Currency
- Account Type (Checking / Savings / Concentration)
- GL Cash Account mapping
- Minimum Balance (if applicable)

## 3. PAYMENT DOCUMENT SETUP
Per payment method (Check / ACH / Wire / EFT):
- Payment format: Oracle-supplied vs. custom NACHA/SWIFT
- Remittance advice setup
- Positive Pay file configuration
- Bank transmission method (SFTP / API)

## 4. BANK ACCOUNT SIGNATORIES
- Authorized signatories by account
- Dual control threshold (two signatures required above $X)
- Oracle user access controls per bank account

## 5. BANK ACCOUNT CONTROLS
- Account access by business unit / legal entity
- Payment source restrictions per account
- Wire transfer daily limit controls

## 6. ORACLE CONFIGURATION STEPS
Ordered bank setup sequence

## 7. TESTING CHECKLIST
Items to verify before go-live

Use exact Oracle Cloud Cash Management field names."""

    else:  # netting
        prompt = header + f"""You are an Oracle Cloud Cash Management expert. Generate a complete Netting Setup configuration.

Requirements:
{req.context}

## 1. NETTING OVERVIEW
- Netting type: Bilateral / Multilateral
- Settlement currency
- Netting entity setup (legal entities participating)
- Netting frequency (weekly / monthly)

## 2. NETTING AGREEMENT SETUP
- Netting agreement name and effective date
- Participating companies and accounts
- Offset rules: AP against AR within same entity pair
- Minimum net amount to settle

## 3. NETTING BATCH PROCESS
- Batch creation: which transactions to include
- Transaction cutoff date
- Netting proposal review step
- Settlement instruction generation

## 4. SETTLEMENT ACCOUNTING
- Journal entries generated by netting settlement
- Intercompany balancing entries
- Settlement account configuration
- Gain/loss on FX settlement (if multi-currency)

## 5. NETTING APPROVAL WORKFLOW
- Netting proposal approval: Treasury → Controller
- Override and exclusion rules
- Dispute resolution process

## 6. REPORTING
- Netting settlement summary report
- Pre-netting vs. post-netting cash position
- Intercompany balance reconciliation

## 7. ORACLE CONFIGURATION STEPS
Netting setup sequence in Oracle Cloud

Use exact Oracle Cloud Cash Management field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"ERP Cash: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
