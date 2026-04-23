import { useState } from "react";
import { generateJDEManufacturing } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "bom_routing", label: "BOM / Routing Migration", desc: "Map JDE F3002 Bill of Materials and F3003 Routing Master to Oracle Cloud Manufacturing FBDI" },
  { id: "work_orders", label: "Work Order Migration (F4801)", desc: "Migrate open JDE work orders with WIP balances, completions, and component demand" },
  { id: "scm_mapping", label: "JDE → Oracle SCM Module Map", desc: "Compare JDE Manufacturing modules to Oracle Cloud SCM equivalents with gap analysis" },
  { id: "shop_floor", label: "Shop Floor Control Migration", desc: "Migrate JDE Shop Floor Control to Oracle Cloud Work Execution — dispatch, labor, completions" },
];

const DEFAULTS: Record<string, string> = {
  bom_routing: "JDE PDM module: 4,200 active BOMs (BOM type 01 — Manufacturing). Average 12 components per BOM, max 65. Phantom assemblies: 280. Routings (F3003): 3,800 active routings. Work centers: 24 (12 machining, 8 assembly, 4 finishing). BOM depth: max 6 levels. Data quality issues: 340 BOMs have component items that are inactive in F4101, 180 routings have zero setup/run times (need review before migration), 90 BOMs use substitute components (F3009) — need handling. Plan: migrate Engineering BOMs (type 00) as reference only, Production BOMs (type 01) as active manufacturing BOMs.",
  work_orders: "Open JDE work orders (F4801): 420 open WOs across 6 branch/plants. Status breakdown: 10 (Entered) = 45 WOs, 20 (Approved) = 80 WOs, 30 (Parts Requested) = 120 WOs, 40 (Parts Issued) = 95 WOs, 60 (In Production) = 80 WOs. Decision: complete all WOs in status 10-30 in JDE before cutover (155 WOs). Migrate WOs in status 40-60 (175 WOs) as open in Oracle. WIP inventory value to migrate: ~$1.2M across all open WOs. Component demand (F3111): 890 open component lines for status 40-60 WOs.",
  scm_mapping: "Acme uses JDE 9.2 manufacturing modules: Product Data Management (PDM) for BOMs/routings, Shop Floor Control (SFC) for WO execution and labor, Requirements Planning (RP/MPS/MRP) for planning, Cost Management for standard costing, Quality Management for inspection and NCR. Migrating to Oracle Cloud Manufacturing, Oracle Supply Planning, Oracle Cost Management, Oracle Quality Management. Key gaps to assess: JDE's Configurator (custom product configs) — does Oracle Cloud Manufacturing have equivalent? JDE's Work Order Variance reporting — Oracle equivalent? JDE's Shop Scheduling (finite capacity) — Oracle coverage?",
  shop_floor: "JDE Shop Floor Control used by 185 production employees across 3 shifts. Current process: WO printed and given to operator, operator enters completions and labor via terminal (P31114), move transactions entered by supervisor (P3112). Target Oracle Work Execution process on tablet/mobile. Key JDE capabilities to replace: dispatch list by work center, WO traveler document, labor entry by employee + operation, partial completions with scrap reporting, move between operations. Training challenge: shop floor employees unfamiliar with tablets — need simple touch UI. Union requirement: labor entry must remain individual (no group entry).",
};

export default function JDEManufacturingTab() {
  const [activeTool, setActiveTool] = useState("bom_routing");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.bom_routing);
  const [jdeVersion, setJdeVersion] = useState("9.2");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateJDEManufacturing({ client_name: clientName, tool_type: activeTool, context, jde_version: jdeVersion });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">JDE Manufacturing (30–40)</h1>
        <p className="text-zinc-400 mt-1">JDE Manufacturing migration tools — BOM/routing, work orders, SCM module mapping, and shop floor control</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => selectTool(t.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeTool === t.id ? "border-amber-500/60 bg-amber-500/10 text-amber-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"}`}>
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
            <label className="block text-sm font-medium text-zinc-300 mb-1">JDE Version</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={jdeVersion} onChange={e => setJdeVersion(e.target.value)}>
              <option>9.2</option><option>9.1</option><option>9.0</option><option>8.12</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Requirements & Context <span className="text-red-400">*</span></label>
          <textarea rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none" value={context} onChange={e => setContext(e.target.value)} />
        </div>
        <button onClick={generate} disabled={loading || !context.trim()} className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? `Generating ${active.label}...` : `Generate ${active.label}`}
        </button>
      </div>
      <OutputPanel content={result} loading={loading} placeholder={`Your ${active.label} output will appear here.`} />
    </div>
  );
}
