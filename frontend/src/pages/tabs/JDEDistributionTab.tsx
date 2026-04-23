import { useState } from "react";
import { generateJDEDistribution } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "item_master", label: "Item Master Migration (F4101)", desc: "Map JDE F4101/F4102 item master fields to Oracle Cloud Inventory FBDI with cleansing plan" },
  { id: "supplier_customer", label: "Supplier/Customer Master", desc: "Clean and migrate JDE address book (F0101) suppliers and customers to Oracle Cloud" },
  { id: "open_orders", label: "Open PO / Sales Order Migration", desc: "Migrate open JDE F4311 purchase orders and F4211 sales orders to Oracle Cloud" },
  { id: "branch_plant", label: "Branch/Plant → Org Mapping", desc: "Map JDE Branch/Plants (F41001) to Oracle Cloud Inventory Organizations and Business Units" },
];

const DEFAULTS: Record<string, string> = {
  item_master: "JDE F4101 item master: 8,500 items total. Active items (transactions in last 2 years): ~4,200. Item types: Finished Goods (1,200), Raw Materials (1,800), MRO/Supplies (800), Purchased Components (400). Stocking types: S (Stocked), N (Non-stocked), K (Kit). Branch/plant items (F4102): 3 branches × ~4,200 items = ~12,600 branch records. Issues: duplicate items from 2018 acquisition (400 items with AITM conflicts), 3,200 items have missing GLPT (GL class code — required for Oracle costing), UOM inconsistencies (some items in EA, LB, FT — need standardization).",
  supplier_customer: "JDE address book (F0101): 28,000 total records. Suppliers (type V): 2,100 records, ~500 active. Customers (type C): 4,800 records, ~950 active. Known data quality issues: 340 duplicate supplier records from acquisitions (same vendor, multiple AN8 numbers), 180 suppliers missing tax ID (needed for 1099 reporting), 620 customer records with incomplete ship-to addresses, 1,200 inactive customers (no AR activity in 3+ years — exclude or archive?). JDE payment terms in F0014 must map to Oracle payment terms. JDE currency codes map to ISO codes in Oracle.",
  open_orders: "Open POs (F4311): ~380 open POs, 1,200 open lines. PO types: OP (Standard) 290, OB (Blanket) 45, OS (Subcontract) 45. Open SO (F4211/F4201): ~520 open orders, 2,800 lines. Partial shipments: 180 orders partially shipped. Decision needed: orders in Pick/Pack status — complete in JDE before cutover or migrate? JDE open order value: POs ~$4.2M, SOs ~$6.8M — must reconcile to Oracle post-migration. Data freeze date: no new JDE orders after noon on cutover Friday. Any orders entered during weekend = manually enter in Oracle on Monday.",
  branch_plant: "JDE has 6 branch/plants: M30 (Ohio Mfg), M31 (Ohio Warehouse), M50 (Texas Mfg), M51 (Texas Warehouse), M60 (California Distribution), C01 (Canada). Each branch/plant has its own item costs, on-hand inventory, and location codes. Oracle design: M30/M31 → 2 separate Oracle Inventory Orgs under Ohio Legal Entity, M50/M51 → 2 orgs under Texas, M60 → 1 org under California, C01 → 1 org under Canada entity. Costing method: Weighted Average Cost for all orgs. Subinventory design: each JDE location type (Raw, WIP, Finished, Rejected) becomes a subinventory.",
};

export default function JDEDistributionTab() {
  const [activeTool, setActiveTool] = useState("item_master");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.item_master);
  const [jdeVersion, setJdeVersion] = useState("9.2");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateJDEDistribution({ client_name: clientName, tool_type: activeTool, context, jde_version: jdeVersion });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">JDE Distribution (41–43)</h1>
        <p className="text-zinc-400 mt-1">JDE Distribution migration tools — item master, supplier/customer, open orders, and branch/plant mapping</p>
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
