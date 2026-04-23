import { useEffect, useState } from 'react'
import { Bell, Search, Wifi } from 'lucide-react'
import CommandPalette from './CommandPalette'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="h-16 border-b border-border-dim bg-bg-secondary/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-bg-card border border-border-dim rounded-lg px-3 py-1.5 text-sm text-text-muted hover:border-accent-cyan/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="text-[10px] bg-bg-hover border border-border-dim rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </button>
          <div className="flex items-center gap-1.5 text-accent-green text-xs font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span>Live</span>
          </div>
          <button className="relative w-8 h-8 rounded-lg bg-bg-card border border-border-dim flex items-center justify-center hover:border-accent-cyan/30 transition-colors">
            <Bell className="w-4 h-4 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 border border-accent-cyan/20 flex items-center justify-center text-xs font-bold text-accent-cyan">
            AI
          </div>
        </div>
      </header>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  )
}
