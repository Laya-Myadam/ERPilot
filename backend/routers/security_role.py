from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class SecurityRoleRequest(BaseModel):
    role_name: str
    module: str
    what_user_can_do: str
    what_user_cannot_do: str = ""
    data_restrictions: str = ""
    legislation: str = "US"
    erp_system: str = "Oracle Cloud HCM"

@router.post("/design")
def design_security_role(req: SecurityRoleRequest):
    prompt = f"""You are an Oracle Cloud HCM Security expert. Design a complete Oracle Cloud security role configuration.

System: {req.erp_system}
Role Name: {req.role_name}
Module: {req.module}
Legislation: {req.legislation}

WHAT THIS USER SHOULD BE ABLE TO DO:
{req.what_user_can_do}

WHAT THIS USER SHOULD NOT BE ABLE TO DO:
{req.what_user_cannot_do or "Anything not explicitly listed above"}

DATA RESTRICTIONS (what data they can see):
{req.data_restrictions or "Standard — own business unit and department only"}

Generate a complete Oracle Cloud HCM security role design:

## SECURITY ROLE DESIGN: {req.role_name}

### Role Summary
| Field | Value |
|---|---|
| Role Name | |
| Role Code | (UPPERCASE_WITH_UNDERSCORES) |
| Role Category | |
| Module | |
| Description | |

---

### Role Hierarchy (Oracle Cloud Role Types)

#### Abstract Roles (if applicable)
List any abstract roles this user needs (Employee, Contingent Worker, Line Manager)

#### Job Role
| Job Role Name | Job Role Code | Source (Oracle-seeded or Custom) |
|---|---|---|

#### Duty Roles
| Duty Role | Privilege Granted | Notes |
|---|---|---|
(List all duty roles assigned to this job role)

#### Privileges
| Privilege Name | Privilege Code | Action Allowed |
|---|---|---|
(List key function security privileges)

---

### Data Security (Data Roles)

#### Data Role Configuration
| Data Role | Security Profile | Scope |
|---|---|---|

#### Security Profiles Required
For each profile type, specify what to configure:

**Person Security Profile:**
- Access type: Own record / All workers / Specific BU / Manager hierarchy
- Include terminated workers: Yes/No

**Organization Security Profile:**
- Legal Entities accessible:
- Business Units accessible:
- Departments accessible:

**Payroll Security Profile** (if payroll access):
- Payrolls accessible:
- Pay groups:

**Legislative Data Group Security:**

---

### Segregation of Duties (SOD) Conflicts
List any SOD conflicts this role has with other common roles and how to handle them:
| This Role | Conflicting Role | Risk | Mitigation |

---

### Implementation Steps
Numbered steps to create this role in Oracle Cloud HCM Security Console:
1. Navigate to: Tools > Security Console
2. ...

### Test Scenarios
| Test | Steps | Expected Result | Pass/Fail |
|---|---|---|---|
(5 test cases to validate this role works correctly)

### Audit Checklist
- [ ] Role created and named correctly
- [ ] All duty roles assigned
- [ ] Data security profiles configured
- [ ] SOD conflicts reviewed and documented
- [ ] UAT sign-off obtained from business owner

Use exact Oracle Cloud HCM security terminology. Be precise about role names and codes."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("HCM Security Role Designer", f"{req.role_name} — {req.module}", result)
    return {"design": result}
