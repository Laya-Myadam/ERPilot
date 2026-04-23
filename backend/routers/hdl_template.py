from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from database import save_history

router = APIRouter()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class HDLRequest(BaseModel):
    business_object: str  # Worker, Assignment, Salary, Benefits, etc.
    operation: str        # Load, Delete, Merge
    fields_needed: str = ""
    special_requirements: str = ""
    num_records: str = "100"

@router.post("/generate")
def generate_hdl_template(req: HDLRequest):
    prompt = f"""You are an Oracle HCM Data Loader (HDL) expert. Generate a complete HDL file template for the following data load scenario.

Business Object: {req.business_object}
Operation: {req.operation}
Fields Required: {req.fields_needed or "All standard fields for this object"}
Special Requirements: {req.special_requirements or "None"}
Approximate Record Count: {req.num_records}

Provide:
1. The exact HDL file header (METADATA line)
2. The DATA lines with all required and commonly-used optional columns
3. 3-5 sample data rows with realistic Oracle Fusion values (use placeholder values like <<VALUE>>)
4. Column-by-column explanation table: column name | required? | format/valid values | example
5. Common validation errors for this object and how to fix them
6. Loading sequence if this object has dependencies (e.g., Person before Assignment)
7. Any HCM Extracts or pre-requisite setup needed

Format the HDL file content in a code block with proper pipe-delimited format."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500,
        temperature=0.1,
    )
    result = response.choices[0].message.content
    save_history("HDL Template Generator", f"{req.operation} {req.business_object}", result)
    return {"template": result}
