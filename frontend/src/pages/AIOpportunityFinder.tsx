import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { findAIOpportunity } from '../api/client'
import { Sparkles, ChevronDown } from 'lucide-react'

const INDUSTRIES = [
  'Manufacturing', 'Distribution & Logistics', 'Healthcare', 'Financial Services',
  'Retail', 'Construction & Real Estate', 'Energy & Utilities', 'Professional Services',
  'Public Sector / Government', 'Food & Beverage',
]
const COMPANY_SIZES = [
  'Small Business (<500 employees)',
  'Mid-Market (500–5,000 employees)',
  'Enterprise (5,000–50,000 employees)',
  'Large Enterprise (50,000+ employees)',
]
const ERP_SYSTEMS = [
  'Oracle Cloud ERP (Fusion)', 'JD Edwards EnterpriseOne', 'Oracle E-Business Suite',
  'Mixed (JDE + Oracle Cloud)', 'Pre-Oracle / Planning to migrate',
]
const ALL_MODULES = [
  'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets',
  'Procurement', 'Inventory', 'Manufacturing', 'Supply Chain',
  'HR / HCM', 'Payroll', 'Project Costing', 'CRM', 'Budgeting & Planning',
]
const SAMPLE_PAIN_POINTS = `Manual invoice processing taking 3+ days, no 2-way or 3-way match automation
Month-end close takes 10 business days — finance team working weekends
No real-time visibility into inventory levels across warehouses
Expense reports submitted on paper, reimbursement cycle is 3 weeks
Demand forecasting done in spreadsheets, frequent stockouts and overstock situations
No self-service HR portal — all employee queries go through HR team
Reporting requires IT involvement, business users can't build their own reports`

export default function AIOpportunityFinder() {
  const [clientName, setClientName] = useState('Acme Manufacturing Inc.')
  const [industry, setIndustry] = useState('Manufacturing')
  const [erpSystem, setErpSystem] = useState('Oracle Cloud ERP (Fusion)')
  const [companySize, setCompanySize] = useState('Mid-Market (500–5,000 employees)')
  const [selectedModules, setSelectedModules] = useState<string[]>(['General Ledger', 'Accounts Payable', 'Procurement'])
  const [painPoints, setPainPoints] = useState(SAMPLE_PAIN_POINTS)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleModule = (m: string) =>
    setSelectedModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const run = async () => {
    if (!painPoints.trim()) return
    setLoading(true); setOutput('')
    const res = await findAIOpportunity(clientName, industry, selectedModules, painPoints, erpSystem, companySize)
    setOutput(res.assessment)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Oracle AI Opportunity Finder" subtitle="Map client pain points to Oracle AI Cloud products — build your AI upsell strategy" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">

          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent-purple" />
              <span className="text-sm font-semibold text-text-primary">Client Profile</span>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Client Name <span className="text-text-muted font-normal">(optional)</span></label>
              <input value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Apex Manufacturing Inc."
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan/40" />
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Industry</label>
              <div className="relative">
                <select value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Current ERP System</label>
              <div className="relative">
                <select value={erpSystem} onChange={e => setErpSystem(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {ERP_SYSTEMS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Company Size</label>
              <div className="relative">
                <select value={companySize} onChange={e => setCompanySize(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Active ERP Modules</label>
            <div className="flex flex-wrap gap-2">
              {ALL_MODULES.map(m => (
                <button key={m} onClick={() => toggleModule(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedModules.includes(m)
                      ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan'
                      : 'bg-bg-hover border-border-dim text-text-secondary hover:border-accent-cyan/20'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
              <span className="text-xs text-text-muted font-medium">Client Pain Points & Challenges <span className="text-accent-red">*</span></span>
              <button onClick={() => setPainPoints(SAMPLE_PAIN_POINTS)} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
            </div>
            <textarea value={painPoints} onChange={e => setPainPoints(e.target.value)}
              placeholder="Describe the client's business challenges, inefficiencies, and frustrations in their own words..."
              rows={6}
              className="p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>

          <button onClick={run} disabled={!painPoints.trim() || loading}
            className="w-full py-2.5 bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-sm font-semibold rounded-xl hover:bg-accent-purple/20 disabled:opacity-40 transition-all">
            {loading ? 'Analyzing Opportunities...' : 'Find Oracle AI Opportunities'}
          </button>
        </div>

        <OutputPanel content={output} loading={loading} placeholder="Oracle AI opportunity assessment with prioritized recommendations, product mapping, quick wins, and estimated revenue will appear here" />
      </div>
    </div>
  )
}
