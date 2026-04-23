from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class WorkforceRequest(BaseModel):
    client_name: str = ""
    tool_type: str  # scheduling | forecast | compliance | shift_pattern
    context: str
    industry: str = ""
    legislation: str = "US"

@router.post("/generate")
def generate(req: WorkforceRequest):
    header = f"Client: {req.client_name or 'Not specified'}\nIndustry: {req.industry or 'Not specified'}\nLegislation: {req.legislation}\n\n"

    if req.tool_type == "scheduling":
        prompt = header + f"""You are an Oracle Workforce Management (WFM) expert. Generate a complete Scheduling Rule configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle WFM Scheduling Rule setup:

## 1. SHIFT TYPES CONFIGURATION
For each shift type:
- Shift name, start time, end time, total hours
- Paid vs. unpaid break rules
- Minimum rest between shifts
- Overnight shift handling

## 2. SCHEDULE PATTERN SETUP
- Work week definition (Mon–Fri / Mon–Sun)
- Standard patterns: 5x8, 4x10, 3x12, rotating
- Part-time schedule patterns
- Flex schedule rules

## 3. COVERAGE REQUIREMENTS
- Minimum staff per shift per role
- Preferred vs. minimum coverage
- Overstaffing threshold alerts
- Holiday/weekend coverage requirements

## 4. SCHEDULE GENERATION RULES
- Auto-scheduling constraints
- Employee preference consideration
- Seniority-based scheduling (if union)
- Skill-based assignment rules

## 5. SCHEDULE CHANGE RULES
- Advance notice requirements (hours before shift)
- Employee-initiated swap process
- Manager approval thresholds
- Voluntary overtime rules

## 6. ORACLE CONFIGURATION STEPS
Setup sequence in Oracle Workforce Management

## 7. TEST SCENARIOS
3 scheduling scenarios with expected output

Use exact Oracle WFM field names."""

    elif req.tool_type == "forecast":
        prompt = header + f"""You are an Oracle Workforce Management expert. Generate a complete Labor Demand Forecast configuration.

Requirements:
{req.context}

Generate a comprehensive Oracle WFM Labor Demand Forecast setup:

## 1. FORECAST MODEL CONFIGURATION
- Forecasting method (historical volume / driver-based / statistical)
- Historical data window to use (12 months / 24 months)
- Forecast horizon (1 week / 4 weeks / 13 weeks)
- Forecast granularity (15 min / 30 min / hourly / daily)

## 2. VOLUME DRIVERS
- Business volume metrics that drive staffing (transactions, calls, units, patients, etc.)
- Driver data sources and integration
- Driver-to-headcount conversion formula
- Seasonality factors and holiday multipliers

## 3. BUDGET ALIGNMENT
- How forecast ties to approved headcount budget
- Variance alerts (forecast vs. budget threshold %)
- What-if scenario planning setup

## 4. DEPARTMENT/LOCATION SETUP
- Forecast unit (store, department, call center)
- Staffing model per unit (coverage ratios, productivity standards)

## 5. FORECAST REVIEW AND APPROVAL
- Who reviews the forecast (operations manager / workforce analyst)
- Approval cadence (weekly / monthly)
- Override and adjustment rules

## 6. ORACLE CONFIGURATION STEPS
Setup sequence for WFM labor forecasting

## 7. REPORTING
- Key WFM forecast reports to configure

Use exact Oracle WFM field names and terminology."""

    elif req.tool_type == "compliance":
        prompt = header + f"""You are an Oracle Workforce Management and labor law compliance expert. Generate a complete WFM Compliance Checklist.

Requirements:
{req.context}

Generate a comprehensive Oracle WFM Compliance configuration for {req.legislation}:

## 1. FEDERAL COMPLIANCE (US)
### FLSA Rules
- Overtime trigger: 40 hours/week (non-exempt)
- OT calculation method configuration
- White-collar exemption tracking

### Minor Labor Laws
- Maximum hours per day/week by age group
- Restricted hours (school nights, late evenings)
- Oracle enforcement rule setup

## 2. STATE-SPECIFIC RULES (if US)
### California (highest complexity)
- Daily OT: 1.5x after 8 hrs, 2x after 12 hrs
- 7th consecutive day: 1.5x first 8 hrs, 2x after
- Mandatory meal break: 30 min before 5th hour
- Rest break: 10 min per 4 hours
- Predictive scheduling ordinance (if applicable)

### Other Key States
- New York, Illinois, Washington predictive scheduling rules
- State-specific break requirements

## 3. ORACLE RULE CONFIGURATION
- How to configure each compliance rule in Oracle WFM
- Fast Formula requirements for complex OT rules
- Violation alert setup

## 4. AUDIT TRAIL AND REPORTING
- Compliance reports to configure
- How Oracle WFM tracks and proves compliance
- Audit log configuration

## 5. UNION / CBA COMPLIANCE
- How to configure union agreement rules
- Seniority-based scheduling rules
- Grievance prevention configuration

## 6. COMPLIANCE TESTING CHECKLIST
Step-by-step validation checklist for each rule

Use exact Oracle WFM field names."""

    else:  # shift_pattern
        prompt = header + f"""You are an Oracle Workforce Management expert. Generate complete Shift Pattern configurations.

Requirements:
{req.context}

Generate comprehensive Oracle WFM Shift Pattern specifications:

## 1. SHIFT PATTERN LIBRARY
Design 6–8 shift patterns appropriate for this client:

| Pattern Name | Days On | Days Off | Shift Times | Total Hours/Week | Notes |
Include:
- Standard day shift (Mon–Fri)
- Extended/4x10 schedule
- Rotating 12-hour shifts (Continental / Pitman / Panama)
- Part-time patterns (20–30 hrs)
- Weekend warrior pattern
- Split shift (if applicable)

## 2. ROTATION SCHEDULES (if applicable)
- Rotation cycle length (2-week / 4-week / 6-week)
- Team rotation sequence (Team A / B / C / D)
- Rotation change dates and transition rules
- Fairness rules (equal nights/weekends distribution)

## 3. HOLIDAY HANDLING
- How each pattern handles public holidays
- Holiday pay entitlement per pattern
- Holiday scheduling rules

## 4. ORACLE CONFIGURATION STEPS
How to build each pattern in Oracle WFM:
- Shift definition
- Pattern definition
- Calendar assignment
- Employee assignment

## 5. PATTERN ASSIGNMENT RULES
- Who gets which pattern (by role, location, seniority)
- Pattern change request process
- Trial period for new patterns

## 6. PAYROLL INTEGRATION
- How shift differentials are triggered by pattern
- Night shift, weekend, holiday premium pay rules

Use exact Oracle WFM field names."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history(f"HCM Workforce: {req.tool_type}", f"{req.client_name}: {req.context[:60]}", result)
    return {"result": result}
