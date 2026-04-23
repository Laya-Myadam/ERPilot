import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import { chatWithERP } from '../api/client'
import { Send, Bot, User, Trash2, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'How do I set up AAIs for accounts payable in JD Edwards?',
  'What is the difference between JDE EnterpriseOne and Oracle Cloud ERP?',
  'How do I troubleshoot a GL posting error in Oracle Cloud?',
  'Explain the JDE Orchestrator Framework',
  'What tables store sales order data in JDE?',
]

export default function ERPChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || streaming) return
    setInput('')
    const userMsg: Message = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])
    await chatWithERP(msg, messages.slice(-10), chunk => {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: updated[updated.length - 1].content + chunk }
        return updated
      })
    })
    setStreaming(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="ERP Chatbot" subtitle="Ask anything about JD Edwards & Oracle Cloud — powered by RAG + Groq" />
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 bg-bg-card border border-border-dim rounded-xl overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center shadow-glow-cyan">
                <Bot className="w-8 h-8 text-accent-cyan" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-text-primary mb-1">Oracle ERP Assistant</h3>
                <p className="text-sm text-text-muted max-w-md">Ask me anything about JD Edwards EnterpriseOne, Oracle Cloud ERP, modules, errors, configurations, or best practices.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-accent-orange" />
                  <span className="text-xs text-text-muted font-medium">Suggested questions</span>
                </div>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-left text-xs text-text-secondary bg-bg-hover border border-border-dim rounded-lg px-3 py-2 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-accent-cyan" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-accent-cyan/10 border border-accent-cyan/20 text-text-primary'
                      : 'bg-bg-hover border border-border-dim'
                  }`}>
                    {m.role === 'assistant' ? (
                      <div className={`markdown-output ${streaming && i === messages.length - 1 && !m.content ? 'typing-cursor' : ''}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || ' '}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-accent-purple" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <button onClick={() => setMessages([])} className="w-10 h-10 rounded-lg bg-bg-card border border-border-dim flex items-center justify-center hover:border-accent-red/30 hover:text-accent-red text-text-muted transition-all flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex-1 flex gap-2 bg-bg-card border border-border-dim rounded-xl px-4 py-2 focus-within:border-accent-cyan/40 transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask about JDE modules, Oracle Cloud, errors, configuration..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none pt-1"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || streaming}
              className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center hover:bg-accent-cyan/30 disabled:opacity-40 transition-all self-end flex-shrink-0"
            >
              <Send className="w-4 h-4 text-accent-cyan" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
