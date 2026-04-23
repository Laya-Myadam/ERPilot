import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, FileText, Newspaper, ClipboardList,
  NotebookPen, ArrowRightLeft, AlertTriangle, Database, Send, Calculator,
  Zap, LogOut, ChevronRight, FlaskConical, GraduationCap, Sparkles, Rocket,
  BookOpen, Swords, TrendingUp, Ticket, GitPullRequest, Shield, Plug, Package,
  Users, DollarSign, Factory
} from 'lucide-react'

const navGroups = [
  {
    label: "ERP Modules",
    items: [
      { path: '/hcm', label: 'Oracle Cloud HCM', icon: Users },
      { path: '/erp', label: 'Oracle Cloud ERP', icon: DollarSign },
      { path: '/jde', label: 'JD Edwards (JDE)', icon: Factory },
    ]
  },
  {
    label: "Project Delivery",
    items: [
      { path: '/kickoff-pack', label: 'Kickoff Pack Gen', icon: Package },
      { path: '/status-report', label: 'Status Report Gen', icon: TrendingUp },
      { path: '/change-request', label: 'Change Request Gen', icon: GitPullRequest },
      { path: '/sr-ticket', label: 'Oracle SR Ticket', icon: Ticket },
      { path: '/security-role', label: 'Security Role Designer', icon: Shield },
      { path: '/integration-spec', label: 'Integration Spec Gen', icon: Plug },
      { path: '/golive', label: 'Go-Live Checklist', icon: Rocket },
      { path: '/test-scripts', label: 'Test Scripts', icon: FlaskConical },
      { path: '/sow', label: 'SOW Generator', icon: ClipboardList },
      { path: '/training', label: 'Training Generator', icon: GraduationCap },
      { path: '/migration', label: 'Migration Analyzer', icon: ArrowRightLeft },
      { path: '/release-notes', label: 'Release Notes', icon: Newspaper },
    ]
  },
  {
    label: "Sales & Proposals",
    items: [
      { path: '/proposal', label: 'Proposal Generator', icon: Send },
      { path: '/roi', label: 'ROI Calculator', icon: Calculator },
      { path: '/battle-card', label: 'Battle Card Gen', icon: Swords },
      { path: '/ai-opportunity', label: 'Oracle AI Finder', icon: Sparkles },
    ]
  },
  {
    label: "General Tools",
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/chatbot', label: 'ERP Chatbot', icon: MessageSquare },
      { path: '/sql', label: 'SQL Generator', icon: Database },
      { path: '/summarizer', label: 'Doc Summarizer', icon: FileText },
      { path: '/meeting-notes', label: 'Meeting Notes', icon: NotebookPen },
      { path: '/incident', label: 'Incident Report', icon: AlertTriangle },
      { path: '/kb-article', label: 'KB Article Writer', icon: BookOpen },
    ]
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-60 min-h-screen bg-bg-secondary flex flex-col border-r border-border-dim relative">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent-cyan/30 to-transparent" />

      {/* Logo */}
      <div className="px-5 py-6 border-b border-border-dim">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/25 flex items-center justify-center shadow-glow-cyan">
            <Zap className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">Denovo AI</p>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium">Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 mb-1.5 font-medium">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-glow-cyan'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-cyan rounded-r shadow-glow-cyan" />
                    )}
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-all ${active ? 'text-accent-cyan' : 'group-hover:text-accent-cyan/70'}`} />
                    <span className="truncate text-xs">{label}</span>
                    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border-dim">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-hover cursor-pointer transition-all group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-purple/30 border border-border-dim flex items-center justify-center text-xs font-bold text-text-primary">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">Denovo Consultant</p>
            <p className="text-[10px] text-text-muted truncate">Oracle ERP Expert</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-red transition-colors" />
        </div>
      </div>
    </aside>
  )
}
