import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, FileText, Newspaper, ClipboardList,
  NotebookPen, ArrowRightLeft, AlertTriangle, Database, Send, Calculator,
  Search, FlaskConical, GraduationCap, Sparkles, Rocket, Code2, Table2,
  BookOpen, Swords, BarChart3, CalendarDays, Layers, Clock, Settings2, CheckSquare,
  TrendingUp, Ticket, GitPullRequest, Shield, Plug, Package
} from 'lucide-react'

const items = [
  // Biggest time savers — top of search results
  { path: '/fast-formula', label: 'Fast Formula Generator', desc: '🔴 2–4 hrs/formula, 50+ per client → write Oracle Fast Formulas instantly', icon: Code2 },
  { path: '/payroll-recon', label: 'Payroll Reconciliation', desc: '🔴 Days of manual comparison → paste totals, get variance analysis', icon: BarChart3 },
  { path: '/parallel-run', label: 'Parallel Run Checklist', desc: '🔴 Days per payroll cycle → complete validation guide & sign-off', icon: CheckSquare },
  { path: '/hdl-template', label: 'HDL Template Generator', desc: '🔴 Hours per object, 30+ objects → generate HDL templates instantly', icon: Table2 },
  { path: '/absence-plan', label: 'Absence Plan Designer', desc: '🟡 1–2 days per client policy → full Oracle Absence Plan config spec', icon: CalendarDays },
  { path: '/hcm-workbook', label: 'HCM Config Workbook', desc: '🟡 Days of gathering → full config workbook with open items & decisions', icon: Settings2 },
  { path: '/payroll-element', label: 'Payroll Element Designer', desc: '🟡 Hours per element → complete element spec with balances & formula', icon: Layers },
  { path: '/otl-schedule', label: 'OTL Work Schedule', desc: '🟡 Hours per rule set → Oracle Time & Labor config spec', icon: Clock },
  // Project delivery
  { path: '/kickoff-pack', label: 'Kickoff Pack Generator', desc: 'Generate complete first-week project pack — charter, RACI, milestones, risk register', icon: Package },
  { path: '/status-report', label: 'Status Report Generator', desc: 'Auto-generate weekly client status reports in minutes', icon: TrendingUp },
  { path: '/change-request', label: 'Change Request Generator', desc: 'Document scope changes formally — stop scope creep, protect revenue', icon: GitPullRequest },
  { path: '/sr-ticket', label: 'Oracle SR Ticket Writer', desc: '🔴 Good SRs resolved in days, bad ones take weeks — write perfect Oracle SRs', icon: Ticket },
  { path: '/security-role', label: 'HCM Security Role Designer', desc: 'Describe what a user should do → get Oracle Cloud security role matrix', icon: Shield },
  { path: '/integration-spec', label: 'Integration Spec Generator', desc: 'Describe an integration → get complete spec with field mappings & error handling', icon: Plug },
  { path: '/golive', label: 'Go-Live Checklist', desc: 'Generate detailed cutover & go-live runbook', icon: Rocket },
  { path: '/test-scripts', label: 'Test Script Generator', desc: 'Generate UAT & regression test scripts', icon: FlaskConical },
  { path: '/sow', label: 'SOW Generator', desc: 'Auto-draft statements of work', icon: ClipboardList },
  { path: '/training', label: 'Training Generator', desc: 'End-user training guides for any module & role', icon: GraduationCap },
  { path: '/migration', label: 'Migration Analyzer', desc: 'Assess ERP migration readiness', icon: ArrowRightLeft },
  { path: '/release-notes', label: 'Release Notes', desc: 'Analyze ERP release impact', icon: Newspaper },
  // Sales
  { path: '/proposal', label: 'Proposal Generator', desc: 'AI-crafted managed services proposals', icon: Send },
  { path: '/roi', label: 'ROI Calculator', desc: 'Calculate ERP implementation ROI', icon: Calculator },
  { path: '/battle-card', label: 'Battle Card Generator', desc: 'Competitive intel vs Accenture, Deloitte, etc.', icon: Swords },
  { path: '/ai-opportunity', label: 'Oracle AI Finder', desc: 'Map client pain points to Oracle AI Cloud products', icon: Sparkles },
  // General
  { path: '/', label: 'Dashboard', desc: 'Platform overview & metrics', icon: LayoutDashboard },
  { path: '/chatbot', label: 'ERP Chatbot', desc: 'JDE/Oracle Q&A in plain English', icon: MessageSquare },
  { path: '/sql', label: 'SQL Generator', desc: 'Natural language to Oracle SQL', icon: Database },
  { path: '/summarizer', label: 'Doc Summarizer', desc: 'SOW, RFP & manual summaries', icon: FileText },
  { path: '/meeting-notes', label: 'Meeting Notes', desc: 'Extract actions from transcripts + voice recording', icon: NotebookPen },
  { path: '/incident', label: 'Incident Report', desc: 'Draft incident reports fast', icon: AlertTriangle },
  { path: '/kb-article', label: 'KB Article Writer', desc: 'Turn incident resolutions into ServiceNow KB articles', icon: BookOpen },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const filtered = query.trim()
    ? items.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
      )
    : items

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => { setSelected(0) }, [query])

  function go(path: string) {
    navigate(path)
    onClose()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) go(filtered[selected].path)
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-bg-card border border-border-dim rounded-2xl shadow-card overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-dim">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search features..."
            className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="text-[10px] bg-bg-hover border border-border-dim rounded px-1.5 py-0.5 font-mono text-text-muted">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-8">No results for "{query}"</p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? 'bg-accent-cyan/10' : 'hover:bg-bg-hover'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    i === selected ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-bg-hover text-text-muted'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${i === selected ? 'text-accent-cyan' : 'text-text-primary'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border-dim px-4 py-2 flex gap-4 text-[10px] text-text-muted">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
