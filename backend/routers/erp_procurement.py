from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ProcurementRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # policy | approval_hierarchy | supplier_qual | contract_mgmt
    context: str
    legislation: str = "US"

@router.post("/generate")
def generate(req: ProcurementRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "policy":
        prompt = header + f"""You are an Oracle Cloud Procurement expert. Generate a complete Procurement Policy configuration.

Requirements:
{req.context}

## 1. PROCUREMENT POLICY OVERVIEW
- Policy name and scope (all BUs / specific entities)
- Purchase order types to enable (Standard PO / Blanket / Contract / Planned)
- Requisition types (Purchase / Internal Transfer)
- Policy enforcement method (hard stop / warning / audit)

## 2. PURCHASE AUTHORIZATION THRESHOLDS
| Approval Level | Min Amount | Max Amount | PO Type |
- Requestor self-approval limit
- Manager approval thresholds
- Director / VP / CFO thresholds
- Emergency procurement exceptions

## 3. SOURCING REQUIREMENTS
- Competitive quote rules (e.g., 3 quotes required over $10K)
- Sole source justification process
- Preferred supplier priority rules
- Restricted supplier list

## 4. CATEGORY-SPECIFIC RULES
- IT purchases: IT approval required
- Capital purchases: Finance approval + capitalization threshold
- Professional services: Legal review for contracts over $50K
- Travel: Pre-trip approval requirements

## 5. DOCUMENT RETENTION
- PO retention period
- Quote documentation requirements
- Approval audit trail requirements

## 6. ORACLE CONFIGURATION STEPS
Procurement policy setup in Oracle Cloud

## 7. PURCHASING CONTROLS SETUP
Oracle Purchasing controls to configure

Use exact Oracle Cloud Procurement field names."""

    elif req.tool_type == "approval_hierarchy":
        prompt = header + f"""You are an Oracle Cloud Procurement expert. Generate a complete Purchasing Approval Hierarchy design.

Requirements:
{req.context}

## 1. APPROVAL HIERARCHY STRUCTURE
- Hierarchy type: Position / Job / Employee
- Single vs. parallel approval routing
- Approval group vs. individual approver

## 2. PURCHASE ORDER APPROVAL RULES
Design the complete approval matrix:

| PO Amount | Approval Chain | Timeout (days) | Escalation |
$0–$2,500 → Requestor's Manager
$2,500–$10,000 → Manager + Department Director
$10,000–$50,000 → Director + VP Finance
$50,000–$200,000 → VP Finance + CFO
>$200,000 → CFO + CEO/Board approval

## 3. REQUISITION APPROVAL RULES
- Separate or same approval for requisitions?
- Budget check before or after approval?
- Category-based routing (IT, Facilities, Marketing)

## 4. DELEGATION RULES
- Temporary delegation setup (vacation coverage)
- Delegation limits (can only delegate up to own authority)
- Delegation audit trail

## 5. AUTOMATED ROUTING RULES
- PO auto-approval for preferred suppliers under threshold
- PO auto-approval for contract-backed purchases
- Budget hold: auto-hold when exceeds budget

## 6. WORKFLOW NOTIFICATIONS
- Approval request email template
- Reminder cadence (after X days no action)
- Escalation notification

## 7. ORACLE CONFIGURATION STEPS
AME (Approval Management Engine) setup for procurement

## 8. TEST SCENARIOS
3 scenarios: within threshold, escalation, delegation

Use exact Oracle Cloud Procurement field names."""

    elif req.tool_type == "supplier_qual":
        prompt = header + f"""You are an Oracle Cloud Supplier Management expert. Generate a complete Supplier Qualification Checklist and onboarding configuration.

Requirements:
{req.context}

## 1. SUPPLIER REGISTRATION PROCESS
- Self-registration portal setup
- Required fields for supplier registration
- Supplier categories and classification
- Diversity classification setup (MBE, WBE, SBE, etc.)

## 2. QUALIFICATION CRITERIA
Define qualification requirements by spend category:
| Category | Certifications Required | Insurance Minimums | References | Financial Check |
- IT/Technology suppliers
- Professional Services
- Manufacturing/Materials
- Facilities/Construction
- Logistics/Distribution

## 3. QUALIFICATION WORKFLOW
- Qualification request trigger
- Documents required (insurance cert, W-9, SOC2, etc.)
- Review steps: Procurement → Finance → Risk → Legal
- Approval/rejection notification

## 4. RISK ASSESSMENT
- Supplier risk rating framework
- Third-party risk assessment integration
- Annual re-qualification schedule
- High-risk supplier monitoring

## 5. SUPPLIER PERFORMANCE SCORECARD
- Performance metrics to track (quality, delivery, pricing, responsiveness)
- Scorecard frequency (quarterly)
- Performance threshold for preferred status
- Consequence for poor performance (probation / termination)

## 6. ORACLE CONFIGURATION STEPS
Oracle Supplier Qualification Management setup

## 7. SUPPLIER PORTAL SETUP
Self-service supplier portal configuration

Use exact Oracle Cloud Supplier Management field names."""

    else:  # contract_mgmt
        prompt = header + f"""You are an Oracle Cloud Procurement Contract Management expert. Generate a complete Contract Management configuration.

Requirements:
{req.context}

## 1. CONTRACT TYPES CONFIGURATION
- Purchase Agreement types: Blanket Purchase Agreement (BPA), Contract Purchase Agreement (CPA)
- Contract classification: Goods / Services / Construction / Software
- Standard terms by contract type

## 2. CONTRACT TEMPLATE LIBRARY
- Standard contract templates per category
- Clause library setup (standard, optional, custom)
- Approved language for common clauses
- Non-standard clause approval process

## 3. CONTRACT CREATION WORKFLOW
- Contract request initiation (procurement / legal / business)
- Internal review and redline process
- Legal review triggers (above $X / specific categories)
- Approval chain: Procurement → Legal → Finance → Exec (by threshold)

## 4. CONTRACT RENEWAL AND ALERTS
- Expiry alert timeline: 180 / 90 / 30 days before expiry
- Auto-renewal rules and prevention
- Renewal initiation workflow
- Price escalation clause tracking

## 5. CONTRACT COMPLIANCE MONITORING
- Spend under contract vs. off-contract tracking
- PO-to-contract linkage enforcement
- Contract utilization reports

## 6. ORACLE CONFIGURATION STEPS
Oracle Contract Management setup sequence

## 7. INTEGRATION WITH PURCHASING
- How contracts link to BPAs and standard POs
- Release against BPA setup

Use exact Oracle Cloud Contract Management field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"ERP Procurement: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
