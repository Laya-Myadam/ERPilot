import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateProposal } from '../api/client'
import { Send } from 'lucide-react'

const INDUSTRIES = ['Manufacturing', 'Distribution', 'Healthcare', 'Financial Services', 'Retail', 'Construction', 'Energy & Utilities', 'Public Sector', 'Professional Services', 'Technology']
const SYSTEMS = ['JD Edwards EnterpriseOne (older version)', 'Oracle E-Business Suite', 'SAP ECC', 'Microsoft Dynamics', 'Sage', 'Custom/Legacy', 'No ERP (first-time implementation)', 'Unknown']

export default function ProposalGenerator() {
  const [form, setForm] = useState({
    client_name: 'Acme Manufacturing Inc.',
    client_industry: 'Manufacturing',
    current_system: 'JD Edwards EnterpriseOne (older version)',
    pain_points: 'Payroll processing takes 3 days and is entirely manual. HR team of 8 spending 60% of time on data entry and report requests. No self-service for employees — everything goes through HR. Month-end close takes 12 days. Cannot report headcount by department in real time.',
    budget_range: '$1.5M – $2.5M',
    timeline: '18 months to go-live, targeting January 2026',
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!form.client_name || !form.pain_points) return
    setLoading(true); setOutput('')
    const res = await generateProposal(form)
    setOutput(res.proposal)
    setLoading(false)
  }

  const inp = (label: string, key: keyof typeof form, placeholder: string, area = false, required = false) => (
    <div>
      <label className="text-xs text-text-muted font-medium block mb-1.5">{label}{required && <span className="text-accent-red ml-1">*</span>}</label>
      {area
        ? <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} rows={3}
            className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none outline-none focus:border-accent-cyan/40" />
        : <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
            className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-cyan/40" />}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <Header title="Proposal Generator" subtitle="Input client details — AI drafts a compelling, tailored sales proposal" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-accent-purple" />
              <span className="text-sm font-semibold text-text-primary">Client Information</span>
            </div>
            {inp('Client Name', 'client_name', 'e.g. Midwest Industrial Corp', false, true)}
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Industry</label>
              <select value={form.client_industry} onChange={e => setForm(p => ({ ...p, client_industry: e.target.value }))}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Current System</label>
              <select value={form.current_system} onChange={e => setForm(p => ({ ...p, current_system: e.target.value }))}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                {SYSTEMS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {inp('Pain Points & Challenges', 'pain_points', 'e.g. Manual reporting taking 3 days, no real-time visibility, year-end close takes 2 weeks, integration failures with WMS...', true, true)}
            <div className="grid grid-cols-2 gap-3">
              {inp('Budget Range', 'budget_range', 'e.g. $500K-$1M')}
              {inp('Timeline', 'timeline', 'e.g. Go-live by Q3 2025')}
            </div>
          </div>
          <button onClick={run} disabled={!form.client_name || !form.pain_points || loading}
            className="w-full py-2.5 bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-sm font-semibold rounded-xl hover:bg-accent-purple/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating Proposal...' : 'Generate Sales Proposal'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Full tailored proposal with client-specific pain points, Denovo solution, methodology, and next steps will appear here" />
      </div>
    </div>
  )
}
