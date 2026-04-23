from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ProjectsRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # project_type | cost_collection | billing | budget
    context: str
    legislation: str = "US"

@router.post("/generate")
def generate(req: ProjectsRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "project_type":
        prompt = header + f"""You are an Oracle Cloud Project Portfolio Management expert. Generate a complete Project Type and Template configuration.

Requirements:
{req.context}

## 1. PROJECT TYPE DEFINITIONS
For each project type, configure:
| Project Type | Purpose | Billing Type | Cost Tracking | WBS Required |
Examples:
- Capital Projects (CAPEX)
- Customer Billable Projects (T&M)
- Fixed Price Customer Projects
- Internal IT Projects
- R&D Projects
- Overhead/Indirect Projects

## 2. PROJECT TEMPLATE DESIGN
For each major project type, create a template:
- WBS structure (top levels pre-built)
- Default task types
- Default resource roles
- Default billing rules (if billable)
- Project status report frequency

## 3. WBS STRUCTURE STANDARDS
- WBS coding convention
- Maximum WBS depth (recommended 4-5 levels)
- Mandatory tasks in all projects (project mgmt, closeout)
- Chargeable vs. non-chargeable task setup

## 4. PROJECT ROLES AND RESOURCES
- Project role definitions (Project Manager, Architect, Developer, etc.)
- Role-based billing rates
- Named resource assignment rules

## 5. PROJECT STATUS CONFIGURATION
- Project status values: Planning / Active / On Hold / Closed
- Status change approval rules
- Mandatory fields per status transition

## 6. ORACLE CONFIGURATION STEPS
Project Management setup sequence

## 7. TEST SCENARIOS
2 scenarios: T&M project setup, capital project setup

Use exact Oracle Cloud Project Management field names."""

    elif req.tool_type == "cost_collection":
        prompt = header + f"""You are an Oracle Cloud Project Costing expert. Generate a complete Cost Collection Rule configuration.

Requirements:
{req.context}

## 1. EXPENDITURE TYPES
Define expenditure types for each cost category:
| Expenditure Type | Category | Capitalization Rule | Billable Default |
- Labor: Regular Time, Overtime, Fringe Benefits
- Materials: Direct Materials, Supplies, Equipment
- Subcontractor costs
- Travel and Expense: Airfare, Hotel, Meals, Mileage
- Overhead: Indirect labor burden, facility costs

## 2. LABOR COST COLLECTION
- Timecard integration from HCM Time & Labor
- Costing rates by employee / job role / job level
- Burden (overhead) schedule setup
- Labor cost transfer rules

## 3. NON-LABOR COST COLLECTION
- Supplier invoice cost allocation to projects (AP integration)
- Expense report allocation (Expenses module integration)
- Inventory/material issue to projects

## 4. BURDEN / INDIRECT COST SETUP
- Burden schedule definition (burden base × rate)
- Fringe benefit rates
- Overhead allocation rates
- G&A allocation methodology

## 5. COST CAPITALIZATION RULES
- Capitalizable vs. expensable cost rules (ASC 350 / IAS 38)
- Capitalization threshold
- Transfer from CIP to fixed asset trigger

## 6. ORACLE CONFIGURATION STEPS
Cost collection setup sequence

## 7. TEST SCENARIOS
3 scenarios: labor costing, supplier invoice allocation, overhead burden

Use exact Oracle Cloud Project Costing field names."""

    elif req.tool_type == "billing":
        prompt = header + f"""You are an Oracle Cloud Project Billing expert. Generate a complete Billing Setup configuration.

Requirements:
{req.context}

## 1. BILLING METHODS
Configure billing rules for each contract type:

### Time & Materials (T&M)
- Bill rate schedules by resource role
- Bill rate override rules
- Invoice frequency (monthly / milestone / completion)

### Fixed Price
- Milestone billing schedule setup
- % complete billing vs. milestone event
- Retention setup and release rules

### Cost Plus
- Cost multiplier setup
- Allowable vs. unallowable cost rules (especially government contracts)
- Fee calculation method

## 2. BILL RATE SCHEDULES
- Standard bill rates by job title / level
- Client-specific rate overrides
- Effective date management for rate changes
- Currency and exchange rate handling

## 3. INVOICE GENERATION
- Invoice template setup
- Grouping rules (by project / task / resource)
- Invoice detail level (summary vs. detailed)
- Credit memo generation process

## 4. REVENUE RECOGNITION
- Revenue recognition method: Percentage of Completion / Completed Contract
- POC calculation: cost-to-cost / effort expended
- Unbilled receivable accounting
- Revenue vs. billing timing reconciliation

## 5. ORACLE CONFIGURATION STEPS
Project Billing setup sequence

## 6. TEST SCENARIOS
3 scenarios: T&M monthly billing, milestone billing, over-billing adjustment

Use exact Oracle Cloud Project Billing field names."""

    else:  # budget
        prompt = header + f"""You are an Oracle Cloud Project Financial Management expert. Generate a complete Project Budget configuration.

Requirements:
{req.context}

## 1. BUDGET TYPES CONFIGURATION
- Budget versions: Original / Revised / Forecast
- Budget entry method (top-down / bottom-up / hybrid)
- Budget period type (project life / fiscal year / period)

## 2. BUDGET ENTRY STRUCTURE
- Budget at which WBS level (task / top task / project)
- Resources or resource groups to budget against
- Quantities vs. amounts approach
- Labor hours budget setup

## 3. BUDGET APPROVAL WORKFLOW
- Budget submission trigger
- Review chain: Project Manager → PMO → Finance → Exec
- Budget revision approval rules
- Emergency budget adjustment process

## 4. BUDGET CONTROLS
- Hard vs. soft budget controls by cost type
- Override rules and approvals
- Alert thresholds: 80% / 90% / 100% consumed
- Commitment (PO/timecard) inclusion in budget check

## 5. BUDGET FORECASTING
- EAC (Estimate at Completion) method: ETC + Actual
- ETC entry frequency and approval
- Variance analysis: Budget vs. Actual vs. EAC
- Earned Value Management (EVM) setup if required

## 6. FINANCIAL PLAN REPORTING
- Budget vs. actual cost reports
- Project profitability analysis
- Cash flow projection from project financials

## 7. ORACLE CONFIGURATION STEPS
Project Budget setup sequence

Use exact Oracle Cloud Project Financial Management field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"ERP Projects: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
