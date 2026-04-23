import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { analyzeReleaseNotes } from '../api/client'
import { Newspaper, X, Plus } from 'lucide-react'

const COMMON_MODULES = ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Fixed Assets', 'Procurement', 'Inventory', 'Sales Order', 'Manufacturing', 'Human Resources']
const SAMPLE_NOTES = `Oracle JD Edwards EnterpriseOne 9.2 Update 7 Release Notes

General Ledger:
- Fixed: Posting errors when batch contains multi-currency transactions with AAI table GLBA (Bug #34521)
- New: Enhanced Journal Entry approval workflow now supports mobile notifications
- Changed: Account balance calculation for period 14 now includes audit trail by default

Accounts Payable:
- Critical: Voucher match program (P4314) may cause duplicate payments when payment terms include early discount. Patch P4314-001 required before processing.
- New: AI-powered duplicate invoice detection (requires Orchestrator Framework 2.0)

Security Updates:
- Updated TLS certificates for all web services endpoints
- Removed deprecated SSLv3 support from JAS server configuration`

export default function ReleaseNotes() {
  const [notes, setNotes] = useState('')
  const [modules, setModules] = useState<string[]>(['General Ledger', 'Accounts Payable'])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [customModule, setCustomModule] = useState('')

  const toggleModule = (m: string) => setModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  const addCustom = () => { if (customModule.trim()) { setModules(prev => [...prev, customModule.trim()]); setCustomModule('') } }

  const run = async () => {
    if (!notes.trim()) return
    setLoading(true); setOutput('')
    const res = await analyzeReleaseNotes(notes, modules)
    setOutput(res.analysis)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Release Notes Digest" subtitle="Paste Oracle/JDE release notes — AI flags what matters for your client" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <label className="text-xs text-text-muted font-medium block mb-2">Client's Active Modules</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_MODULES.map(m => (
                <button key={m} onClick={() => toggleModule(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${modules.includes(m) ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan' : 'bg-bg-hover border-border-dim text-text-muted hover:border-accent-cyan/20'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input value={customModule} onChange={e => setCustomModule(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Add module..."
                className="flex-1 bg-bg-hover border border-border-dim rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder-text-muted outline-none focus:border-accent-cyan/40" />
              <button onClick={addCustom} className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan hover:bg-accent-cyan/20">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {modules.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {modules.map(m => (
                  <span key={m} className="flex items-center gap-1 text-xs bg-accent-purple/10 border border-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full">
                    {m}
                    <button onClick={() => setModules(prev => prev.filter(x => x !== m))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-text-muted" />
                <span className="text-xs text-text-muted font-medium">Release Notes</span>
              </div>
              <button onClick={() => setNotes(SAMPLE_NOTES)} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Paste Oracle or JDE release notes here..."
              className="flex-1 p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>
          <button onClick={run} disabled={!notes.trim() || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Analyzing...' : 'Analyze Release Notes'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Prioritized analysis with Critical/Important/Beneficial/Not Applicable sections" />
      </div>
    </div>
  )
}
