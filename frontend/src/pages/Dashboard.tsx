import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../api/client'
import Header from '../components/Header'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MessageSquare, FileText, Clock, DollarSign, TrendingUp, Users, Zap, ArrowUpRight } from 'lucide-react'

interface Stats {
  consultants: number
  hours_saved_monthly: number
  tickets_deflected: number
  ai_queries_today: number
  documents_processed: number
  cost_saved_monthly: number
  monthly_queries: { month: string; queries: number }[]
  feature_usage: { feature: string; usage: number }[]
}

const MOCK_STATS: Stats = {
  consultants: 312,
  hours_saved_monthly: 4800,
  tickets_deflected: 1240,
  ai_queries_today: 847,
  documents_processed: 3621,
  cost_saved_monthly: 127000,
  monthly_queries: [
    { month: 'Nov', queries: 1340 },
    { month: 'Dec', queries: 1580 },
    { month: 'Jan', queries: 2100 },
    { month: 'Feb', queries: 2890 },
    { month: 'Mar', queries: 3720 },
    { month: 'Apr', queries: 4510 },
  ],
  feature_usage: [
    { feature: 'ERP Chatbot', usage: 98 },
    { feature: 'Doc Summarizer', usage: 87 },
    { feature: 'SQL Generator', usage: 74 },
    { feature: 'SOW Generator', usage: 61 },
    { feature: 'Meeting Notes', usage: 53 },
    { feature: 'Migration', usage: 42 },
    { feature: 'ROI Calc', usage: 31 },
  ],
}

const MetricCard = ({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub?: string; icon: any; color: string; trend?: string
}) => (
  <div className="bg-bg-card border border-border-dim rounded-xl p-5 hover:border-accent-cyan/30 transition-all duration-300 hover:shadow-glow-cyan group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-accent-green text-xs font-medium">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
    <div className="text-xs font-semibold text-text-secondary">{label}</div>
    {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-bg-card border border-border-dim rounded-lg px-3 py-2 text-xs shadow-card">
        <p className="text-text-secondary mb-1">{label}</p>
        <p className="text-accent-cyan font-semibold tabular-nums">{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS)

  useEffect(() => {
    fetchDashboardStats().then(data => { if (data) setStats(data) }).catch(() => {})
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="AI-powered Oracle ERP consulting platform overview" />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* Hero banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-accent-cyan/10 via-accent-purple/5 to-transparent border border-accent-cyan/20 p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-accent-purple/8 to-transparent" />
          <div className="absolute top-3 right-8 w-28 h-28 rounded-full bg-accent-cyan/5 border border-accent-cyan/10" />
          <div className="absolute bottom-3 right-28 w-14 h-14 rounded-full bg-accent-purple/8 border border-accent-purple/15" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent-cyan" />
              <span className="text-xs text-accent-cyan font-semibold uppercase tracking-wider">Powered by Groq + LLaMA 3.3</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Denovo AI Platform</h2>
            <p className="text-text-secondary text-sm max-w-lg">
              AI-enhanced consulting tools for Oracle JD Edwards & Oracle Cloud — built for Denovo's 300+ consultants to move faster, win more, and deliver better.
            </p>
            <div className="flex gap-3 mt-4">
              {['RAG-Powered', 'Real-time Streaming', 'Oracle-Trained', 'Zero/One-Shot NLP'].map(tag => (
                <span key={tag} className="text-xs bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
          <MetricCard label="Consultants" value={stats.consultants.toString()} sub="Active users" icon={Users} color="bg-accent-cyan/10 text-accent-cyan" trend="+12%" />
          <MetricCard label="Hours Saved" value={`${(stats.hours_saved_monthly / 1000).toFixed(1)}K`} sub="This month" icon={Clock} color="bg-accent-purple/10 text-accent-purple" trend="+28%" />
          <MetricCard label="Tickets Deflected" value={stats.tickets_deflected.toLocaleString()} sub="Support reduction" icon={MessageSquare} color="bg-accent-green/10 text-accent-green" trend="+19%" />
          <MetricCard label="AI Queries Today" value={stats.ai_queries_today.toLocaleString()} sub="Live count" icon={TrendingUp} color="bg-accent-orange/10 text-accent-orange" trend="+7%" />
          <MetricCard label="Docs Processed" value={stats.documents_processed.toLocaleString()} sub="Total" icon={FileText} color="bg-accent-cyan/10 text-accent-cyan" trend="+41%" />
          <MetricCard label="Cost Saved" value={`$${(stats.cost_saved_monthly / 1000).toFixed(0)}K`} sub="Monthly" icon={DollarSign} color="bg-accent-green/10 text-accent-green" trend="+33%" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 bg-bg-card border border-border-dim rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">AI Query Volume</h3>
                <p className="text-xs text-text-muted">Monthly platform usage growth</p>
              </div>
              <span className="text-xs bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-full font-medium">+300% YoY</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.monthly_queries}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="queries" stroke="#2dd4bf" strokeWidth={2} fill="url(#tealGrad)" dot={{ fill: '#2dd4bf', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-2 bg-bg-card border border-border-dim rounded-xl p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-text-primary">Feature Usage</h3>
              <p className="text-xs text-text-muted">Queries per feature (normalized)</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.feature_usage} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="feature" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="usage" fill="#a78bfa" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">AI Capabilities</h3>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'ERP Chatbot', desc: 'JDE/Oracle Q&A in plain English', color: 'from-accent-cyan/15 to-transparent', path: '/chatbot' },
              { label: 'Doc Summarizer', desc: 'SOW, RFP & manual summaries', color: 'from-accent-purple/15 to-transparent', path: '/summarizer' },
              { label: 'SOW Generator', desc: 'Auto-draft statements of work', color: 'from-accent-green/15 to-transparent', path: '/sow' },
              { label: 'SQL Generator', desc: 'Natural language to Oracle SQL', color: 'from-accent-orange/15 to-transparent', path: '/sql' },
              { label: 'Proposal Generator', desc: 'AI-crafted sales proposals', color: 'from-accent-cyan/15 to-transparent', path: '/proposal' },
            ].map(f => (
              <a key={f.label} href={f.path} className={`bg-gradient-to-br ${f.color} bg-bg-card border border-border-dim rounded-xl p-4 hover:border-accent-cyan/30 transition-all cursor-pointer group block`}>
                <p className="text-sm font-semibold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors">{f.label}</p>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
