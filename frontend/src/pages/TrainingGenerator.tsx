import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateTraining } from '../api/client'
import { GraduationCap, ChevronDown } from 'lucide-react'

const SYSTEMS = ['JD Edwards EnterpriseOne', 'Oracle Cloud ERP', 'Oracle E-Business Suite']
const MODULES = [
  'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets',
  'Procurement / Purchasing', 'Inventory Management', 'Sales Order Management',
  'Manufacturing', 'Payroll', 'Project Costing', 'CRM', 'HR / Human Capital',
  'Expense Management', 'Budgeting & Planning',
]
const ROLES = [
  'AP Clerk', 'AR Specialist', 'GL Accountant', 'Purchasing Agent',
  'Warehouse Staff', 'Sales Order Entry', 'Payroll Administrator',
  'Finance Manager', 'Project Manager', 'System Administrator',
]
const EXAMPLES = [
  { module: 'Accounts Payable', role: 'AP Clerk', system: 'JD Edwards EnterpriseOne' },
  { module: 'General Ledger', role: 'GL Accountant', system: 'Oracle Cloud ERP' },
  { module: 'Procurement / Purchasing', role: 'Purchasing Agent', system: 'JD Edwards EnterpriseOne' },
  { module: 'Accounts Receivable', role: 'AR Specialist', system: 'Oracle Cloud ERP' },
]

export default function TrainingGenerator() {
  const [module, setModule] = useState('Accounts Payable')
  const [system, setSystem] = useState('JD Edwards EnterpriseOne')
  const [userRole, setUserRole] = useState('AP Clerk')
  const [clientName, setClientName] = useState('Acme Manufacturing Inc.')
  const [configNotes, setConfigNotes] = useState('Client uses a 3-way match process. Payment terms default to Net 30. Vouchers over $50,000 require dual approval. Vendor master managed centrally by AP Manager — clerks cannot add new vendors.')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setModule(ex.module)
    setUserRole(ex.role)
    setSystem(ex.system)
  }

  const run = async () => {
    setLoading(true); setOutput('')
    const res = await generateTraining(module, system, userRole, clientName, configNotes)
    setOutput(res.guide)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Training Material Generator" subtitle="Generate complete end-user training guides for any Oracle ERP module and role" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">

          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-semibold text-text-primary">Training Configuration</span>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">ERP System</label>
              <div className="relative">
                <select value={system} onChange={e => setSystem(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {SYSTEMS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Module</label>
              <div className="relative">
                <select value={module} onChange={e => setModule(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {MODULES.map(m => <option key={m}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">User Role</label>
              <div className="relative">
                <select value={userRole} onChange={e => setUserRole(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Client Name <span className="text-text-muted font-normal">(optional)</span></label>
              <input value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Apex Manufacturing Inc."
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan/40" />
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Configuration Notes <span className="text-text-muted font-normal">(optional)</span></label>
              <textarea value={configNotes} onChange={e => setConfigNotes(e.target.value)}
                placeholder="e.g. Using 2-way PO match, custom approval workflow enabled, business unit HOME only..."
                rows={3}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:border-accent-cyan/40" />
            </div>
          </div>

          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <p className="text-xs text-text-muted font-medium mb-2">Quick examples</p>
            <div className="space-y-1.5">
              {EXAMPLES.map(ex => (
                <button key={ex.module + ex.role} onClick={() => loadExample(ex)}
                  className="w-full text-left text-xs text-text-secondary bg-bg-hover border border-border-dim rounded-lg px-3 py-2 hover:border-accent-cyan/30 hover:text-text-primary transition-all">
                  {ex.module} — <span className="text-text-muted">{ex.role} · {ex.system.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={run} disabled={loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating Training Guide...' : 'Generate Training Guide'}
          </button>
        </div>

        <OutputPanel content={output} loading={loading} placeholder="Complete training guide with step-by-step procedures, screenshots notes, exercises, and knowledge check will appear here" />
      </div>
    </div>
  )
}
