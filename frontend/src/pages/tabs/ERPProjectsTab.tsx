import { useState } from "react";
import { generateERPProjects } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "project_type", label: "Project Type & Templates", desc: "Define project types, WBS templates, roles, and status workflows for each project category" },
  { id: "cost_collection", label: "Cost Collection Rules", desc: "Configure labor, expense, and material cost collection with burden/overhead schedules" },
  { id: "billing", label: "Billing Setup Guide", desc: "Set up T&M bill rates, fixed price milestones, cost-plus rules, and invoice generation" },
  { id: "budget", label: "Project Budget Config", desc: "Configure budget entry, approval workflow, EAC forecasting, and budget controls" },
];

const DEFAULTS: Record<string, string> = {
  project_type: "Acme Manufacturing runs 3 types of projects: (1) Customer Implementation Projects — T&M or fixed price, billable, 3-18 month duration, WBS: Initiation/Planning/Design/Build/Test/Deploy/Closeout; (2) Capital Projects (CAPEX) — internal, non-billable, must integrate with Fixed Assets for CIP; (3) Internal IT Projects — non-billable, budget-controlled, quarterly reporting. ~40 active projects at any time. Project Manager role required on all projects. Resource planning needed for consulting staff (utilization tracking).",
  cost_collection: "Labor: HCM Time & Labor integration — employees charge time to projects by task. Billing rates by job level (Analyst $125/hr, Senior $175/hr, Manager $225/hr, Director $300/hr). Fringe burden rate: 28% on labor. Overhead burden: 12% facility + 8% G&A = 20% total indirect. Non-labor: expense reports charged to projects (travel, materials). Supplier invoices allocated by PO line to project task. Capitalization rule: all labor and materials for capital projects >$25K useful life >1 year are capitalizable (ASC 350).",
  billing: "Customer project billing: T&M projects — monthly invoice (last business day), bill at standard rates, 10% retainage released at project completion. Fixed price — milestone-based: 20% on kickoff, 30% on design approval, 30% on UAT completion, 20% on go-live sign-off. Retainage: 10% held until 30 days post go-live. Credit memo process for disputed hours. Revenue recognition: T&M = recognize on time entry (earned as delivered). Fixed price = % complete (cost-to-cost method). Unbilled AR tracked for work performed but not yet invoiced.",
  budget: "Project budgets approved before project start. Budget entry at task level (WBS level 3). Labor budget in hours AND dollars. Budget versions: Original (board-approved) / Revised (requires PMO + Finance approval) / Forecast (monthly update by PM). Budget controls: soft warning at 80%, hard stop at 100% for non-labor costs. Labor can exceed with PM approval. EAC updated monthly: PM enters ETC (hours remaining), system calculates EAC = Actual + ETC. Variance report: Budget vs. Actual vs. EAC by task. PMO reviews any project with >10% negative variance.",
};

export default function ERPProjectsTab() {
  const [activeTool, setActiveTool] = useState("project_type");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.project_type);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateERPProjects({ client_name: clientName, tool_type: activeTool, context, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Costing</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud Project Management — project types, cost collection, billing rules, and budget controls</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => selectTool(t.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeTool === t.id ? "border-accent-purple/60 bg-accent-purple/10 text-accent-purple" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="card-glass rounded-xl p-6 space-y-4">
        <p className="text-xs text-zinc-500">{active.desc}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={clientName} onChange={e => setClientName(e.target.value)} />
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
        <button onClick={generate} disabled={loading || !context.trim()} className="w-full py-2.5 rounded-lg bg-accent-purple text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? `Generating ${active.label}...` : `Generate ${active.label}`}
        </button>
      </div>
      <OutputPanel content={result} loading={loading} placeholder={`Your ${active.label} configuration will appear here.`} />
    </div>
  );
}
