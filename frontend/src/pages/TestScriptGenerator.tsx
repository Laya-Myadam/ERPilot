import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateTestScript } from '../api/client'
import { FlaskConical, ChevronDown } from 'lucide-react'

const SYSTEMS = ['JD Edwards EnterpriseOne', 'Oracle Cloud ERP', 'Oracle E-Business Suite']
const TEST_TYPES = ['UAT', 'Integration', 'Regression', 'Unit']
const MODULES = [
  'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets',
  'Procurement', 'Inventory Management', 'Sales Order', 'Manufacturing',
  'Payroll', 'Project Costing', 'CRM', 'HR/Human Capital',
]
const EXAMPLES = [
  'Create and post a GL journal entry with intercompany allocation',
  'Process a 3-way PO match invoice through AP voucher entry',
  'Run AR aging report and apply customer payment against open invoices',
  'Add a new inventory item and complete a purchase receipt',
  'Create a sales order, ship confirm, and generate invoice',
]

export default function TestScriptGenerator() {
  const [module, setModule] = useState('Accounts Payable')
  const [system, setSystem] = useState('JD Edwards EnterpriseOne')
  const [testType, setTestType] = useState('UAT')
  const [scenario, setScenario] = useState('Process a 3-way purchase order match: create a PO for $15,000 of raw materials, receive partial goods (60%), then enter an AP voucher for the full invoice amount and verify the system flags the quantity discrepancy correctly before allowing payment.')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!scenario.trim()) return
    setLoading(true); setOutput('')
    const res = await generateTestScript(module, system, testType, scenario)
    setOutput(res.script)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Test Script Generator" subtitle="Generate detailed UAT & regression test scripts for Oracle ERP modules" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">

          {/* Config */}
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-semibold text-text-primary">Test Configuration</span>
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
              <label className="text-xs text-text-muted font-medium block mb-1.5">Test Type</label>
              <div className="flex gap-2">
                {TEST_TYPES.map(t => (
                  <button key={t} onClick={() => setTestType(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      testType === t
                        ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan'
                        : 'bg-bg-hover border-border-dim text-text-secondary hover:border-accent-cyan/20'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <p className="text-xs text-text-muted font-medium mb-2">Try an example</p>
            <div className="space-y-1.5">
              {EXAMPLES.map(e => (
                <button key={e} onClick={() => setScenario(e)}
                  className="w-full text-left text-xs text-text-secondary bg-bg-hover border border-border-dim rounded-lg px-3 py-2 hover:border-accent-cyan/30 hover:text-text-primary transition-all">
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario */}
          <div className="bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden" style={{ minHeight: 100 }}>
            <div className="px-4 py-3 border-b border-border-dim">
              <span className="text-xs text-text-muted font-medium">Test Scenario Description</span>
            </div>
            <textarea value={scenario} onChange={e => setScenario(e.target.value)}
              placeholder="Describe the business process or functionality to test..."
              rows={4}
              className="p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>

          <button onClick={run} disabled={!scenario.trim() || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating Script...' : 'Generate Test Script'}
          </button>
        </div>

        <OutputPanel content={output} loading={loading} placeholder="Your detailed test script with steps, expected results, test data, and sign-off table will appear here" />
      </div>
    </div>
  )
}
