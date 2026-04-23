import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { generateSQL } from '../api/client'
import { Database, ChevronDown } from 'lucide-react'

const SYSTEMS = ['JD Edwards EnterpriseOne', 'Oracle Cloud ERP', 'Oracle E-Business Suite', 'Oracle Database (Generic)']
const EXAMPLES = [
  'Show all open purchase orders with vendor name and amount over $10,000',
  'Find all GL journal entries posted in the last 30 days for business unit HOME',
  'List all customers with outstanding AR balance over 90 days',
  'Show inventory items with quantity on hand below reorder point',
  'Find all active employees hired in the last 6 months with their department',
]

export default function SQLGenerator() {
  const [description, setDescription] = useState('Show all open purchase orders for vendors in the US with a total amount over $10,000, including vendor name, PO number, order date, and buyer name. Only include POs that have not been fully received yet.')
  const [system, setSystem] = useState('JD Edwards EnterpriseOne')
  const [tablesHint, setTablesHint] = useState('F4301 (PO Header), F4311 (PO Detail), F0101 (Address Book for vendor names)')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!description.trim()) return
    setLoading(true); setOutput('')
    const res = await generateSQL(description, system, tablesHint)
    setOutput(res.query)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="SQL Query Generator" subtitle="Describe your data need in plain English — AI writes the Oracle SQL" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-semibold text-text-primary">Query Details</span>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Target System</label>
              <div className="relative">
                <select value={system} onChange={e => setSystem(e.target.value)}
                  className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:border-accent-cyan/40">
                  {SYSTEMS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Tables Hint (optional)</label>
              <input value={tablesHint} onChange={e => setTablesHint(e.target.value)}
                placeholder="e.g. F4311, F0101, F4101"
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-cyan/40" />
            </div>
          </div>
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-text-muted font-medium">Try an example</span>
            </div>
            <div className="space-y-1.5">
              {EXAMPLES.map(e => (
                <button key={e} onClick={() => setDescription(e)}
                  className="w-full text-left text-xs text-text-secondary bg-bg-hover border border-border-dim rounded-lg px-3 py-2 hover:border-accent-cyan/30 hover:text-text-primary transition-all">
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-bg-card border border-border-dim rounded-xl flex flex-col overflow-hidden" style={{ minHeight: 100 }}>
            <div className="px-4 py-3 border-b border-border-dim">
              <span className="text-xs text-text-muted font-medium">Describe what you need</span>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe what data you need in plain English..."
              rows={4}
              className="p-4 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none" />
          </div>
          <button onClick={run} disabled={!description.trim() || loading}
            className="w-full py-2.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-semibold rounded-xl hover:bg-accent-cyan/20 disabled:opacity-40 transition-all">
            {loading ? 'Generating SQL...' : 'Generate SQL Query'}
          </button>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Your SQL query with explanation and performance notes will appear here" />
      </div>
    </div>
  )
}
