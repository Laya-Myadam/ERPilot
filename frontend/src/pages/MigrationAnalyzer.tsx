import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { analyzeMigration } from '../api/client'
import { ArrowRightLeft } from 'lucide-react'

const SYSTEMS = ['JD Edwards EnterpriseOne 9.2', 'JD Edwards EnterpriseOne 9.1', 'JD Edwards World', 'SAP ECC', 'Oracle E-Business Suite', 'Microsoft Dynamics', 'Sage', 'Custom/Legacy']
const TARGET_SYSTEMS = ['Oracle Cloud ERP (Fusion)', 'JDE EnterpriseOne 9.2 (Upgrade)', 'Oracle Cloud + JDE Hybrid']
const MODULES = ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Procurement', 'Inventory', 'Sales Order', 'Manufacturing', 'HR/Payroll', 'Project Costing', 'CRM']

export default function MigrationAnalyzer() {
  const [form, setForm] = useState({
    current_system: 'JD Edwards EnterpriseOne 9.1',
    target_system: 'Oracle Cloud ERP (Fusion)',
    customizations: '47 custom business functions (BSSVs), 12 custom UBEs for reporting, modified P4210 Sales Order entry screen with 8 additional fields, custom orchestrations for 3PL warehouse integration',
    integrations: 'Salesforce CRM (bidirectional), UPS/FedEx shipping, EDI 850/855/856 with 14 trading partners, ADP payroll (replacing), custom BI publisher reports feeding Power BI',
    data_volume: '850,000 item records, 2.4M customer records, 12 years of transaction history (GL, AP, AR), 2,400 employee records',
    go_live_target: 'October 1, 2025',
  })
  const [modules, setModules] = useState<string[]>(['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Procurement', 'Inventory'])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const toggle = (m: string) => setModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const run = async () => {
    setLoading(true); setOutput('')
    const res = await analyzeMigration({ ...form, modules })
    setOutput(res.assessment)
    setLoading(false)
  }

  const sel = (label: string, key: keyof typeof form, options: string[]) => (
    <div>
      <label className="text-xs text-text-muted font-medium block mb-1.5">{label}</label>
      <select value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )

  const inp = (label: string, key: keyof typeof form, placeholder: string, area = false) => (
    <div>
      <label className="text-xs text-text-muted font-medium block mb-1.5">{label}</label>
      {area
        ? <textarea value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder} rows={2}
            className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none outline-none focus:border-accent-cyan/40" />
        : <input value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
            className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-cyan/40" />}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <Header title="Migration Readiness Analyzer" subtitle="Assess your ERP migration risk and get an actionable roadmap" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-semibold text-text-primary">System Details</span>
            </div>
            {sel('Current System', 'current_system', SYSTEMS)}
            {sel('Target System', 'target_system', TARGET_SYSTEMS)}
            {inp('Customizations', 'customizations', 'e.g. 45 custom reports, 12 modified BSFNs, custom AP approval workflow', true)}
            {inp('Integrations', 'integrations', 'e.g. Salesforce CRM, Manhattan WMS, custom EDI feeds', true)}
            {inp('Data Volume', 'data_volume', 'e.g. 10 years history, 50GB, 2M transactions')}
            {inp('Target Go-Live', 'go_live_target', 'e.g. Q1 2025, January 2026')}
          </div>
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Active Modules</label>
            <div className="flex flex-wrap gap-2">
              {MODULES.map(m => (
                <button key={m} onClick={() => toggle(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${modules.includes(m) ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan' : 'bg-bg-hover border-border-dim text-text-muted hover:border-accent-cyan/20'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={run} disabled={loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Analyzing Migration...' : 'Analyze Migration Readiness'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Migration readiness score, module-by-module risk assessment, and recommended approach will appear here" />
      </div>
    </div>
  )
}
