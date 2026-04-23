from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class KBRequest(BaseModel):
    platform: str          # ServiceNow, Oracle, General ITSM
    incident_summary: str  # What broke
    root_cause: str = ""
    resolution_steps: str  # What fixed it
    affected_systems: str = ""
    category: str = ""

@router.post("/generate")
def generate_kb_article(req: KBRequest):
    prompt = f"""You are a ServiceNow ITSM knowledge management expert. Convert the following incident resolution into a professional, structured Knowledge Base article.

Platform/System: {req.platform}
Incident Summary: {req.incident_summary}
Root Cause: {req.root_cause or "To be determined"}
Resolution Steps Taken: {req.resolution_steps}
Affected Systems/Modules: {req.affected_systems or "Not specified"}
Category: {req.category or "General"}

Write a complete KB article with:
1. **Article Title** — clear, searchable, action-oriented
2. **Short Description** (1-2 sentences for search results preview)
3. **Symptoms** — bullet list of what users experience
4. **Environment** — platforms, versions, affected configurations
5. **Root Cause** — clear technical explanation
6. **Resolution** — numbered step-by-step fix (be specific, include screenshots prompts where helpful)
7. **Workaround** (if applicable) — interim steps while permanent fix is applied
8. **Prevention** — how to avoid this in future
9. **Related Articles** — placeholder section with suggested search terms
10. **Keywords** — comma-separated for search indexing

Use professional ITSM language. Format so a Tier 1 analyst can follow it without escalation."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.3,
    )
    result = response.choices[0].message.content
    save_history("KB Article Writer", f"{req.platform}: {req.incident_summary[:80]}", result)
    return {"article": result}
