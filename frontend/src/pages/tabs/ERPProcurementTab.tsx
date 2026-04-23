import { useState } from "react";
import { generateERPProcurement } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "policy", label: "Procurement Policy Designer", desc: "Define purchasing policies, authorization thresholds, sourcing requirements, and category rules" },
  { id: "approval_hierarchy", label: "Approval Hierarchy Builder", desc: "Design PO and requisition approval chains with amount-based routing and delegation rules" },
  { id: "supplier_qual", label: "Supplier Qualification", desc: "Configure supplier onboarding, qualification criteria, risk assessment, and performance scorecard" },
  { id: "contract_mgmt", label: "Contract Management Setup", desc: "Set up contract templates, clause library, renewal alerts, and compliance monitoring" },
];

const DEFAULTS: Record<string, string> = {
  policy: "Procurement policy for Acme Manufacturing: 3 US entities + 1 Canada entity. PO types needed: Standard PO, Blanket Purchase Agreement (for recurring suppliers), Subcontract PO. Requisition types: Purchase and Internal Transfer. Competitive quote rules: 1 quote <$2,500, 2 quotes $2,500-$10K, 3 quotes >$10K (written). Sole source justification required for single-supplier purchases over $10K. Preferred supplier list: 45 vendors — POs auto-approved up to $25K. IT purchases require IT Director approval regardless of amount. Capital items >$25K require CFO approval and Fixed Assets team notification.",
  approval_hierarchy: "Approval hierarchy based on PO total amount: <$2,500 = Department Manager auto-approve, $2,500-$10K = Department Manager, $10K-$50K = Department Manager + Director, $50K-$200K = Director + VP Finance, >$200K = VP Finance + CFO. Blanket POs: same hierarchy as standard but requires quarterly review by Finance. Requisitions: same hierarchy, budget check runs before routing. Delegation: managers can delegate to named backup during vacation (max 2 weeks, max own authority level). Auto-approve: any PO against active BPA with remaining funds, amount <$50K.",
  supplier_qual: "500+ active suppliers. Categories: Raw Materials (steel, components — 120 suppliers), MRO/Facilities (80 suppliers), IT/Technology (45 suppliers), Professional Services (60 suppliers), Logistics/Freight (30 suppliers), Other (200+ suppliers). Qualification required for: Raw Materials >$100K annual spend, all IT vendors, all professional services. Required docs: Certificate of Insurance ($2M general liability minimum), W-9, Quality cert (ISO 9001 preferred for production suppliers). Annual re-qualification for strategic suppliers (top 50 by spend). Supplier risk rating: assess financial stability, geographic concentration, single-source risk.",
  contract_mgmt: "Contract management for ~150 active supplier contracts. Contract types: Annual supply agreements (raw materials), Master Service Agreements (professional services, IT), Equipment maintenance contracts, Logistics/carrier agreements, Lease agreements (equipment). Key needs: automatic renewal alerts at 180/90/30 days. Contract spend tracking vs. committed amount. Legal review required for contracts >$100K or any non-standard terms. Price escalation clauses tracked automatically. Integration with POs — all POs over $50K should reference a contract. Blanket PO releases linked to BPA contracts.",
};

export default function ERPProcurementTab() {
  const [activeTool, setActiveTool] = useState("policy");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.policy);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateERPProcurement({ client_name: clientName, tool_type: activeTool, context, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Procurement</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud Procurement — policies, approval hierarchies, supplier qualification, and contract management</p>
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
