from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class TalentRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # performance_review | goal_setting | succession | talent_profile
    context: str
    employee_count: str = ""
    review_cycle: str = "Annual"

@router.post("/generate")
def generate(req: TalentRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nEmployees: {req.employee_count or 'Not specified'}\nReview Cycle: {req.review_cycle}\n\n"

    if req.tool_type == "performance_review":
        prompt = header + f"""You are an Oracle Cloud HCM Talent Management expert. Generate a complete Performance Review Template configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Performance Review setup:

## 1. REVIEW PROCESS DESIGN
- Review type (Annual / Mid-Year / Quarterly Check-in / Probationary)
- Review period start and end dates
- Who reviews whom (employee self, direct manager, skip-level, peers, 360)
- Rating scale definition (e.g., 1–5 with labels and descriptions)

## 2. REVIEW TEMPLATE SECTIONS
For each section, specify:
- Section name and description
- Weight % toward overall rating
- Question types (rating scale / narrative / goal achievement / competency)
- Mandatory vs. optional

Recommended sections:
| Section | Weight | Type |
- Goals Achievement
- Core Competencies
- Role-Specific Competencies
- Development & Growth
- Manager Overall Rating
- Employee Self-Assessment

## 3. RATING SCALE CONFIGURATION
- Rating labels and numeric values
- Forced distribution rules (if any)
- Rounding rules for composite scores

## 4. WORKFLOW AND APPROVAL
- Review workflow stages: Self-Assessment → Manager Review → Calibration → HR Approval → Share with Employee
- Time allocation per stage (days)
- Reminder and escalation rules
- Reopen / revision rules

## 5. CALIBRATION CONFIGURATION
- Calibration session setup
- 9-box grid configuration (Performance vs. Potential)
- Calibration facilitator role setup
- Calibration output → performance rating update flow

## 6. ORACLE CONFIGURATION STEPS
Setup sequence: Template → Process → Eligibility → Launch

## 7. TEST SCENARIOS
3 test cases: complete review cycle, calibration adjustment, late submission handling

Use exact Oracle Cloud HCM Talent Management field names."""

    elif req.tool_type == "goal_setting":
        prompt = header + f"""You are an Oracle Cloud HCM Talent Management expert. Generate a complete Goal-Setting Framework configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Goal Management setup:

## 1. GOAL FRAMEWORK DESIGN
- Goal methodology (OKR / SMART / MBO / Balanced Scorecard)
- Goal types to configure (Individual / Team / Corporate / Development)
- Goal categories and weights toward performance rating
- Goal period alignment (fiscal year / calendar year / quarters)

## 2. GOAL PLAN CONFIGURATION
- Goal plan name and period
- Minimum and maximum number of goals per employee
- Goal weight requirements (must sum to 100%)
- Due dates for goal submission and approval

## 3. CASCADE STRUCTURE
- Corporate goals → Division → Team → Individual cascade
- How parent goals are linked to child goals
- Visibility rules (who can see whose goals)

## 4. GOAL APPROVAL WORKFLOW
- Approval chain: Employee → Manager → Skip-Level (if required)
- Auto-approval threshold
- Goal modification rules mid-year

## 5. GOAL TEMPLATES LIBRARY
- Pre-built goal templates by job family
- SMART goal guidance text
- Sample goals for key roles at this company

## 6. PROGRESS UPDATES
- Check-in frequency (quarterly / monthly)
- Progress status options (On Track / At Risk / Off Track / Complete)
- Manager visibility into goal progress

## 7. YEAR-END GOAL ACHIEVEMENT RATING
- Achievement rating scale
- How goal achievement feeds into overall performance rating

## 8. ORACLE CONFIGURATION STEPS
Setup sequence in Oracle HCM Goal Management

## 9. SAMPLE GOALS
5 sample SMART goals appropriate for this client's industry and roles

Use exact Oracle Cloud HCM field names."""

    elif req.tool_type == "succession":
        prompt = header + f"""You are an Oracle Cloud HCM Talent Management expert. Generate a complete Succession Planning configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Succession Plan setup:

## 1. SUCCESSION PLAN STRUCTURE
- Plan types (Position-based / Job-based / Talent Pool)
- Which positions/roles require succession plans
- Plan owners and review cadence

## 2. TALENT POOL CONFIGURATION
- Talent pool names and purpose
- Eligibility criteria for talent pool nomination
- Nomination process (self / manager / HR)
- Pool capacity limits

## 3. READINESS ASSESSMENT
- Readiness levels: Ready Now / 1–2 Years / 3–5 Years
- Readiness criteria definition per level
- Assessment frequency

## 4. POTENTIAL AND PERFORMANCE MATRIX (9-BOX)
- 9-box grid axes definition (Performance × Potential)
- Rating inputs feeding the grid
- Placement process and approval
- Action plans by grid quadrant

## 5. SUCCESSION CANDIDATE PROFILES
- Key information to display per candidate (experience, skills, mobility, career aspirations)
- Gap analysis view (current skills vs. role requirements)
- Development plan linkage

## 6. REVIEW AND CALIBRATION PROCESS
- Annual succession review meeting cadence
- Calibration session facilitation guide
- Plan update and approval workflow

## 7. ORACLE CONFIGURATION STEPS
Setup sequence for Oracle Succession Planning

## 8. REPORTING
- Bench strength report by position
- Talent pool health metrics
- Flight risk identification

Use exact Oracle Cloud HCM Talent Management field names."""

    else:  # talent_profile
        prompt = header + f"""You are an Oracle Cloud HCM Talent Management expert. Generate a complete Talent Profile configuration spec.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Talent Profile setup:

## 1. TALENT PROFILE SECTIONS
Sections to configure and required fields per section:
- Education (degrees, institutions, graduation years)
- Work Experience (prior roles, companies, dates)
- Skills and Competencies (proficiency levels)
- Certifications and Licenses (expiry dates)
- Languages (proficiency level)
- Awards and Recognition
- Career Preferences (mobility, desired roles, career goals)

## 2. SKILLS LIBRARY CONFIGURATION
- Skill categories and taxonomy
- Proficiency scale (e.g., 1=Beginner, 2=Competent, 3=Expert)
- How skills are sourced (employee self / manager / system)
- Skill verification process

## 3. COMPETENCY FRAMEWORK
- Core competencies (all employees)
- Leadership competencies (managers and above)
- Technical competencies by job family
- Competency proficiency expectations by grade

## 4. PROFILE COMPLETION RULES
- Required fields for profile to be considered complete
- Completeness % calculation
- Reminders for incomplete profiles
- Manager visibility and edit rights

## 5. INTEGRATION WITH OTHER MODULES
- How profile feeds into succession planning
- How skills feed into learning recommendations
- How competencies feed into performance reviews
- Recruiting: how profiles appear to recruiters

## 6. ORACLE CONFIGURATION STEPS
Setup sequence in Oracle HCM Talent Profile

## 7. DATA MIGRATION
- How to migrate existing talent profile data from prior system or LinkedIn
- HDL file requirements for bulk profile import

Use exact Oracle Cloud HCM Talent Management field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"HCM Talent: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
