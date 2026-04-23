from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class JDEFinanceRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # gl_migration | coa_rationalization | period_close | bu_mapping
    context: str
    jde_version: str = "9.2"

@router.post("/generate")
def generate(req: JDEFinanceRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nJDE Version: {req.jde_version}\n\n"

    if req.tool_type == "gl_migration":
        prompt = header + f"""You are a JDE to Oracle Cloud ERP migration expert. Generate a complete JDE Finance (09) to Oracle Cloud GL migration mapping.

Requirements:
{req.context}

## 1. JDE FINANCE MODULE SCOPE
- JDE F0902 (Account Balances) migration approach
- JDE F0911 (Account Ledger — journal entries) — years to migrate
- JDE F0901 (Account Master) → Oracle COA mapping

## 2. CHART OF ACCOUNTS MAPPING
| JDE Field | JDE Table | Oracle Cloud GL Field | Transformation |
- Company (CO) → Legal Entity / Balancing Segment
- Business Unit (MCU) → Cost Center / Department Segment
- Object Account (OBJ) → Natural Account Segment
- Subsidiary (SUB) → Sub-account or Project Segment
- Subledger → Oracle Subledger field

## 3. ACCOUNT BALANCE MIGRATION (F0902)
- Opening balance as-of date
- Which ledger types to migrate (AA/BA/CA)
- Currency ledger migration (domestic vs. foreign)
- Intercompany balance handling

## 4. HISTORICAL JOURNAL MIGRATION (F0911)
- How many years of journals to migrate
- Journal header fields: Document Type, Company, Period, Explanation
- Journal detail fields: Account, Amount, Subledger
- Batch structure in Oracle vs. JDE journal batches

## 5. DATA QUALITY ISSUES TO FIX IN JDE FIRST
- Unposted batches — must be resolved before migration
- Out-of-balance companies
- Inactive accounts with balances
- Duplicate business unit setups

## 6. FBDI FILE REQUIREMENTS
- Oracle Cloud GL Journal Import FBDI template
- Required fields and format
- Batch size recommendations
- Validation and error handling

## 7. RECONCILIATION APPROACH
- JDE trial balance vs. Oracle opening balances
- Variance tolerance and investigation process

Use JDE F-table and field names (Business Function notation)."""

    elif req.tool_type == "coa_rationalization":
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete COA Rationalization plan.

Requirements:
{req.context}

## 1. CURRENT STATE ASSESSMENT
- JDE account count by type (Asset / Liability / Equity / Revenue / Expense)
- Business units with overlapping/duplicate account setups
- Accounts with zero activity for 3+ years (candidate for elimination)
- Company-specific vs. standard accounts

## 2. RATIONALIZATION METHODOLOGY
Step-by-step approach:
1. Extract full JDE COA with last-activity dates
2. Classify each account: Keep / Merge / Retire
3. Build mapping table: old account → new Oracle account
4. Validate with department owners
5. Create cross-reference table for historical reporting

## 3. ACCOUNT CONSOLIDATION RULES
| Rationalization Rule | Example | Action |
- Duplicate accounts across companies → Merge into single natural account
- Overly granular detail accounts → Roll up to summary account
- Inactive for 3+ years + zero balance → Retire
- Region/entity-specific accounts → Standardize to Oracle segment

## 4. TARGET ORACLE ACCOUNT STRUCTURE
- Recommended account ranges post-rationalization
- From JDE (~X,000 accounts) to Oracle (~Y,000 accounts)
- Segment-based reporting replacement for JDE object/subsidiary detail

## 5. HISTORICAL REPORTING CROSSWALK
- How to report historical JDE data using new Oracle accounts
- Smart View / OTBI mapping tables
- Legacy account lookup table in Oracle

## 6. STAKEHOLDER APPROVAL PROCESS
- Review with each department owner
- Finance committee sign-off
- Audit committee notification

## 7. IMPLEMENTATION TIMELINE
Recommended rationalization timeline with parallel testing

Use JDE account structure terminology (Object/Subsidiary/Business Unit)."""

    elif req.tool_type == "period_close":
        prompt = header + f"""You are a JDE and Oracle Cloud ERP expert. Generate a complete Period Close Process Comparison and transition guide.

Requirements:
{req.context}

## 1. JDE PERIOD CLOSE SEQUENCE (CURRENT STATE)
Month-end close steps in JDE Finance 09:
1. Subledger reconciliation (AP, AR, FA)
2. Intercompany elimination
3. Post all unposted batches (P09800)
4. Period end summary (R09803)
5. Balance integrity test (R007031)
6. Create next period (P0010)
7. General Ledger reports

## 2. ORACLE CLOUD PERIOD CLOSE SEQUENCE (FUTURE STATE)
Oracle Cloud close steps — equivalent and new:
1. Subledger close (AP, AR, FA, Projects)
2. Run Create Accounting (subledger accounting)
3. Intercompany reconciliation and elimination
4. Journal import and posting review
5. Trial balance review
6. Financial statement generation
7. Period close task list completion
8. GL period status: Open → Close

## 3. KEY DIFFERENCES JDE vs. ORACLE CLOUD
| Close Step | JDE Process | Oracle Cloud Process | Notes |
Highlight: period status control, subledger accounting, intercompany

## 4. CLOSE CALENDAR SETUP
- Monthly close target (business day X of following month)
- Hard close vs. soft close approach
- Audit trail requirements

## 5. ORACLE CLOSE CHECKLIST
Detailed Oracle Cloud period-close checklist with:
- Owner per task
- Dependency chain
- Typical duration

## 6. TRAINING REQUIREMENTS
What the accounting team must learn new (Oracle-specific close)

Use JDE and Oracle Cloud accounting terminology."""

    else:  # bu_mapping
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete Business Unit to Legal Entity mapping.

Requirements:
{req.context}

## 1. JDE ORGANIZATION STRUCTURE (CURRENT)
Describe JDE's:
- Company (CO) structure — top-level entity
- Business Unit (MCU) structure — operational units
- Business Unit Category Codes — how BUs are classified
- Address Book (F0101) company structure

## 2. ORACLE CLOUD ORGANIZATION STRUCTURE
Oracle Cloud equivalents:
- Legal Entity → maps from JDE Company
- Business Unit → maps from JDE Business Unit
- Ledger → maps from JDE Company/Ledger Type
- Reference Data Set → shared data approach

## 3. MAPPING TABLE
| JDE Company | JDE Company Name | Oracle Legal Entity | Oracle Business Unit | Oracle Ledger | Notes |

For each JDE Business Unit:
| JDE BU | JDE BU Name | BU Type | Oracle BU | Oracle BU Set | Cost Center Segment |

## 4. DESIGN DECISIONS
- One Oracle BU per JDE BU or consolidation?
- Shared service center setup (AP/AR centralized)
- Intercompany setup between new Oracle legal entities

## 5. REFERENCE DATA SHARING
- Which reference data is shared vs. BU-specific
- Enterprise vs. BU-level configuration decisions

## 6. SECURITY IMPLICATIONS
- Data access model: which users see which BUs
- Oracle data roles needed per BU
- Transition from JDE security groups

## 7. IMPLEMENTATION SEQUENCE
Recommended order for creating Oracle org structure

Use JDE Company/MCU notation and Oracle Cloud organization field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"JDE Finance: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
