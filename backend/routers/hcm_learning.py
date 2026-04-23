from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class LearningRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # course_catalog | learning_path | compliance | certification
    context: str
    employee_count: str = ""
    legislation: str = "US"

@router.post("/generate")
def generate(req: LearningRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nEmployees: {req.employee_count or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "course_catalog":
        prompt = header + f"""You are an Oracle Learning Cloud expert. Generate a complete Course Catalog configuration specification.

Requirements:
{req.context}

Generate a comprehensive Oracle Learning Cloud Course Catalog setup:

## 1. CATALOG STRUCTURE
- Top-level catalog categories and subcategories
- Catalog visibility rules (who can see what)
- Catalog assignment by business unit, job family, location

## 2. CONTENT TYPES TO CONFIGURE
- Instructor-Led Training (ILT): classroom and virtual
- Online (eCourses): SCORM, AICC, xAPI/Tin Can
- Videos and multimedia
- Blended learning options
- Assessments and quizzes

## 3. COURSE SETUP FIELDS
For each course type, required Oracle fields:
- Course name, description, owner, category
- Duration, credit hours, passing score
- Prerequisites and equivalencies
- Offering setup (dates, instructors, locations, capacity)
- Waitlist management rules

## 4. APPROVAL WORKFLOW
- Manager approval requirement by course type
- Self-enrollment vs. manager-assigned
- Auto-approval conditions

## 5. CATALOG SEARCH & DISCOVERY
- Search filter configuration
- Featured/recommended course setup
- Homepage widget configuration

## 6. ORACLE CONFIGURATION STEPS
Ordered sequence to build the catalog in Oracle Learning Cloud

## 7. TEST SCENARIOS
4 test cases: self-enrollment, manager assignment, waitlist, course completion recording

Use exact Oracle Learning Cloud field names."""

    elif req.tool_type == "learning_path":
        prompt = header + f"""You are an Oracle Learning Cloud expert. Generate a complete Learning Path design and configuration spec.

Requirements:
{req.context}

Generate a comprehensive Oracle Learning Cloud Learning Path specification:

## 1. LEARNING PATH STRUCTURE
- Path name, description, and purpose
- Path type (Required / Recommended / Development)
- Mandatory vs. elective courses within the path

## 2. ROLE-BASED PATH ASSIGNMENTS
- Job role → learning path mapping table
- Assignment trigger (hire date, promotion, role change)
- New hire onboarding path structure (Days 1/30/60/90)

## 3. PREREQUISITES AND SEQUENCING
- Course dependency rules
- Sequential vs. parallel course completion
- Time limits between courses
- Path completion deadline rules

## 4. COMPLETION RULES
- What constitutes path completion (all mandatory / X% minimum)
- Completion certificate generation
- Path completion notification (employee + manager)
- Recertification/renewal rules

## 5. REPORTING AND TRACKING
- Path completion dashboard setup
- Manager visibility into team progress
- Required Oracle reports for compliance tracking

## 6. ORACLE CONFIGURATION STEPS
Step-by-step Learning Path setup in Oracle Learning Cloud

## 7. SAMPLE PATH DEFINITIONS
Provide 3 sample paths appropriate for this client's context with courses listed

Use exact Oracle Learning Cloud terminology."""

    elif req.tool_type == "compliance":
        prompt = header + f"""You are an Oracle Learning Cloud compliance training expert. Generate a complete Compliance Training Tracker configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Compliance Training configuration:

## 1. COMPLIANCE TRAINING INVENTORY
- Required compliance courses for {req.legislation} (OSHA, harassment prevention, anti-bribery, data privacy, etc.)
- Course frequency (annual, biennial, one-time, role-specific)
- State/location-specific requirements (CA, NY mandatory harassment, etc.)
- New hire vs. existing employee requirements

## 2. AUTOMATED ASSIGNMENT RULES
- Assignment trigger: hire date, anniversary, role change, legislation change
- Assignment criteria: all employees / by role / by location / by manager
- Batch assignment setup for annual refreshers

## 3. COMPLETION DEADLINE CONFIGURATION
- Deadline rules per course type
- Grace period setup
- Escalation timeline: 30 days → 15 days → overdue

## 4. REMINDER AND ESCALATION
- Automated reminder email schedule (e.g., 30 days before, 14 days, 7 days, overdue)
- Manager escalation when direct reports are overdue
- HR escalation for critical compliance items

## 5. REPORTING FOR AUDIT
- Compliance dashboard configuration
- Audit-ready completion reports
- Export format for regulatory submission

## 6. NON-COMPLETION CONSEQUENCES
- Hold on pay increase / promotion workflow (if applicable)
- HR case creation for persistent non-compliance

## 7. ORACLE CONFIGURATION STEPS
Setup sequence for compliance training automation

## 8. TEST SCENARIOS
3 scenarios: new hire assignment, annual refresh, overdue escalation

Use exact Oracle Learning Cloud field names."""

    else:  # certification
        prompt = header + f"""You are an Oracle Learning Cloud expert. Generate a complete Certification Program configuration spec.

Requirements:
{req.context}

Generate a comprehensive Oracle Cloud Certification Program setup:

## 1. CERTIFICATION PROGRAM STRUCTURE
- Certification name, description, and level
- Certification type (Internal / External / Regulatory)
- Certification validity period and renewal cycle

## 2. CERTIFICATION REQUIREMENTS
- Required courses/assessments to earn certification
- Minimum passing score per component
- Practical assessment setup (if applicable)
- Prerequisites (experience, prior certifications)

## 3. EXAM / ASSESSMENT CONFIGURATION
- Assessment type (Oracle-built quiz / External exam import)
- Question bank setup and randomization
- Proctoring requirements
- Retake rules (wait period, max attempts)

## 4. AWARD AND RECOGNITION
- Digital badge configuration (Open Badges standard)
- Certificate template design requirements
- Certification display on talent profile
- LinkedIn badge integration (if required)

## 5. RENEWAL PROCESS
- Renewal notification timeline
- Renewal requirements (refresher course / re-exam / CPE credits)
- Lapse and reinstatement rules

## 6. REPORTING
- Certified employee roster report
- Expiring certification alerts
- Certification gap analysis by role

## 7. ORACLE CONFIGURATION STEPS
Ordered setup sequence

## 8. SAMPLE CERTIFICATION STRUCTURE
Provide 2-3 sample certification programs appropriate for this client

Use exact Oracle Learning Cloud terminology."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"HCM Learning: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
