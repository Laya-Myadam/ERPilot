from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class JDEDistributionRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # item_master | supplier_customer | open_orders | branch_plant
    context: str
    jde_version: str = "9.2"

@router.post("/generate")
def generate(req: JDEDistributionRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nJDE Version: {req.jde_version}\n\n"

    if req.tool_type == "item_master":
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete JDE Item Master to Oracle Cloud Inventory migration mapping.

Requirements:
{req.context}

## 1. JDE ITEM MASTER SCOPE (F4101)
- Total item count estimate
- Item types: Purchased / Manufactured / Phantom / Kit / Service
- Stocking types and category codes used
- Branch/Plant item setup (F4102)

## 2. FIELD MAPPING TABLE
| JDE F4101 Field | Description | Oracle Cloud Field | Transformation |
Key mappings:
- ITM (Item Number) → Item Number
- LITM (2nd Item) → Customer Item Number
- AITM (3rd Item) → Supplier Item Number
- DSC1/DSC2 (Description) → Item Description
- STKT (Stocking Type) → Item Type
- UPCN (UPC Code) → GTIN
- UMUM (Primary UOM) → Primary UOM
- GLPT (GL Class) → Item Category / GL Account
- SRCE (Source) → Make or Buy
- SHCM (Shelf Life) → Shelf Life Days

## 3. BRANCH/PLANT DATA (F4102)
- Branch/Plant → Inventory Organization mapping
- Subinventory setup in Oracle
- Locator setup (if using JDE lot/location)

## 4. ITEM CATEGORIES IN ORACLE
- Category sets needed in Oracle (purchasing, inventory, costing)
- Mapping JDE category codes to Oracle categories

## 5. DATA CLEANSING REQUIREMENTS
- Inactive items (no transactions in 2+ years) — exclude or migrate?
- Duplicate items across branches
- Missing required Oracle fields
- UOM standardization

## 6. FBDI / HDL FILE REQUIREMENTS
- Oracle Cloud Inventory Item FBDI template
- Required fields and validations
- Load sequence: Category Sets → Items → Org-level data

## 7. RECONCILIATION
- JDE item count vs. Oracle item count post-load
- Category code reconciliation

Use JDE F4101/F4102 field names (1-character codes) and Oracle Cloud Inventory field names."""

    elif req.tool_type == "supplier_customer":
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete Supplier and Customer Master cleansing and migration guide.

Requirements:
{req.context}

## 1. JDE ADDRESS BOOK ASSESSMENT (F0101)
- Total address book records (all types: suppliers, customers, employees, others)
- Address types in scope: AN8 type codes for suppliers (V) and customers (C)
- Category codes used for classification
- Known data quality issues (duplicates, incomplete records)

## 2. SUPPLIER MIGRATION (F0401 / F0101)
### Field Mapping:
| JDE Field | Description | Oracle Supplier Field | Transformation |
- AN8 → Supplier Number (may need renumbering)
- ALPH → Supplier Name
- Tax ID → Tax Registration Number
- AT1 (Address Type) → Supplier Type
- Payment Terms (URAB) → Payment Terms
- Currency Code → Currency
- TAXC → Tax Classification

### Data Cleansing:
- Duplicate suppliers (same name, different AN8)
- Inactive suppliers (no PO in 2+ years)
- Missing tax IDs (1099 suppliers)
- Address standardization

## 3. CUSTOMER MIGRATION (F03012 / F0101)
### Field Mapping:
| JDE Field | Description | Oracle Customer Field | Transformation |
- AN8 → Customer Account Number
- ALPH → Customer Name
- Credit Limit (ACL) → Credit Limit
- Payment Terms → Payment Terms
- Price Group → Price List Assignment

### Data Cleansing:
- Inactive customers (no AR in 2+ years)
- Duplicate bill-to / ship-to sites
- Credit limit cleanup

## 4. FBDI TEMPLATE REQUIREMENTS
- Oracle Supplier FBDI: SupplierImportTemplate.xlsx
- Oracle Customer FBDI: CustAccountImport.xlsx
- Load sequence and dependencies

## 5. RECONCILIATION
- JDE supplier count vs. Oracle post-migration
- Open balance reconciliation (AP/AR subledger)

Use JDE F-table notation and Oracle Cloud Financials field names."""

    elif req.tool_type == "open_orders":
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete Open PO and Open Sales Order migration approach.

Requirements:
{req.context}

## 1. OPEN PURCHASE ORDER MIGRATION (F4311)
### Scope Assessment:
- Open PO count (status < 999)
- PO types to migrate: Standard (OP) / Blanket (OB) / Subcontract (OS)
- Receipt-to-invoice matching status

### Field Mapping:
| JDE F4311 Field | Description | Oracle PO Field | Notes |
- DOCO → PO Number
- KCOO → Business Unit → Oracle BU
- LINC → Line Number
- LNID → Shipment Line
- VR01 (Supplier PO#) → Supplier Order Number
- ITM → Item Number
- UORG → Quantity Ordered
- PRRC → Unit Price
- PDDJ → Promised Date → Promised Delivery Date

### Migration Decisions:
- Migrate open receipts (F43121) — how to handle received/not-invoiced
- Partially received POs — split or migrate as-is
- Blanket POs — remaining quantity/amount

## 2. OPEN SALES ORDER MIGRATION (F4201/F4211)
### Field Mapping:
| JDE F4211 Field | Description | Oracle SO Field | Notes |
- DOCO → Order Number
- AN8 → Customer → Oracle Customer Account
- ITM → Item → Oracle Item
- UORG → Quantity Ordered
- UPRC → Unit Price
- RSDJ → Requested Date

### Migration Decisions:
- Orders in Pick/Ship status — complete in JDE or migrate?
- Back orders — migrate with special status
- Deposits/prepayments — handle as down payments in Oracle

## 3. CUTOVER STRATEGY
- Data freeze: no new JDE orders after cut-off date
- Delta orders: any orders entered during migration weekend
- Verification report: JDE open order value vs. Oracle

## 4. FBDI TEMPLATES
- Oracle PO Import FBDI template
- Oracle Order Import FBDI template
- Validation scripts

Use JDE F-table field codes and Oracle Cloud SCM field names."""

    else:  # branch_plant
        prompt = header + f"""You are a JDE to Oracle Cloud migration expert. Generate a complete Branch/Plant to Oracle Business Unit mapping.

Requirements:
{req.context}

## 1. JDE BRANCH/PLANT STRUCTURE (F41001)
Current state:
- List of all branch/plants and their business purpose
- Branch/plant types: Manufacturing / Distribution / Service / Office
- Inventory stocking branches vs. non-stocking
- Interplant transfer relationships

## 2. ORACLE CLOUD ORGANIZATION MAPPING
| JDE Branch/Plant | JDE Type | Oracle Inventory Org | Oracle BU | BU Set | Notes |

Design decisions:
- 1:1 mapping (each JDE BP → 1 Oracle Org) vs. consolidation
- Shared service center approach for Oracle BUs
- Master Organization definition

## 3. INVENTORY ORGANIZATION DESIGN
For each Oracle Inventory Org:
- Org code and name
- Legal entity assignment
- Item Master Org (master vs. child org)
- Costing organization setup (average / standard)
- Subinventory design replacing JDE locations

## 4. SUBINVENTORY AND LOCATOR DESIGN
- JDE Location (LOCN) → Oracle Subinventory
- JDE Lot Number → Oracle Lot Control setup
- JDE Serial Number → Oracle Serial Control

## 5. INTERPLANT TRANSFERS
- JDE internal orders (branch transfers) → Oracle Internal Requisitions
- Transfer pricing setup
- In-transit inventory handling

## 6. COSTING IMPLICATIONS
- Cost organization per inventory org
- Standard vs. average cost per org
- Cost group assignment

## 7. ORACLE CONFIGURATION STEPS
Org setup sequence: Master Org → Child Orgs → Subinventories → Parameters

Use JDE Branch/Plant (MMCU) terminology and Oracle Inventory Org field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"JDE Distribution: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
