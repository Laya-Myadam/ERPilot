import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { summarizeDocument } from '../api/client'
import { FileText, ChevronDown } from 'lucide-react'

const DOC_TYPES = ['SOW', 'RFP', 'Oracle Release Notes', 'Requirements Document', 'Technical Specification', 'Meeting Minutes', 'General']

const SAMPLE = `This Statement of Work (SOW) is entered into between Denovo LLC and ABC Manufacturing Inc. for the implementation of JD Edwards EnterpriseOne Financial Modules including General Ledger, Accounts Payable, and Accounts Receivable. The project is estimated at 16 weeks with a team of 4 senior consultants. Phase 1 covers discovery and design (weeks 1-4), Phase 2 covers configuration and development (weeks 5-12), and Phase 3 covers testing and go-live (weeks 13-16). Key risks include data quality from the legacy AS/400 system and availability of client subject matter experts. The client must provide dedicated resources for UAT and have all historical data cleansed by week 8.`

export default function DocSummarizer() {
  const [doc, setDoc] = useState('')
  const [docType, setDocType] = useState('SOW')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!doc.trim()) return
    setLoading(true); setOutput('')
    const res = await summarizeDocument(doc, docType)
    setOutput(res.summary)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Document Summarizer" subtitle="Paste any ERP document — get structured insights instantly" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Input */}
        <div className="w-2/5 flex flex-col gap-3">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Document Type</label>
            <div className="relative">
              <select value={docType} onChange={e => setDocType(e.target.value)}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-text-muted" />
                <span className="text-xs text-text-muted font-medium">Paste Document</span>
              </div>
              <button onClick={() => setDoc(SAMPLE)} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
            </div>
            <textarea value={doc} onChange={e => setDoc(e.target.value)}
              placeholder="Paste your SOW, RFP, release notes, or any ERP document here..."
              className="flex-1 p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>
          <button onClick={run} disabled={!doc.trim() || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Summarizing...' : 'Summarize Document'}
          </button>
        </div>
        {/* Output */}
        <OutputPanel content={output} loading={loading} placeholder="Your structured summary will appear here" />
      </div>
    </div>
  )
}
