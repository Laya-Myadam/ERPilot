from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import chat_completion

router = APIRouter()

class SQLRequest(BaseModel):
    description: str
    system: str = "JD Edwards"
    tables_hint: str = ""

JDE_TABLE_CONTEXT = """Common JDE tables:
- F0006: Business Unit Master
- F0101: Address Book Master
- F0111: Address Book - Who's Who
- F0411: Accounts Payable Ledger
- F0511: Accounts Receivable Ledger
- F0902: Account Balances
- F0911: Account Ledger (transactions)
- F4101: Item Master
- F4102: Item Branch Plant
- F4111: Item Ledger (cardex)
- F4211: Sales Order Header
- F4311: Purchase Order Header
- F4801: Work Order Master
- F48011: Work Order Instructions"""

SYSTEM_PROMPT = """You are an Oracle ERP database expert at Denovo. Convert natural language descriptions into precise SQL queries for Oracle JDE or Oracle Cloud databases.

Output format:

## Query Purpose
(Brief description of what this query returns)

## SQL Query
```sql
-- Your query here
```

## Query Explanation
(Line-by-line explanation of key joins and filters)

## Performance Notes
(Index hints, suggested filters, or optimization tips)

## Sample Output Columns
(List what each column in the result represents)

Always use table aliases. Add helpful comments in the SQL. For JDE, use the correct F-table names."""

@router.post("/generate")
async def generate_sql(req: SQLRequest):
    context = JDE_TABLE_CONTEXT if "JD Edwards" in req.system or "JDE" in req.system else ""
    user_content = f"System: {req.system}\nRequest: {req.description}"
    if req.tables_hint:
        user_content += f"\nHint - relevant tables: {req.tables_hint}"
    if context:
        user_content += f"\n\n{context}"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=1500)
    return {"query": result}
