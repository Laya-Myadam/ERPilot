import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Spinner from './Spinner'
import { Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'

interface OutputPanelProps {
  content: string
  loading?: boolean
  streaming?: boolean
  placeholder?: string
}

export default function OutputPanel({ content, loading, streaming, placeholder }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 bg-bg-card border border-border-dim rounded-xl flex flex-col min-h-[300px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading || streaming ? 'bg-accent-cyan animate-pulse' : content ? 'bg-accent-green' : 'bg-text-muted'}`} />
          <span className="text-xs text-text-muted font-medium">
            {loading ? 'Processing...' : streaming ? 'Generating...' : content ? 'Output Ready' : 'Awaiting Input'}
          </span>
        </div>
        {content && (
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-cyan transition-colors">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full gap-3 text-text-muted">
            <Spinner />
            <span className="text-sm">AI is analyzing...</span>
          </div>
        ) : content ? (
          <div className={`markdown-output text-sm ${streaming ? 'typing-cursor' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            {placeholder || 'Output will appear here'}
          </div>
        )}
      </div>
    </div>
  )
}
