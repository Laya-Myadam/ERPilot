import io
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from services.groq_client import chat_completion, get_groq_client
from database import save_history

router = APIRouter()


class MeetingNotesRequest(BaseModel):
    transcript: str
    meeting_type: str = "client call"


SYSTEM_PROMPT = """You are an experienced Oracle ERP project manager at Denovo. Extract structured action items and insights from meeting transcripts.

Output format:

## Meeting Summary
(2-3 sentences on what was discussed)

## Decisions Made
- (List all decisions with context)

## Action Items
| # | Task | Owner | Due Date | Priority |
|---|------|-------|----------|----------|
(Fill this table with specific, actionable tasks)

## Open Questions / Blockers
- (Unresolved items that need follow-up)

## Key Discussion Points
- (Important technical or business points raised)

## Next Meeting
- Suggested agenda items based on open items

Be specific. Extract real names and dates from the transcript when available. Flag ERP-specific technical items clearly."""


@router.post("/extract")
async def extract_meeting_notes(req: MeetingNotesRequest):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Meeting type: {req.meeting_type}\n\nTranscript:\n\n{req.transcript}"}
    ]
    result = chat_completion(messages, temperature=0.1, max_tokens=2000)
    save_history("Meeting Notes", req.meeting_type, result)
    return {"extracted": result}


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    client = get_groq_client()
    audio_bytes = await file.read()
    audio_file = (file.filename or "recording.webm", io.BytesIO(audio_bytes), file.content_type or "audio/webm")
    transcription = client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-large-v3",
        response_format="text",
    )
    return {"transcript": transcription}
