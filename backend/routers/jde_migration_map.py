from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class JDEMigrationRequest(BaseModel):
    company_name: str = ""
    jde_version: str = "9.2"
    modules_to_migrate: str = ""
    employee_count: str = ""
    data_years_to_migrate: str = "3"
    target_system: str = "Oracle Cloud HCM"
    complexity_notes: str = ""

@router.post("/map")
def map_jde_migration(req: JDEMigrationRequest):
    prompt = f"""You are a JD Edwards to Oracle Cloud migration expert with deep knowledge of both JDE and Oracle Cloud data structures. Generate a comprehensive migration mapping and assessment.

Company: {req.company_name or "Not specified"}
JDE Version: {req.jde_version}
Modules to Migrate: {req.modules_to_migrate}
Employees/Records: {req.employee_count or "Not specified"}
Data Years to Migrate: {req.data_years_to_migrate} years of history
Target System: {req.target_system}
Complexity Notes: {req.complexity_notes or "Standard migration"}

Generate a complete JDE to Oracle Cloud migration assessment:

## 1. MIGRATION SCOPE SUMMARY
| Module | JDE Business Function | Complexity | Estimated Records | Target Object |
- Rating rationale for each module
- Total record count estimate
- Recommended data conversion approach (HDL / FBDI / Manual)

## 2. FIELD MAPPING TABLE
For each module in scope ({req.modules_to_migrate}):

### [Module Name]
| JDE Table | JDE Field | JDE Description | Oracle Object | Oracle Field | Transformation Required |
- At minimum 15–20 field mappings per module
- Include key JDE tables (F060116 for employee master, F0101 for address book, etc.)
- Note mandatory vs. optional Oracle fields
- Flag fields with no JDE equivalent (must default or derive)

## 3. DATA QUALITY ISSUES — COMMON JDE PROBLEMS TO CLEAN FIRST
- Duplicate employee/person records in address book
- Missing required fields in JDE that Oracle requires
- Date format inconsistencies
- Organizational structure mismatches
- Inactive records that need exclusion rules

## 4. HDL / FBDI FILE SEQUENCE
For Oracle Cloud HCM target:
1. Required HDL files in load order
2. Dependencies between files
3. Validation rules per file
4. Error handling per file type

## 5. CODE VALUE MAPPING
Key lookups to translate between JDE and Oracle:
| Data Element | JDE Code | JDE Description | Oracle Code | Oracle Description |
- Employment status codes
- Pay frequency codes
- Organization type codes
- Gender / marital status codes (if applicable)

## 6. CUTOVER STRATEGY
- Recommended approach: Big Bang vs. Phased migration
- Mock migration schedule (Round 1 / Round 2 / Final)
- Cutover weekend timeline
- Go / No-Go criteria
- Data freeze date and delta load approach

## 7. RISKS AND MITIGATION
Top 6 migration risks for JDE {req.jde_version} → {req.target_system}:
| Risk | Likelihood | Impact | Mitigation |

## 8. TOOLS AND EFFORT ESTIMATE
- ETL tool recommendation (Oracle Data Integrator / BICC / Custom scripts)
- Estimated data conversion effort in days per module
- Team skill requirements

Use JDE table names (F-tables) and Oracle Cloud object names precisely."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("JDE Migration Mapper", f"{req.company_name}: JDE {req.jde_version} → {req.target_system}", result)
    return {"mapping": result}
