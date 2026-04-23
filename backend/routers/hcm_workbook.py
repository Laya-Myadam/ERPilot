from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class HCMWorkbookRequest(BaseModel):
    client_name: str
    modules: str  # comma-separated: Core HCM, Payroll, Absence, OTL, Benefits
    legislation: str = "US"
    employee_count: str = ""
    go_live_date: str = ""
    legacy_system: str = ""
    business_context: str = ""

@router.post("/generate")
def generate_hcm_workbook(req: HCMWorkbookRequest):
    prompt = f"""You are a senior Oracle Cloud HCM implementation consultant. Generate a comprehensive HCM Configuration Workbook for this client.

Client: {req.client_name}
Modules in Scope: {req.modules}
Legislation: {req.legislation}
Employee Count: {req.employee_count or "Not specified"}
Target Go-Live: {req.go_live_date or "Not specified"}
Legacy System: {req.legacy_system or "Not specified"}
Business Context: {req.business_context or "Standard Oracle Cloud HCM implementation"}

Generate a complete HCM Configuration Workbook covering all in-scope modules:

---
## ENTERPRISE STRUCTURE

### Legal Entities
| Decision | Client Answer | Oracle Config Impact |
(Table with key decisions: legal entity names, EIN, state registrations, payroll legislative data groups)

### Business Units
| Business Unit Name | Purpose | Ledger | Default Legal Employer |
(List all business units needed)

### Reference Data Sets
| Set Name | Scope | Modules Using |

---
## CORE HCM CONFIGURATION

### Organization Hierarchy
- Management hierarchy type
- Position management: Yes/No
- Recommended org structure

### Jobs vs Positions Decision
| Factor | Recommendation | Reason |

### Grade Structure
| Grade | Grade Steps | Progression Rules |

### Location Setup
| Location Name | Address | Time Zone | Inventory Org? |

---
## PAYROLL CONFIGURATION (if in scope)

### Payroll Definitions
| Payroll Name | Frequency | Period Type | Effective Date | Legislative Data Group |

### Element Classification Strategy
- Standard Earnings elements needed (list)
- Supplemental Earnings elements needed
- Pre-tax deduction elements needed
- Post-tax deduction elements needed
- Employer liability elements needed

### Fast Formula Requirements
| Formula Name | Type | Business Rule | Priority |

### Costing Setup
| Cost Type | Allocation Basis | Suspense Account |

---
## ABSENCE MANAGEMENT (if in scope)

### Absence Plans Required
| Plan Name | Leave Type | Accrual Method | Carryover | Eligibility |
(One row per absence plan)

### Accrual Calendar
| Plan | Accrual Start | Frequency | Year-End Rollover Date |

---
## TIME AND LABOR (if in scope)

### Work Schedules
| Schedule Name | Shift Pattern | Standard Hours/Week | OT Threshold |

### Time Card Setup
| Period | Submission Deadline | Auto-Submit? | Approval Levels |

---
## OPEN ITEMS & DECISIONS NEEDED
List 10-15 key decisions the client must make before configuration can proceed, formatted as:
| # | Decision Required | Options | Impact of Choice | Target Date |

---
## DATA MIGRATION OBJECTS
| HDL Object | Record Count (Est.) | Source System | Complexity | Sequence |

---
## CONFIGURATION SEQUENCE
Recommended order of configuration with dependencies called out.

Use exact Oracle Cloud HCM field names and terminology throughout. Flag any module-specific decisions with [PAYROLL], [ABSENCE], [OTL] tags."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("HCM Configuration Workbook", f"{req.client_name} — {req.modules[:60]}", result)
    return {"workbook": result}
