from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class FixedAssetsRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # asset_category | depreciation | migration | retirement
    context: str
    legislation: str = "US"

@router.post("/generate")
def generate(req: FixedAssetsRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "asset_category":
        prompt = header + f"""You are an Oracle Cloud Fixed Assets expert. Generate a complete Asset Category configuration spec.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Fixed Assets Category setup:

## 1. ASSET CATEGORY STRUCTURE
Design asset categories appropriate for this company:

| Category Name | Asset Type | Useful Life (yrs) | Depreciation Method | Salvage % | GL Account |
Include at minimum:
- Buildings & Improvements
- Machinery & Equipment
- Computer Hardware
- Computer Software
- Furniture & Fixtures
- Vehicles
- Leasehold Improvements
- Land (non-depreciable)
- Construction in Progress (CIP)

## 2. DEPRECIATION METHODS PER CATEGORY
For each category:
- Book depreciation method (Straight-Line / Declining Balance / Sum of Years / Units of Production)
- Tax depreciation method (MACRS / ADS / Section 179)
- Prorate convention (Full Month / Half Year / Mid-Quarter)

## 3. GL ACCOUNT MAPPING PER CATEGORY
- Asset cost account
- Accumulated depreciation account
- Depreciation expense account
- Gain/loss on disposal accounts
- CIP account (if applicable)

## 4. CAPITALIZATION THRESHOLDS
- Minimum dollar amount to capitalize per category
- Useful life minimum to capitalize
- Expensing rules for items below threshold

## 5. ORACLE CONFIGURATION STEPS
Asset category setup sequence

## 6. TEST SCENARIOS
3 test cases: asset addition, mid-year addition, low-value expensing

Use exact Oracle Cloud Fixed Assets field names."""

    elif req.tool_type == "depreciation":
        prompt = header + f"""You are an Oracle Cloud Fixed Assets expert. Generate a complete Depreciation Rule configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Fixed Assets Depreciation setup:

## 1. BOOK DEPRECIATION CONFIGURATION
For each depreciation method used:

### Straight-Line
- Prorate convention options
- Salvage value handling
- Half-year convention rules

### Declining Balance / 150DB / 200DB
- DB rate calculation
- Switch to straight-line trigger
- Remaining life method

### MACRS (US Tax)
- MACRS class lives by asset category
- Recovery period table
- ADS alternative depreciation
- Section 179 immediate expensing setup

## 2. DEPRECIATION BOOKS SETUP
- Corporate book (GAAP)
- Tax book (MACRS)
- Book sync rules (primary vs. associated books)
- CIP book (for assets under construction)

## 3. PRORATE CONVENTIONS
- Full Month convention: entry and retirement
- Half-Year convention: when applicable
- Mid-Quarter convention: trigger rules

## 4. LEASE ACCOUNTING (ASC 842)
- Right-of-use asset setup
- Lease liability amortization schedule
- Short-term lease exemption
- Operating vs. finance lease classification

## 5. DEPRECIATION RUN CONFIGURATION
- Depreciation schedule (monthly run)
- Catch-up depreciation for late additions
- Depreciation projection run setup

## 6. ORACLE CONFIGURATION STEPS
Depreciation setup sequence

## 7. TEST SCENARIOS
3 test cases: full-year depreciation, mid-year addition, MACRS tax book

Use exact Oracle Cloud Fixed Assets field names."""

    elif req.tool_type == "migration":
        prompt = header + f"""You are an Oracle Cloud Fixed Assets migration expert. Generate a complete Asset Migration plan.

Requirements:
{req.context}

Generate a comprehensive Fixed Assets migration approach:

## 1. MIGRATION SCOPE ASSESSMENT
- Asset categories in scope
- Total asset record count estimate
- Historical data years to migrate
- Legacy system assessment (field availability)

## 2. FIELD MAPPING TABLE
| Legacy Field | Legacy Description | Oracle Cloud FA Field | Transformation Rule |
Include mappings for:
- Asset number / tag
- Asset description
- Category
- Location
- Cost (original / NBV)
- In-service date
- Depreciation method and life
- Accumulated depreciation to date
- Custodian / department

## 3. DATA CLEANSING REQUIREMENTS
- Assets to retire before migration (fully depreciated, disposed)
- Duplicate asset identification
- Missing data fields to source or default
- Cost vs. NBV reconciliation approach

## 4. FBDI TEMPLATE REQUIREMENTS
- Oracle Cloud FA FBDI file structure
- Required vs. optional fields
- File validation rules
- Load sequence (categories → locations → assets)

## 5. CUTOVER APPROACH
- Migration timing (month-end / year-end recommended)
- NBV vs. cost + accumulated depreciation approach
- Reconciliation to legacy system
- Go / No-Go criteria

## 6. POST-MIGRATION VALIDATION
- Reconciliation reports to run
- Depreciation projection comparison
- Audit sign-off checklist

Use exact Oracle Cloud Fixed Assets field names."""

    else:  # retirement
        prompt = header + f"""You are an Oracle Cloud Fixed Assets expert. Generate a complete Asset Retirement workflow configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Asset Retirement setup:

## 1. RETIREMENT TYPES
Configure Oracle for each retirement type:
- Full retirement (sale, scrapping, theft, donation)
- Partial retirement (partial disposal of cost)
- Reinstatement (reverse of prior retirement)
- CIP cancellation

## 2. RETIREMENT WORKFLOW
- Who can initiate retirement (department manager / finance / IT for tech assets)
- Approval chain by asset value threshold
- Physical verification requirement before retirement

## 3. GAIN / LOSS CALCULATION
- Sale proceeds entry
- Gain/loss calculation: Net Book Value vs. Proceeds
- GL accounts for gain on sale, loss on disposal
- Scrapping: NBV write-off to loss account

## 4. DEPRECIATION THROUGH RETIREMENT
- Depreciation calculation in retirement month
- Prorate convention at retirement
- Prior period retirement handling

## 5. MASS RETIREMENT PROCESS
- Mass retirement upload template
- Batch retirement approval
- Use case: facility closure, fleet disposal

## 6. JOURNAL ENTRIES GENERATED
Show the journal entry template for each retirement type:
- Debit: Accumulated Depreciation + Debit: Loss on Disposal / Credit: Gain
- Credit: Asset Cost
- Debit: Cash Proceeds (if sale)

## 7. ORACLE CONFIGURATION STEPS
Retirement setup and process steps

## 8. TEST SCENARIOS
3 scenarios: sale with gain, scrapping at full NBV, partial retirement

Use exact Oracle Cloud Fixed Assets field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"ERP Fixed Assets: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
