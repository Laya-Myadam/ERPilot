import { useState } from "react";
import { generateHCMWorkforce } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "scheduling", label: "Scheduling Rule Designer", desc: "Design shift types, coverage rules, and schedule generation constraints" },
  { id: "forecast", label: "Labor Demand Forecast", desc: "Configure volume-driver forecasting, cash position, and budget alignment" },
  { id: "compliance", label: "WFM Compliance Checklist", desc: "Configure FLSA, state-specific OT rules, mandatory breaks, and union scheduling compliance" },
  { id: "shift_pattern", label: "Shift Pattern Generator", desc: "Generate 4x10, 12-hour rotating, split-shift patterns with differential pay rules" },
];

const DEFAULTS: Record<string, string> = {
  scheduling: "Manufacturing facility in Ohio with 3 production lines running 24/7. Shifts: Day (6am-2pm), Swing (2pm-10pm), Night (10pm-6am). 8-hour shifts with 30-min unpaid lunch. 4x10 available for maintenance crew (Mon-Thu, 6am-4:30pm). Minimum crew: 12 operators per line per shift. 8-hr rest between shifts mandatory. Weekend premium: 15% differential Saturday, 20% Sunday. Union CBA requires seniority-based shift preference bidding quarterly.",
  forecast: "Manufacturing operations: volume driver = production units planned per day (from MRP). Historical window: 18 months. Forecast horizon: 13 weeks rolling, updated weekly every Monday. Staffing ratio: 1 operator per 45 units/hour for Line 1, 1 per 60 for Line 2. Seasonality: Q4 production peaks 40% above baseline. Budget: approved headcount = 185 production staff. Alert when forecast exceeds budget by 10%.",
  compliance: "US manufacturing employer. Ohio headquarters + Texas and California locations. California employees: strict daily OT (1.5x after 8 hrs/day, 2x after 12), 7th consecutive day rules, mandatory 30-min meal break before 5th hour, 10-min rest per 4 hours worked. Ohio: FLSA weekly OT only. Texas: FLSA. Ohio union employees: CBA rules on scheduling — 5-day advance notice for schedule changes, 4 hours pay if shift cancelled within 24 hrs.",
  shift_pattern: "Need patterns for: Production operators (3-shift 24/7, rotating), Maintenance crew (4x10 Mon-Thu), QA inspectors (day shift + limited swing coverage), Warehouse (day + swing, 5-day), Administrative (standard Mon-Fri 8am-5pm), Security (12-hour rotating, Panama schedule). Include weekend rotation fairness rules and holiday handling for all patterns.",
};

export default function HCMWorkforceTab() {
  const [activeTool, setActiveTool] = useState("scheduling");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.scheduling);
  const [industry, setIndustry] = useState("Manufacturing");
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateHCMWorkforce({ client_name: clientName, tool_type: activeTool, context, industry, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Workforce Management</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle WFM — scheduling rules, labor forecasting, compliance, and shift patterns</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => selectTool(t.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeTool === t.id ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="card-glass rounded-xl p-6 space-y-4">
        <p className="text-xs text-zinc-500">{active.desc}</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Industry</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={legislation} onChange={e => setLegislation(e.target.value)}>
              <option>US</option><option>Canada</option><option>UK</option><option>Australia</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Requirements & Context <span className="text-red-400">*</span></label>
          <textarea rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none" value={context} onChange={e => setContext(e.target.value)} />
        </div>
        <button onClick={generate} disabled={loading || !context.trim()} className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? `Generating ${active.label}...` : `Generate ${active.label}`}
        </button>
      </div>
      <OutputPanel content={result} loading={loading} placeholder={`Your ${active.label} configuration will appear here.`} />
    </div>
  );
}
