from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class JDEManufacturingRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # bom_routing | work_orders | scm_mapping | shop_floor
    context: str
    jde_version: str = "9.2"

@router.post("/generate")
def generate(req: JDEManufacturingRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nJDE Version: {req.jde_version}\n\n"

    if req.tool_type == "bom_routing":
        prompt = header + f"""You are a JDE Manufacturing to Oracle Cloud SCM migration expert. Generate a complete BOM and Routing migration mapping.

Requirements:
{req.context}

## 1. JDE BOM SCOPE (F3002 — Bill of Material)
- Total BOM count
- BOM types: Engineering (00) / Manufacturing (01) / Planning (02)
- BOM levels (average depth)
- Phantom assemblies

### Field Mapping F3002:
| JDE Field | Description | Oracle Cloud BOM Field | Transformation |
- ITM (Parent Item) → Assembly Item Number
- CPNT (Component) → Component Item Number
- BQTY → Quantity Per Assembly
- STKT (Component Type) → Item Type
- OPSC → Operation Sequence → Reference Designator
- EFFF / EFFE → Effective From/To dates → Effectivity Dates
- SCRP → Scrap Factor → Yield

## 2. JDE ROUTING SCOPE (F3003 — Routing Master)
### Field Mapping:
| JDE Field | Description | Oracle Cloud Routing Field | Transformation |
- ITM → Assembly
- OPSQ → Operation Sequence → Operation Sequence Number
- WRKT → Work Center → Department
- SETL → Setup Hours → Setup Time
- RUNL → Run Hours → Run Time
- MACR → Machine Hours → Machine Time
- INID → Instructions → Operation Description

## 3. WORK CENTER MAPPING
- JDE Work Center (F30006) → Oracle Department / Resource
- Work center efficiency and utilization rates
- Machine vs. labor resource split

## 4. DATA CLEANSING
- Inactive BOMs (no WO usage in 2+ years)
- BOM component supersession cleanup
- Routing with zero times — needs review

## 5. ORACLE FBDI TEMPLATES
- Bill of Materials Import FBDI
- Routings Import FBDI
- Load sequence: Resources → Departments → Items → BOMs → Routings

## 6. RECONCILIATION
- BOM count reconciliation
- Component count per BOM check
- Routing time validation

Use JDE F-table notation (F3002/F3003) and Oracle Cloud Manufacturing field names."""

    elif req.tool_type == "work_orders":
        prompt = header + f"""You are a JDE Manufacturing to Oracle Cloud migration expert. Generate a complete Work Order migration guide.

Requirements:
{req.context}

## 1. JDE WORK ORDER SCOPE (F4801 — Work Order Master)
- Open WO count by status
- WO types: Manufacturing (WO) / Rework / Engineering Change
- Status codes to migrate: 10 (Entered) through 90 (Complete, not closed)
- Decision: migrate in-progress WOs or close in JDE first?

## 2. FIELD MAPPING (F4801):
| JDE Field | Description | Oracle Cloud WO Field | Transformation |
- DOCO → Work Order Number
- DCTO → Work Order Type → Work Order Type
- ITM → Assembly → Assembly Item
- UORG → Quantity Ordered → Start Quantity
- STRT → Start Date → Scheduled Start Date
- DRQJ → Requested Date → Scheduled Completion Date
- SRST → Work Order Status → Status

## 3. WORK ORDER COMPONENTS (F3111)
- Open component demand migration
- Issued vs. remaining quantity tracking
- Substitution component handling

## 4. COMPLETIONS (F31121)
- Partial completions in JDE → how to represent in Oracle
- Scrap reporting migration
- Co-product and by-product handling

## 5. WIP INVENTORY VALUE
- WIP balance reconciliation approach
- JDE F3102 (WIP quantities) → Oracle WIP accounting
- WIP variance calculation alignment

## 6. CUTOVER APPROACH
- Complete all JDE WOs possible before cutover
- In-progress WOs: manual re-entry vs. migration
- WIP inventory balance transfer method

## 7. ORACLE FBDI / API
- Oracle Manufacturing Work Order FBDI
- Required fields and validation rules

Use JDE F4801 field notation and Oracle Cloud Manufacturing field names."""

    elif req.tool_type == "scm_mapping":
        prompt = header + f"""You are a JDE and Oracle Cloud SCM expert. Generate a complete JDE Manufacturing to Oracle Cloud SCM module comparison and mapping.

Requirements:
{req.context}

## 1. MODULE COMPARISON TABLE
| Business Function | JDE Module | JDE App | Oracle Cloud Equivalent | Gap / Notes |
- Bill of Materials → JDE PDM → Oracle BOM
- Routings → JDE PDM → Oracle Manufacturing
- Work Orders → JDE Shop Floor → Oracle Work Execution
- MRP/Planning → JDE Requirements Planning → Oracle Supply Planning
- Costing → JDE Cost Management → Oracle Cost Management
- Quality → JDE Quality Management → Oracle Quality Management
- Kanban → N/A or custom → Oracle Kanban
- Outsourced Manufacturing → JDE WO → Oracle Outsourced Manufacturing

## 2. FUNCTIONAL GAPS
Key JDE capabilities not directly available in Oracle Cloud:
- List gaps with Oracle workaround or roadmap item

## 3. PROCESS FLOW COMPARISON
### Order-to-Ship (Make-to-Order):
JDE process steps → Oracle Cloud equivalent steps

### Make-to-Stock:
JDE process → Oracle Cloud equivalent

## 4. CONFIGURATION MAPPING
Critical configuration objects that must exist in Oracle before go-live:
| JDE Setup Object | Oracle Cloud Equivalent | Migration or Manual Setup |

## 5. INTEGRATION POINTS
- Oracle Cloud Manufacturing → Oracle Cloud Procurement (MRO)
- Oracle Cloud Manufacturing → Oracle Cloud Inventory
- Oracle Cloud Manufacturing → Oracle Costing

## 6. TRAINING IMPACT
What manufacturing users need to learn: screen changes, terminology changes, new process steps

## 7. GO-LIVE RISK AREAS
Top 5 risks for manufacturing go-live from JDE

Use JDE and Oracle Cloud SCM terminology precisely."""

    else:  # shop_floor
        prompt = header + f"""You are a JDE Shop Floor Control to Oracle Cloud migration expert. Generate a complete Shop Floor Control migration assessment.

Requirements:
{req.context}

## 1. JDE SHOP FLOOR CAPABILITIES (CURRENT)
- Work Order dispatch list (P48201)
- Labor entry and completions (P31114)
- Move transactions between operations
- Shop floor control category codes
- Tooling requirements tracking (if used)
- Shop floor WO reporting

## 2. ORACLE CLOUD WORK EXECUTION (FUTURE)
- Oracle Work Execution vs. JDE Shop Floor — feature comparison
- Dispatch Workbench setup
- Operation transaction types: Move / Complete / Scrap / Reverse
- IoT / machine integration capabilities

## 3. DATA COLLECTION MIGRATION
- JDE labor entry → Oracle Production Transaction
- JDE WO move transactions → Oracle Move Transactions
- Shift / time period definition mapping

## 4. WORK CENTER SETUP IN ORACLE
- JDE Work Center (F30006) → Oracle Department + Resource
- Resource efficiency and utilization setup
- Shift calendar per work center

## 5. DISPATCH RULES
- JDE dispatch logic (by date / priority) → Oracle Dispatch rules
- Queue management setup
- Constraint-based scheduling consideration

## 6. SHOP FLOOR REPORTING
- JDE Shop Floor reports → Oracle equivalent
- OEE (Overall Equipment Effectiveness) if applicable
- Production variance reporting setup

## 7. TRAINING PLAN FOR SHOP FLOOR USERS
- Terminal/device requirements
- Process walkthrough: start WO → complete operation → record labor → complete WO
- Change management considerations for production floor staff

## 8. TRANSITION APPROACH
- Run JDE and Oracle in parallel during transition period?
- Minimum viable setup for shop floor go-live

Use JDE Shop Floor Control terminology and Oracle Cloud Manufacturing Work Execution field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"JDE Manufacturing: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
