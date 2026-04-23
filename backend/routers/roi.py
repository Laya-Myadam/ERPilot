from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class ROIRequest(BaseModel):
    num_consultants: int
    hours_saved_per_week: float
    avg_hourly_rate: float
    ticket_volume_monthly: int
    ticket_deflection_rate: float = 0.3
    implementation_cost: float = 0
    project_name: str = "AI Platform"

SYSTEM_PROMPT = """You are a business value consultant at Denovo. Calculate and narrate a compelling ROI story for implementing an AI platform at an Oracle ERP consulting firm.

Output format:

## ROI Analysis: [Project Name]

### The Numbers

| Metric | Value |
|--------|-------|
(Complete ROI table)

### 12-Month Financial Impact
(Calculated savings with breakdown)

### Payback Period
(When does the investment pay for itself)

### 3-Year Value Projection
(Extended impact projection)

### The Business Case in Plain English
(Write this as if presenting to a CFO - compelling narrative, not just numbers)

### Risk of Inaction
(What it costs them every month they wait)

### Confidence Factors
(What assumptions underpin this model and how conservative they are)

Make the numbers clear, show your math, and write the narrative to be used directly in an executive presentation."""

@router.post("/calculate")
async def calculate_roi(req: ROIRequest):
    weekly_savings = req.num_consultants * req.hours_saved_per_week * req.avg_hourly_rate
    monthly_savings = weekly_savings * 4.33
    ticket_savings = req.ticket_volume_monthly * req.ticket_deflection_rate * 150
    total_monthly = monthly_savings + ticket_savings
    annual_savings = total_monthly * 12
    payback_months = (req.implementation_cost / total_monthly) if req.implementation_cost > 0 and total_monthly > 0 else 0

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"""Project: {req.project_name}
Consultants: {req.num_consultants}
Hours saved/consultant/week: {req.hours_saved_per_week}
Average hourly rate: ${req.avg_hourly_rate}
Weekly time savings value: ${weekly_savings:,.0f}
Monthly time savings: ${monthly_savings:,.0f}
Monthly ticket volume: {req.ticket_volume_monthly}
Ticket deflection rate: {req.ticket_deflection_rate*100:.0f}%
Monthly ticket savings: ${ticket_savings:,.0f}
Total monthly savings: ${total_monthly:,.0f}
Annual savings: ${annual_savings:,.0f}
Implementation cost: ${req.implementation_cost:,.0f}
Estimated payback: {payback_months:.1f} months
3-year value: ${annual_savings*3:,.0f}

Write a compelling ROI narrative using these calculated figures."""}
    ]
    result = chat_completion(messages, temperature=0.3, max_tokens=2000)
    return {
        "narrative": result,
        "metrics": {
            "monthly_savings": round(total_monthly, 2),
            "annual_savings": round(annual_savings, 2),
            "payback_months": round(payback_months, 1),
            "three_year_value": round(annual_savings * 3, 2),
        }
    }
