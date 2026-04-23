import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateSOW } from '../api/client'
import { ClipboardList, X, Plus } from 'lucide-react'

const MODULES = ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Procurement', 'Inventory', 'Sales Order', 'Manufacturing', 'Payroll', 'Project Costing']

export default function SOWGenerator() {
  const [form, setForm] = useState({
    project_name: 'Oracle Fusion Cloud HCM Implementation',
    client_name: 'Acme Manufacturing Inc.',
    project_scope: 'Full implementation of Oracle Fusion Cloud HCM including Core HCM, Payroll, Absence Management, and Time & Labor for 2,400 employees across 3 US legal entities. Includes data migration from ADP Workforce Now, configuration, testing, training, and hypercare support.',
    timeline_weeks: 36,
    team_size: 6
  })
  const [modules, setModules] = useState<string[]>(['Payroll', 'General Ledger', 'Accounts Payable'])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const toggle = (m: string) => setModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const run = async () => {
    if (!form.project_name || !form.client_name || !form.project_scope) return
    setLoading(true); setOutput('')
    const res = await generateSOW({ ...form, modules })
    setOutput(res.sow)
    setLoading(false)
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs text-text-muted font-medium block mb-1.5">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: type === 'number' ? +e.target.value : e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-cyan/40 transition-colors" />
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <Header title="SOW Generator" subtitle="Describe your project — AI drafts a complete Statement of Work" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-semibold text-text-primary">Project Details</span>
            </div>
            {field('Project Name', 'project_name', 'text', 'e.g. JDE Financial Implementation')}
            {field('Client Name', 'client_name', 'text', 'e.g. ABC Manufacturing Inc.')}
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Project Scope Description</label>
              <textarea value={form.project_scope} onChange={e => setForm(prev => ({ ...prev, project_scope: e.target.value }))}
                placeholder="Describe the project scope, objectives, and key requirements..."
                rows={4}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none outline-none focus:border-accent-cyan/40 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field('Timeline (weeks)', 'timeline_weeks', 'number')}
              {field('Team Size', 'team_size', 'number')}
            </div>
          </div>
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Modules in Scope</label>
            <div className="flex flex-wrap gap-2">
              {MODULES.map(m => (
                <button key={m} onClick={() => toggle(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${modules.includes(m) ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan' : 'bg-bg-hover border-border-dim text-text-muted hover:border-accent-cyan/20'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={run} disabled={!form.project_name || !form.client_name || !form.project_scope || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating SOW...' : 'Generate Statement of Work'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Full SOW document with scope, phases, deliverables, and timeline will appear here" />
      </div>
    </div>
  )
}
