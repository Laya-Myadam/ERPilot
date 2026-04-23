from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from data.knowledge_base import ERP_KNOWLEDGE

_vectorizer = None
_tfidf_matrix = None
_docs = []

def _build_index():
    global _vectorizer, _tfidf_matrix, _docs
    _docs = ERP_KNOWLEDGE
    corpus = [f"{d['title']} {d['content']} {' '.join(d['tags'])}" for d in _docs]
    _vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    _tfidf_matrix = _vectorizer.fit_transform(corpus)

def retrieve(query: str, top_k: int = 3) -> list[dict]:
    global _vectorizer, _tfidf_matrix, _docs
    if _vectorizer is None:
        _build_index()
    query_vec = _vectorizer.transform([query])
    scores = cosine_similarity(query_vec, _tfidf_matrix).flatten()
    top_indices = np.argsort(scores)[::-1][:top_k]
    results = []
    for idx in top_indices:
        if scores[idx] > 0.01:
            results.append({
                "title": _docs[idx]["title"],
                "content": _docs[idx]["content"],
                "score": float(scores[idx]),
            })
    return results

def build_context(query: str, top_k: int = 3) -> str:
    docs = retrieve(query, top_k)
    if not docs:
        return ""
    context_parts = []
    for d in docs:
        context_parts.append(f"[{d['title']}]\n{d['content']}")
    return "\n\n".join(context_parts)
