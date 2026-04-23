from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class RecruitingSetupRequest(BaseModel):
    client_name: str = ""
    job_families: str = ""
    hiring_stages: str = ""
    offer_approval_levels: str = ""
    background_check_vendor: str = ""
    integrations: str = ""
    annual_hire_volume: str = ""

@router.post("/generate")
def generate_recruiting_setup(req: RecruitingSetupRequest):
    prompt = f"""You are an Oracle Recruiting Cloud (IRC) implementation expert. Generate a complete Oracle Recruiting setup and configuration guide.

Client: {req.client_name or "Not specified"}
Job Families: {req.job_families or "All standard corporate job families"}
Hiring Stages: {req.hiring_stages or "Application Review, Phone Screen, Interview, Offer, Background Check, Hire"}
Offer Approval Levels: {req.offer_approval_levels or "Hiring Manager → HR → Compensation"}
Background Check Vendor: {req.background_check_vendor or "TBD"}
Integrations: {req.integrations or "Oracle Cloud HCM Core"}
Annual Hire Volume: {req.annual_hire_volume or "Not specified"}

Generate a complete Oracle Recruiting Cloud (IRC) configuration specification:

## 1. RECRUITING ORGANIZATION SETUP
- Recruiting organization hierarchy
- Recruiting user roles (Recruiter, Hiring Manager, Recruiting Manager, Administrator)
- Configuration sequence overview

## 2. JOB REQUISITION SETUP
- Requisition types: Standard, Pipeline, Evergreen
- Required vs. optional requisition fields per type
- Approval workflow for requisition creation
- Job template configuration per job family
- Position-based vs. job-based requisitions

## 3. CANDIDATE SELECTION WORKFLOW (CSW)
For each hiring stage ({req.hiring_stages}):
- Phase and state names
- Allowed actions at each state (Move, Decline, Withdraw, Put on Hold)
- Automated notifications triggered per state change
- Disqualification reasons and tracking

## 4. OFFER MANAGEMENT
- Offer letter template configuration
- Offer approval workflow: {req.offer_approval_levels}
- Offer field configuration (start date, salary, bonus, equity)
- Competitive offer tracking
- Offer expiry and re-extension rules

## 5. CAREER SITE CONFIGURATION
- Branding: logo, colors, header/footer
- Job search filters to expose (location, category, job family)
- Application form fields and required vs. optional
- Employee referral portal setup
- Mobile optimization settings

## 6. INTEGRATIONS
- Background check vendor integration: {req.background_check_vendor or "TBD"}
- Job board auto-posting (LinkedIn, Indeed, Glassdoor)
- Oracle HCM Core new hire conversion flow
- HRIS sync for requisition position data

## 7. CONFIGURATION STEPS IN ORACLE
Ordered sequence: Security → Setup → Workflow → Career Site → Testing

## 8. TEST SCENARIOS
5 key test cases: end-to-end hire, rejection flow, offer approval, background check trigger, new hire sync to HCM

## 9. GO-LIVE CHECKLIST
Pre-go-live validation items for Oracle Recruiting

Use exact Oracle Recruiting Cloud terminology and screen names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Recruiting Setup Guide", f"{req.client_name}: {req.annual_hire_volume} hires/year", result)
    return {"guide": result}
