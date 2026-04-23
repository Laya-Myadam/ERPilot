from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChangeRequestRequest(BaseModel):
    project_name: str
    client_name: str
    cr_title: str
    requested_by: str = ""
    change_description: str
    reason_for_change: str = ""
    modules_affected: str = ""
    original_scope: str = ""

@router.post("/generate")
def generate_change_request(req: ChangeRequestRequest):
    prompt = f"""You are a senior Oracle HCM project manager at Denovo. Generate a formal Change Request document for a mid-project scope change.

Project: {req.project_name}
Client: {req.client_name}
CR Title: {req.cr_title}
Requested By: {req.requested_by or "Client"}
Change Description: {req.change_description}
Reason / Business Justification: {req.reason_for_change or "Client business requirement"}
Modules Affected: {req.modules_affected or "To be determined"}
Original Scope Reference: {req.original_scope or "Per original SOW"}

Generate a complete, formal Change Request document:

## CHANGE REQUEST
**CR #: CR-[AUTO]** | **Date: {__import__('datetime').date.today()}**
**Project:** {req.project_name} | **Client:** {req.client_name}
**Status:** Pending Approval

---

### 1. CHANGE DESCRIPTION
Clear description of what is being added, modified, or removed from the original scope.

### 2. BUSINESS JUSTIFICATION
Why the client needs this change. Link to business outcome.

### 3. ORIGINAL SCOPE vs NEW SCOPE
| | Original Scope | New Scope (with this CR) |
|---|---|---|
| Deliverables | | |
| Timeline | | |
| Resources | | |

### 4. IMPACT ANALYSIS

#### 4a. Schedule Impact
- Additional weeks/days required: ___
- New projected go-live date: ___
- Milestones affected: (list)
- Critical path impact: Yes/No

#### 4b. Effort Impact
| Work Stream | Additional Hours | Resource |
|---|---|---|
(Break down by: configuration, testing, training, documentation, project management)
| **TOTAL** | **___ hours** | |

#### 4c. Cost Impact
| Item | Hours | Rate | Cost |
|---|---|---|---|
| Consulting Hours | | $___/hr | $___ |
| Travel (if any) | | | $___ |
| **Total Additional Cost** | | | **$___** |

#### 4d. Risk Impact
What risks does this change introduce? What risks does it mitigate?

#### 4e. Dependencies & Prerequisites
What must be completed before this change can be implemented?

### 5. IMPLEMENTATION APPROACH
High-level steps to implement this change.

### 6. TESTING REQUIREMENTS
Additional testing needed due to this change.

### 7. APPROVAL

| Role | Name | Signature | Date |
|---|---|---|---|
| Client Project Sponsor | | | |
| Client IT Lead | | | |
| Denovo Project Manager | | | |
| Denovo Engagement Lead | | | |

**Note:** Work on this change will not begin until all signatures are obtained.

Be specific and professional. Use realistic consulting rates ($175–225/hr for Oracle HCM specialists)."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Change Request Generator", f"{req.client_name}: {req.cr_title}", result)
    return {"document": result}
