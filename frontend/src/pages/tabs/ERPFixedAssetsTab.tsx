import { useState } from "react";
import { generateERPFixedAssets } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "asset_category", label: "Asset Category Setup", desc: "Design asset categories with useful lives, depreciation methods, GL accounts, and capitalization thresholds" },
  { id: "depreciation", label: "Depreciation Rule Designer", desc: "Configure GAAP and tax depreciation books, MACRS, ASC 842 lease accounting" },
  { id: "migration", label: "Asset Migration Mapping", desc: "Map legacy fixed asset data to Oracle Cloud FA FBDI format with cleansing plan" },
  { id: "retirement", label: "Asset Retirement Workflow", desc: "Configure disposal types, gain/loss accounting, approval workflow, and mass retirement process" },
];

const DEFAULTS: Record<string, string> = {
  asset_category: "Manufacturing company with ~$85M total fixed assets. Asset mix: Buildings & improvements ($32M, 39-yr), Manufacturing equipment ($28M, 5-15yr), Computer hardware ($4M, 3-5yr), Software ($6M, 3-7yr), Furniture ($2M, 7yr), Vehicles ($3M, 5yr), Leasehold improvements ($6M, lease term), Land ($4M, non-dep). Capitalization threshold: $2,500 for all categories. Construction in Progress (CIP) for active capital projects.",
  depreciation: "GAAP books: straight-line for all categories, half-year convention. Tax books: MACRS for all US assets — equipment 7-yr (200DB switch to SL), computers 5-yr (200DB), buildings 39-yr (SL, mid-month). Need Section 179 immediate expensing for equipment under $25K (up to annual limit). Vehicle 179 limitation applies. Lease accounting: ASC 842 adopted — 12 operating leases (facilities) and 3 finance leases (manufacturing equipment). Short-term lease exemption for leases <12 months.",
  migration: "Migrating from legacy fixed asset system (Sage Fixed Assets). ~1,200 asset records. Data available: asset tag, description, category, acquisition date, cost, accumulated depreciation, NBV, department, location. Issues: 180 assets fully depreciated but still in service (need NBV adjustment), 45 disposed assets still active in legacy, inconsistent category codes across acquisitions. Target: migrate as-of March 31 (quarter-end). GAAP book only for initial migration; tax book to be set up separately.",
  retirement: "Need retirement workflow for: planned asset disposals (annual capital equipment review — ~50 retirements/year), facility closures (occasional — last one retired 200 assets), IT hardware refresh cycle (3-yr cycle, ~150 computer retirements/year). Sales to third parties require VP Finance approval. Scrapping under $5K can be done by department manager. All retirements over $25K require CFO approval. Physical verification required 30 days before retirement processing.",
};

export default function ERPFixedAssetsTab() {
  const [activeTool, setActiveTool] = useState("asset_category");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.asset_category);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateERPFixedAssets({ client_name: clientName, tool_type: activeTool, context, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fixed Assets</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud Fixed Assets — categories, depreciation, migration, and retirement workflows</p>
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
