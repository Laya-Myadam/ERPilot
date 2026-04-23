from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class BattleCardRequest(BaseModel):
    competitor: str           # SAP, Workday, Microsoft, Accenture, Deloitte, etc.
    deal_context: str         # What's the deal/opportunity
    client_industry: str = "" # Manufacturing, Healthcare, Government, etc.
    pain_points: str = ""     # Known client pain points
    modules_in_scope: str = ""# Oracle modules being sold

@router.post("/generate")
def generate_battle_card(req: BattleCardRequest):
    prompt = f"""You are a senior Oracle managed services sales strategist at Denovo, a boutique Oracle ERP consulting firm. Generate a competitive battle card to help the sales team position Denovo against the competitor below.

Competitor: {req.competitor}
Deal Context: {req.deal_context}
Client Industry: {req.client_industry or "Not specified"}
Client Pain Points: {req.pain_points or "Not specified"}
Oracle Modules in Scope: {req.modules_in_scope or "Oracle Fusion Cloud HCM/ERP"}

Create a battle card with:
1. **Competitor Snapshot** — their typical pitch, strengths, and target customer profile
2. **Denovo's Winning Differentiators** — 5 specific reasons Denovo wins against this competitor (Oracle specialization, team size, managed services model, speed-to-value, etc.)
3. **Competitor Weaknesses** — 5 honest weaknesses to exploit (high cost, generalist staff, slow implementation, poor post-go-live support, etc.)
4. **Landmines to Plant** — 5 questions to ask the client that expose competitor weaknesses ("Ask them who will be your dedicated Oracle consultant on day 301...")
5. **Their Likely Objections to Denovo** + **Your Responses** (3 objections min)
6. **Proof Points** — types of references and metrics to cite (implementation speed, client retention, Oracle certifications)
7. **Elevator Pitch vs {req.competitor}** — 3-sentence close

Be direct, tactical, and honest. This is for internal sales use only."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.4,
    )
    result = response.choices[0].message.content
    save_history("Battle Card Generator", f"vs {req.competitor}: {req.deal_context[:60]}", result)
    return {"battle_card": result}
