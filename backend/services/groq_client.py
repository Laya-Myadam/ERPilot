import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = None

def get_groq_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not set in environment")
        _client = Groq(api_key=api_key)
    return _client

PRIMARY_MODEL = "llama-3.3-70b-versatile"
FAST_MODEL = "llama-3.1-8b-instant"

def chat_completion(messages: list, temperature: float = 0.3, max_tokens: int = 2048, fast: bool = False) -> str:
    client = get_groq_client()
    model = FAST_MODEL if fast else PRIMARY_MODEL
    response = client.chat.completions.create(
        messages=messages,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content

def stream_completion(messages: list, temperature: float = 0.3, max_tokens: int = 2048):
    client = get_groq_client()
    stream = client.chat.completions.create(
        messages=messages,
        model=PRIMARY_MODEL,
        temperature=temperature,
        max_tokens=max_tokens,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
