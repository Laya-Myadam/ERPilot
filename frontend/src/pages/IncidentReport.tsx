import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { draftIncidentReport } from '../api/client'
import { AlertTriangle, ChevronDown } from 'lucide-react'

const SYSTEMS = ['JD Edwards EnterpriseOne', 'Oracle Cloud ERP', 'Oracle Cloud HCM', 'Oracle Cloud SCM', 'JDE Orchestrator', 'Oracle Integration Cloud']
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const SAMPLE_LOG = `ERROR 2024-01-15 02:34:17 [UBE] R09801 - Job 4512
BSFN B0900030 - GetAccountBalance returned error: 0000023B
Parameters: GLCO=00001, GLMCU=HOME, GLOBJ=1110, GLSUB=
JDE Error: Invalid date range - Period 13 not open for company 00001
Stack trace: P09200>R09801>B0900030
Affected users: 47 consultants unable to run period-end GL reports
Time started: 02:30 AM, Duration: ongoing
Server: JDEAPP01 - JAS 9.2.7.3`

export default function IncidentReport() {
  const [form, setForm] = useState({ error_logs: SAMPLE_LOG, system: 'JD Edwards EnterpriseOne', severity: 'High', affected_users: 47 })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!form.error_logs.trim()) return
    setLoading(true); setOutput('')
    const res = await draftIncidentReport(form)
    setOutput(res.report)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Incident Report Drafter" subtitle="Paste error logs — AI drafts a professional incident report instantly" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-accent-orange" />
              <span className="text-sm font-semibold text-text-primary">Incident Details</span>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">System</label>
              <div className="relative">
                <select value={form.system} onChange={e => setForm(p => ({ ...p, system: e.target.value }))}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {SYSTEMS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">Severity</label>
                <div className="flex gap-1.5 flex-wrap">
                  {SEVERITIES.map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, severity: s }))}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${form.severity === s
                        ? s === 'Critical' ? 'bg-accent-red/10 border-accent-red/30 text-accent-red'
                          : s === 'High' ? 'bg-accent-orange/10 border-accent-orange/30 text-accent-orange'
                          : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                        : 'bg-bg-hover border-border-dim text-text-muted'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">Affected Users</label>
                <input type="number" value={form.affected_users} onChange={e => setForm(p => ({ ...p, affected_users: +e.target.value }))}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-cyan/40" />
              </div>
            </div>
          </div>
          <div className="flex-1 bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
              <span className="text-xs text-text-muted font-medium">Error Logs / Description</span>
              <button onClick={() => setForm(p => ({ ...p, error_logs: SAMPLE_LOG }))} className="text-xs text-accent-cyan hover:underline">Load Sample</button>
            </div>
            <textarea value={form.error_logs} onChange={e => setForm(p => ({ ...p, error_logs: e.target.value }))}
              placeholder="Paste error logs, stack traces, or describe the incident..."
              className="flex-1 p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none font-mono" />
          </div>
          <button onClick={run} disabled={!form.error_logs.trim() || loading}
            className="w-full py-2.5 bg-accent-orange/10 border border-accent-orange/30 text-accent-orange text-sm font-semibold rounded-xl hover:bg-accent-orange/20 disabled:opacity-40 transition-all">
            {loading ? 'Drafting Report...' : 'Draft Incident Report'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Professional incident report with root cause, impact, resolution steps, and client communication template" />
      </div>
    </div>
  )
}
