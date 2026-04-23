from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion
from database import save_history

router = APIRouter()


class AIOpportunityRequest(BaseModel):
    client_name: str = ""
    industry: str
    current_modules: list[str] = []
    pain_points: str
    erp_system: str = "Oracle Cloud ERP"
    company_size: str = "Mid-Market (500-5000 employees)"


SYSTEM_PROMPT = """You are a senior Oracle AI Cloud specialist at Denovo (part of Argano) with deep expertise in Oracle's AI portfolio — including Oracle AI Apps, Oracle Digital Assistant (ODA), Fusion Analytics Warehouse (FAW), OCI AI Services, and AI-powered features built into Oracle Cloud ERP modules.

Your job: analyze a client's profile and pain points, then identify and prioritize Oracle AI opportunities that Denovo can propose and implement.

Output this exact format:

## Oracle AI Opportunity Assessment
**Client Profile:** [Industry] | [Company Size] | [ERP System]

---

## Executive Summary
2-3 sentences: overall AI readiness and top opportunity.

---

## Pain Point → AI Solution Mapping

For each pain point, map to a specific Oracle AI product:

### 🎯 Opportunity 1: [Title] — **[High/Medium/Low] Priority**
**Pain Point Addressed:** (Quote from their challenges)
**Oracle AI Solution:** (Specific product: e.g., Oracle AI for Finance, FAW, ODA, OCI Document Understanding)
**What It Does:** (Plain English explanation)
**Business Impact:** (Quantified where possible — e.g., "Reduces invoice processing time by 70%")
**Implementation Effort:** [Low: 2-4 weeks / Medium: 1-3 months / High: 3-6 months]
**Denovo's Role:** (How Denovo implements/enables this)

(Repeat for 4-6 opportunities total, ordered by priority)

---

## Oracle AI Products Applicable to This Client

| Product | Use Case | Modules Required | Effort |
|---------|----------|-----------------|--------|
(List all relevant Oracle AI products)

---

## Quick Wins (Can demo in 30 days)
- (2-3 items that are easy to show value fast)

---

## Recommended Demo Scenarios
1. (Specific demo that would resonate with this client)
2. (Second demo)
3. (Third demo)

---

## Proposed Next Steps
1. Schedule Oracle AI discovery workshop (2 hours)
2. (Specific next step)
3. (Specific next step)

---

## Estimated Revenue Opportunity
| Engagement | Type | Est. Value |
|------------|------|------------|
| (AI implementation engagement) | Fixed/T&M | $X–$Y |
| (Managed services / support) | Recurring | $X/month |

Be specific about Oracle product names. Reference real Oracle AI capabilities like:
- AI for Finance (invoice automation, expense intelligence, account reconciliation AI)
- AI for Supply Chain (demand sensing, inventory optimization)
- Oracle Digital Assistant for ERP self-service
- Fusion Analytics Warehouse for predictive analytics
- OCI Document Understanding for document processing
- Oracle AI for HR (talent intelligence, attrition prediction)"""


@router.post("/analyze")
async def analyze_ai_opportunity(req: AIOpportunityRequest):
    modules_str = ", ".join(req.current_modules) if req.current_modules else "Not specified"
    client_ctx = f"Client: {req.client_name}\n" if req.client_name else ""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""{client_ctx}Industry: {req.industry}
ERP System: {req.erp_system}
Company Size: {req.company_size}
Active Modules: {modules_str}
Pain Points & Challenges:
{req.pain_points}"""}
    ]
    result = chat_completion(messages, temperature=0.2, max_tokens=3500)
    save_history("Oracle AI Opportunity Finder", f"{req.industry} - {req.client_name or 'Client'}", result)
    return {"assessment": result}
