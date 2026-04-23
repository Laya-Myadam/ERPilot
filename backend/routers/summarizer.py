from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class SummarizeRequest(BaseModel):
    document: str
    doc_type: str = "general"

SYSTEM_PROMPT = """You are a senior Oracle ERP consultant at Denovo. Summarize the provided document into a clear, structured format.

Output format:
## Executive Summary
(2-3 sentences max)

## Key Points
- (bullet points, most important first)

## Action Items / Next Steps
- (any tasks, decisions, or follow-ups identified)

## Risks or Concerns
- (flag anything that needs attention)

Be concise. Use Oracle/ERP terminology where relevant. Focus on what matters to a consulting team."""

@router.post("/summarize")
async def summarize(req: SummarizeRequest):
    # One-shot example to guide output format
    one_shot_example = """Example input: "This Statement of Work outlines the implementation of JD Edwards Financial modules..."
Example output format: Executive Summary with key deliverables, phases, risks, and action items."""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Document type: {req.doc_type}\n\nOne-shot guidance: {one_shot_example}\n\nDocument to summarize:\n\n{req.document}"}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=1500)
    return {"summary": result}
