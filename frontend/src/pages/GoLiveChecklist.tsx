import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateGoLiveChecklist } from '../api/client'
import { Rocket, ChevronDown } from 'lucide-react'

const ERP_SYSTEMS = ['JD Edwards EnterpriseOne', 'Oracle Cloud ERP', 'Oracle E-Business Suite']
const CUTOVER_WINDOWS = [
  'Weekend (48 hours)', 'Long Weekend (72 hours)', 'Single Night (12 hours)', 'Phased (Rolling go-live)'
]
const MODULES = [
  'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets',
  'Procurement', 'Inventory', 'Sales Order', 'Manufacturing',
  'HR / Payroll', 'Project Costing', 'CRM',
]

export default function GoLiveChecklist() {
  const [projectName, setProjectName] = useState('Oracle Fusion Cloud HCM Implementation')
  const [clientName, setClientName] = useState('Acme Manufacturing Inc.')
  const [goLiveDate, setGoLiveDate] = useState('2025-10-01')
  const [erpSystem, setErpSystem] = useState('JD Edwards EnterpriseOne')
  const [teamSize, setTeamSize] = useState(5)
  const [cutoverWindow, setCutoverWindow] = useState('Weekend (48 hours)')
  const [selectedModules, setSelectedModules] = useState<string[]>(['General Ledger', 'Accounts Payable', 'Accounts Receivable'])
  const [specialConsiderations, setSpecialConsiderations] = useState('Union employees in Ohio plants must be manually verified before payroll go-live. California OT rules require separate validation. ADP parallel run must run simultaneously for 2 pay periods. CFO sign-off required before any data cutover begins.')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleModule = (m: string) =>
    setSelectedModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const loadSample = () => {
    setProjectName('Apex Financial Transformation')
    setClientName('Apex Manufacturing Inc.')
    setGoLiveDate('June 30, 2025')
    setErpSystem('JD Edwards EnterpriseOne')
    setTeamSize(6)
    setCutoverWindow('Weekend (48 hours)')
    setSelectedModules(['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Procurement'])
    setSpecialConsiderations('Fiscal year end cutover — must complete before July 1. Client has 3 international business units. Data migration from legacy SAP system.')
  }

  const run = async () => {
    if (!projectName.trim() || !clientName.trim() || !goLiveDate.trim()) return
    setLoading(true); setOutput('')
    const res = await generateGoLiveChecklist(
      projectName, clientName, goLiveDate, selectedModules,
      erpSystem, teamSize, cutoverWindow, specialConsiderations
    )
    setOutput(res.checklist)
    setLoading(false)
  }

  const canRun = projectName.trim() && clientName.trim() && goLiveDate.trim() && !loading

  return (
    <div className="flex flex-col h-full">
      <Header title="Go-Live Checklist Generator" subtitle="Generate a detailed cutover plan and go-live runbook for any ERP implementation" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">

          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-accent-green" />
                <span className="text-sm font-semibold text-text-primary">Project Details</span>
              </div>
              <button onClick={loadSample} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Project Name <span className="text-accent-red">*</span></label>
              <input value={projectName} onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Apex Financial Transformation"
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan/40" />
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Client Name <span className="text-accent-red">*</span></label>
              <input value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Apex Manufacturing Inc."
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan/40" />
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Target Go-Live Date <span className="text-accent-red">*</span></label>
              <input value={goLiveDate} onChange={e => setGoLiveDate(e.target.value)}
                placeholder="e.g. June 30, 2025 / Q2 2025"
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-accent-cyan/40" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">ERP System</label>
                <div className="relative">
                  <select value={erpSystem} onChange={e => setErpSystem(e.target.value)}
                    className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                    {ERP_SYSTEMS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">Team Size</label>
                <input type="number" min={1} max={50} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-cyan/40" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Cutover Window</label>
              <div className="relative">
                <select value={cutoverWindow} onChange={e => setCutoverWindow(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {CUTOVER_WINDOWS.map(w => <option key={w}>{w}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Modules Going Live</label>
            <div className="flex flex-wrap gap-2">
              {MODULES.map(m => (
                <button key={m} onClick={() => toggleModule(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedModules.includes(m)
                      ? 'bg-accent-green/15 border-accent-green/40 text-accent-green'
                      : 'bg-bg-hover border-border-dim text-text-secondary hover:border-accent-green/20'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border-dim">
              <span className="text-xs text-text-muted font-medium">Special Considerations <span className="text-text-muted font-normal">(optional)</span></span>
            </div>
            <textarea value={specialConsiderations} onChange={e => setSpecialConsiderations(e.target.value)}
              placeholder="e.g. Fiscal year-end cutover, multi-entity, data migration from legacy system, parallel run required..."
              rows={3}
              className="p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>

          <button onClick={run} disabled={!canRun}
            className="w-full py-2.5 bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-semibold rounded-xl hover:bg-accent-green/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating Checklist...' : 'Generate Go-Live Checklist'}
          </button>
        </div>

        <OutputPanel content={output} loading={loading} placeholder="Complete cutover runbook with pre-cutover tasks, day-by-day schedule, validation checkpoints, rollback plan, and hypercare support plan will appear here" />
      </div>
    </div>
  )
}
