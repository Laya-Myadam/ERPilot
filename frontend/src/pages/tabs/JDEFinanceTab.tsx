import { useState } from "react";
import { generateJDEFinance } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "gl_migration", label: "JDE Finance → Oracle GL Migration", desc: "Generate JDE F0902/F0911/F0901 to Oracle Cloud GL field mapping and migration approach" },
  { id: "coa_rationalization", label: "COA Rationalization", desc: "Plan account consolidation from bloated JDE COA to lean Oracle Cloud structure" },
  { id: "period_close", label: "Period Close Comparison", desc: "Compare JDE vs Oracle Cloud month-end close steps and build the Oracle close checklist" },
  { id: "bu_mapping", label: "BU → Legal Entity Mapping", desc: "Map JDE Company/Business Unit structure to Oracle Legal Entities and Business Units" },
];

const DEFAULTS: Record<string, string> = {
  gl_migration: "Migrating JDE 9.2 Finance (09) to Oracle Cloud ERP GL. JDE has 4 companies (CO 00001 Ohio, 00002 Texas, 00003 California, 00100 Canada). 12,000 account combinations active. F0902 balance migration as-of March 31 — AA ledger only (no budget ledger needed in Oracle initially). F0911 journal history: migrate last 3 years (2022-2024). Known issues: Company 00002 has 340 unposted batches from system outage in 2023 — must post or void before migration. Intercompany balances between entities must net to zero before migration.",
  coa_rationalization: "JDE COA has 12,000 unique account combinations across 4 companies. Analysis shows: 3,800 accounts have zero activity for 3+ years, 2,100 are duplicate object accounts set up differently per company, 1,500 are overly granular expense accounts (e.g., separate accounts for each type of office supply). Target: rationalize to ~3,000 accounts in Oracle. Oracle will use segments to replace JDE's object/subsidiary detail. Need mapping table: every JDE account → Oracle natural account + cost center segments. Must maintain historical reporting ability post-migration.",
  period_close: "Current JDE close takes 8 business days. Target: Oracle Cloud close in 5 business days. JDE close sequence: subledger recon → post unposted batches (P09800) → run balance integrity (R007031) → create period summary (R09803) → lock prior period → generate financial reports. Key concerns: (1) Oracle's subledger accounting (Create Accounting) is new concept for the team, (2) Oracle has stricter period control — once closed, can only reopen with approval, (3) intercompany elimination process is different in Oracle. Need side-by-side comparison and Oracle close checklist with owners and timing.",
  bu_mapping: "JDE has 1 company structure (CO 00001) with 28 business units representing departments, cost centers, and locations. BU types: Manufacturing (BU 100-199), Finance/Admin (200-299), Sales (300-399), IT (400-499), Canada operations (500-599). Oracle design question: should each JDE BU become an Oracle BU, or consolidate to fewer Oracle BUs with cost center segments? Shared services: AP and AR currently centralized in BU 200 (Finance) — want to maintain this in Oracle. Canada entity (BU 500-599) must be its own Oracle legal entity for tax/statutory reporting.",
};

export default function JDEFinanceTab() {
  const [activeTool, setActiveTool] = useState("gl_migration");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.gl_migration);
  const [jdeVersion, setJdeVersion] = useState("9.2");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateJDEFinance({ client_name: clientName, tool_type: activeTool, context, jde_version: jdeVersion });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">JDE Finance (09)</h1>
        <p className="text-zinc-400 mt-1">JDE Finance migration tools — GL mapping, COA rationalization, period close comparison, and org structure mapping</p>
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
              <option>9.2</option><option>9.1</option><option>9.0</option><option>8.12</option><option>World</option>
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
