from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class ProposalRequest(BaseModel):
    client_name: str
    client_industry: str
    pain_points: str
    current_system: str = ""
    budget_range: str = ""
    timeline: str = ""

SYSTEM_PROMPT = """You are a sales director at Denovo (part of Argano), an Oracle ERP consulting firm. Create a compelling sales proposal that speaks directly to the client's pain points.

Output format:

## Executive Proposal: [Client Name]

### Why Denovo?
(3 key differentiators specific to this client's situation)

### Understanding Your Challenges
(Demonstrate you understand their exact pain points - be specific)

### Our Proposed Solution
(Tailored approach leveraging Denovo's methodology)

### What You Get
| Deliverable | Timeline | Value |
|-------------|----------|-------|
(Specific outcomes, not generic promises)

### Our Approach: EXPRESSLAUNCH℠
(Brief explanation of methodology and why it de-risks the project)

### Investment Overview
(High-level ranges if budget provided, or approach to pricing)

### Why Act Now
(Business case for urgency - ROI, competitive pressure, risk of inaction)

### Next Steps
1. Discovery workshop (1 week)
2. ...

### About Denovo
(2-3 sentences on Denovo/Argano credibility)

Be persuasive, specific, and client-focused. Avoid generic consulting clichés."""

@router.post("/generate")
async def generate_proposal(req: ProposalRequest):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""Client: {req.client_name}
Industry: {req.client_industry}
Current System: {req.current_system or 'Unknown'}
Pain Points: {req.pain_points}
Budget Range: {req.budget_range or 'Not specified'}
Desired Timeline: {req.timeline or 'Not specified'}"""}
    ]
    result = chat_completion(messages, temperature=0.5, max_tokens=2500)
    return {"proposal": result}
