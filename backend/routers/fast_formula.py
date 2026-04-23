from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class FastFormulaRequest(BaseModel):
    formula_type: str  # Payroll, Absence, Proration, Validation
    description: str
    element_name: str = ""
    inputs: str = ""
    expected_output: str = ""

@router.post("/generate")
def generate_fast_formula(req: FastFormulaRequest):
    prompt = f"""You are an Oracle HCM Fast Formula expert. Generate a complete, working Oracle Fast Formula based on the requirements below.

Formula Type: {req.formula_type}
Business Rule / Description: {req.description}
Element Name: {req.element_name or "Not specified"}
Inputs/Variables: {req.inputs or "Standard defaults"}
Expected Output/Return: {req.expected_output or "Not specified"}

Generate:
1. FORMULA NAME suggestion (UPPERCASE_WITH_UNDERSCORES)
2. FORMULA TYPE declaration
3. All INPUTS with default values
4. All local variable declarations
5. The complete formula logic with comments
6. RETURN statement
7. A brief explanation of what each section does
8. Common gotchas or testing tips for this formula type

Use proper Oracle Fast Formula syntax. Include error handling where appropriate. Format the actual formula code in a code block."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.2,
    )
    result = response.choices[0].message.content
    save_history("Fast Formula Generator", f"{req.formula_type}: {req.description[:80]}", result)
    return {"formula": result}
