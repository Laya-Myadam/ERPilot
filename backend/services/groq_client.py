import os
import random
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_clients = None


def _get_clients() -> list[Groq]:
    global _clients
    if _clients is None:
        keys = []
        primary = os.getenv("GROQ_API_KEY")
        if primary:
            keys.append(primary)
        for i in range(2, 10):
            k = os.getenv(f"GROQ_API_KEY_{i}")
            if k:
                keys.append(k)
            else:
                break
        if not keys:
            raise ValueError("No GROQ_API_KEY set in environment")
        _clients = [Groq(api_key=k) for k in keys]
    return _clients


def get_groq_client() -> Groq:
    return random.choice(_get_clients())


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
