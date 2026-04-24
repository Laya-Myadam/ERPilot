import { useState, useRef, useEffect } from 'react'
import { uploadDocument, chatWithDocument } from '../api/client'
import { Upload, FileText, Send, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Spinner from '../components/ui/Spinner'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isAuto?: boolean  // auto-generated summary — not sent back as chat history
}

const SUMMARY_PROMPT =
  'Give me a plain English summary of this document. Cover: what it is, who the parties are, key dates and deadlines, any financial amounts or fees, main deliverables or commitments, and highlight 3–5 things the reader should pay close attention to. Use bullet points where helpful.'

export default function DocumentChatbot() {
  const [sessionId, setSessionId] = useState('')
  const [filename, setFilename] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const streamMessage = async (sid: string, prompt: string, history: Message[], isAuto = false) => {
    const historyForApi = history
      .filter(m => !m.isAuto)
      .map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [...prev, { role: 'assistant', content: '', isAuto }])
    setStreaming(true)
    try {
      await chatWithDocument(sid, prompt, historyForApi, chunk => {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Error getting response. Please try again.',
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleFile = async (file: File) => {
    setUploadError('')
    setUploading(true)
    try {
      const res = await uploadDocument(file)
      setSessionId(res.session_id)
      setFilename(res.filename)
      setCharCount(res.char_count)
      setMessages([])
      setUploading(false)
      await streamMessage(res.session_id, SUMMARY_PROMPT, [], true)
    } catch (e: any) {
      setUploadError(e?.response?.data?.detail || 'Failed to process document. Try a PDF, DOCX, or TXT file.')
      setUploading(false)
    }
  }

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const send = async () => {
    if (!input.trim() || streaming) return
    const userMsg = input.trim()
    setInput('')
    const history = [...messages]
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    await streamMessage(sessionId, userMsg, [...history, { role: 'user', content: userMsg }])
  }

  const reset = () => {
    setSessionId(''); setFilename(''); setCharCount(0)
    setMessages([]); setInput(''); setUploadError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Upload screen ──────────────────────────────────────────────────────────
  if (!sessionId && !uploading) {
    return (
      <div className="max-w-2xl mx-auto mt-16 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Document Chatbot</h1>
          <p className="text-zinc-400">Upload a document — get an instant summary, then ask anything about it</p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-accent-cyan bg-accent-cyan/5'
              : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={onFileInput} />
          <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-4" />
          <p className="text-white font-medium mb-1">Drop your document here</p>
          <p className="text-zinc-500 text-sm">or click to browse — PDF, DOCX, TXT supported</p>
        </div>

        {uploadError && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {uploadError}
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {['SOW / Contracts', 'Project Plans', 'Technical Specs'].map(t => (
            <div key={t} className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-3">
              <FileText className="w-4 h-4 text-accent-cyan mx-auto mb-1.5" />
              <p className="text-xs text-zinc-400">{t}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Processing screen ──────────────────────────────────────────────────────
  if (uploading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Spinner />
        <p className="text-zinc-400 text-sm">Reading document...</p>
      </div>
    )
  }

  // ── Chat screen ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-accent-cyan" />
          <div>
            <p className="text-sm font-semibold text-white">{filename}</p>
            <p className="text-[11px] text-zinc-500">{(charCount / 1000).toFixed(1)}k characters extracted</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition">
          <RotateCcw className="w-3.5 h-3.5" />
          New document
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === 'assistant' ? (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-accent-cyan" />
                </div>
                <div className={`flex-1 rounded-2xl px-4 py-3 text-sm border ${
                  m.isAuto
                    ? 'bg-zinc-800/80 border-accent-cyan/15'
                    : 'bg-zinc-800/50 border-zinc-700'
                }`}>
                  {m.isAuto && m.content && (
                    <p className="text-[10px] text-accent-cyan font-semibold uppercase tracking-wider mb-2">
                      Document Summary
                    </p>
                  )}
                  {m.content ? (
                    <div className="markdown-output text-zinc-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Spinner />
                      <span className="text-xs">{m.isAuto ? 'Summarizing document...' : 'Thinking...'}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-accent-cyan/10 border border-accent-cyan/20 rounded-2xl px-4 py-3 text-sm text-white">
                  {m.content}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask a question about the document..."
            disabled={streaming}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-accent-cyan/50 max-h-32 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition flex-shrink-0"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-2 text-center">Answers are grounded in the uploaded document only</p>
      </div>
    </div>
  )
}
