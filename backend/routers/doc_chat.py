from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
import io
from services.groq_client import stream_completion

router = APIRouter()

_sessions: dict[str, dict] = {}

MAX_DOC_CHARS = 60000  # ~15k tokens, leaves headroom for conversation


async def _extract_text(file: UploadFile) -> str:
    content = await file.read()
    name = (file.filename or "").lower()

    if name.endswith(".pdf"):
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        return "\n\n".join(pages)

    if name.endswith(".docx"):
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())

    if name.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")

    raise HTTPException(status_code=400, detail="Unsupported file type. Upload a PDF, DOCX, or TXT file.")


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    text = await _extract_text(file)
    text = text[:MAX_DOC_CHARS]

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from this document. Try a different file.")

    session_id = str(uuid.uuid4())
    _sessions[session_id] = {
        "filename": file.filename,
        "text": text,
    }

    return {
        "session_id": session_id,
        "filename": file.filename,
        "char_count": len(text),
        "preview": text[:400],
    }


class DocChatRequest(BaseModel):
    session_id: str
    message: str
    history: list = []


@router.post("/chat")
async def chat_with_document(req: DocChatRequest):
    session = _sessions.get(req.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Document session expired or not found. Please re-upload your document.",
        )

    system_prompt = f"""You are a document analysis assistant. The user has uploaded a document and wants to ask questions about it.

Rules:
- Answer ONLY based on the content of the document below.
- If the answer is in the document, provide it clearly and reference the relevant section.
- If the answer is not in the document, say so directly: "This information isn't covered in the uploaded document."
- Be concise and professional. Format lists and tables when helpful.

DOCUMENT: {session['filename']}
{"=" * 60}
{session['text']}
{"=" * 60}"""

    messages = [{"role": "system", "content": system_prompt}]
    for h in req.history:
        messages.append(h)
    messages.append({"role": "user", "content": req.message})

    def generate():
        for chunk in stream_completion(messages, temperature=0.1, max_tokens=1500):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")


@router.delete("/session/{session_id}")
def delete_session(session_id: str):
    _sessions.pop(session_id, None)
    return {"ok": True}
