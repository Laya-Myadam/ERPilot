import { useState } from 'react'
import Header from '../components/Header'
import OutputPanel from '../components/ui/OutputPanel'
import { calculateROI } from '../api/client'
import { Calculator, DollarSign, Clock, TrendingUp } from 'lucide-react'

const SAMPLE = { project_name: 'Denovo AI Platform', num_consultants: 50, hours_saved_per_week: 3, avg_hourly_rate: 150, ticket_volume_monthly: 400, ticket_deflection_rate: 0.30, implementation_cost: 75000 }

export default function ROICalculator() {
  const [form, setForm] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true); setOutput(''); setMetrics(null)
    const res = await calculateROI(form)
    setOutput(res.narrative)
    setMetrics(res.metrics)
    setLoading(false)
  }

  const num = (label: string, key: keyof typeof form, prefix = '', suffix = '', step = 1) => (
    <div>
      <label className="text-xs text-text-muted font-medium block mb-1.5">{label}</label>
      <div className="flex items-center gap-1 bg-bg-hover border border-border-dim rounded-lg px-3 py-2 focus-within:border-accent-cyan/40 transition-colors">
        {prefix && <span className="text-text-muted text-sm">{prefix}</span>}
        <input type="number" value={form[key] as number} step={step}
          onChange={e => setForm(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
          className="flex-1 bg-transparent text-sm text-text-primary outline-none" />
        {suffix && <span className="text-text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  )

  const monthlySavings = form.num_consultants * form.hours_saved_per_week * 4.33 * form.avg_hourly_rate
  const ticketSavings = form.ticket_volume_monthly * form.ticket_deflection_rate * 150
  const totalMonthly = monthlySavings + ticketSavings

  return (
    <div className="flex flex-col h-full">
      <Header title="ROI Calculator" subtitle="Input your numbers — AI writes the executive ROI story" />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-2/5 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-bg-card border border-border-dim rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-semibold text-text-primary">Input Parameters</span>
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium block mb-1.5">Project Name</label>
              <input value={form.project_name} onChange={e => setForm(p => ({ ...p, project_name: e.target.value }))}
                className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-cyan/40" />
            </div>
            {num('Number of Consultants', 'num_consultants', '', ' people')}
            {num('Hours Saved per Consultant/Week', 'hours_saved_per_week', '', ' hrs/week', 0.5)}
            {num('Average Hourly Rate', 'avg_hourly_rate', '$', '/hr')}
            {num('Monthly Ticket Volume', 'ticket_volume_monthly', '', ' tickets/month')}
            {num('Ticket Deflection Rate', 'ticket_deflection_rate', '', '%', 0.05)}
            {num('Implementation Cost', 'implementation_cost', '$')}
          </div>

          {/* Live Preview */}
          <div className="bg-bg-card border border-border-dim rounded-xl p-4">
            <p className="text-xs text-text-muted font-medium mb-3">Live Estimate</p>
            <div className="space-y-2">
              {[
                { label: 'Monthly Time Savings', value: `$${monthlySavings.toLocaleString(undefined, {maximumFractionDigits:0})}`, icon: Clock, color: 'text-accent-cyan' },
                { label: 'Monthly Ticket Savings', value: `$${ticketSavings.toLocaleString(undefined, {maximumFractionDigits:0})}`, icon: TrendingUp, color: 'text-accent-purple' },
                { label: 'Total Monthly Savings', value: `$${totalMonthly.toLocaleString(undefined, {maximumFractionDigits:0})}`, icon: DollarSign, color: 'text-accent-green' },
                { label: 'Annual Savings', value: `$${(totalMonthly*12).toLocaleString(undefined, {maximumFractionDigits:0})}`, icon: DollarSign, color: 'text-accent-green' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-border-dim last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-xs text-text-muted">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setForm(SAMPLE)} className="px-4 py-2.5 rounded-xl border border-border-dim text-text-muted text-sm hover:border-accent-green/30 hover:text-text-primary transition-all">Load Sample</button>
            <button onClick={run} disabled={loading}
              className="flex-1 py-2.5 bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-semibold rounded-xl hover:bg-accent-green/20 disabled:opacity-40 transition-all">
              {loading ? 'Building ROI Story...' : 'Generate Executive ROI Narrative'}
            </button>
          </div>
        </div>
        <OutputPanel content={output} loading={loading} placeholder="Complete ROI analysis with 12-month impact, payback period, 3-year projection, and executive narrative will appear here" />
      </div>
    </div>
  )
}
