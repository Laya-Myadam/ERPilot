import { useState } from "react";
import { generateERPAR } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "ar_setup", label: "AR Process Setup", desc: "Configure Oracle Cloud AR — invoice types, payment terms, receipt processing, and customer setup" },
  { id: "credit_policy", label: "Customer Credit Policy", desc: "Design credit limits, credit holds, dunning, and credit review workflow" },
  { id: "collections", label: "Collections Workflow", desc: "Configure aging buckets, collector assignment, dunning sequences, and payment plans" },
  { id: "revenue_recognition", label: "Revenue Recognition", desc: "Set up ASC 606 / IFRS 15 performance obligations, SSP allocation, and recognition schedules" },
];

const DEFAULTS: Record<string, string> = {
  ar_setup: "Oracle Cloud AR for Acme Manufacturing. ~800 customer invoices/month: product sales (Net 30), service contracts (monthly recurring), custom orders (milestone billing). Receipt methods: ACH lockbox (60%), wire transfer (25%), check (15%). Auto-cash application using bank reference numbers. Customer hierarchy: parent companies with multiple bill-to and ship-to sites. Tax: US sales tax exempt (manufacturing exemption), Canadian GST/PST for Canada entity.",
  credit_policy: "Credit policy for ~950 active customer accounts. Customer tiers: Strategic (>$2M/yr spend, no credit limit), Preferred ($500K-$2M, $500K limit), Standard ($100K-$500K, $150K limit), New/Small (<$100K, $25K limit). Credit hold trigger: any invoice 45+ days past due OR total overdue balance >50% of credit limit. Credit review annually for all accounts >$100K, triggered immediately on 2 late payments in 90 days. New customer: 2 trade references + D&B check required.",
  collections: "Collections for B2B manufacturing customers. Aging: Current, 1-30, 31-60, 61-90, 90+. 3 collectors by territory: Midwest (Ohio), South (Texas), West (California/other). Dunning sequence: Day 15 past due = friendly email reminder, Day 30 = formal letter, Day 45 = phone call required + management escalation, Day 60 = hold all new orders + legal review, Day 90 = write-off recommendation. Payment arrangement allowed for Strategic customers only, max 90-day plan.",
  revenue_recognition: "Manufacturing company with 3 revenue streams: (1) Product sales — point-in-time on shipment, straightforward. (2) Annual maintenance contracts — ratable over contract term (1-3 years). (3) Implementation services bundled with product — multi-element arrangement: separate SSP for product and services, allocate discount proportionally. Variable consideration: volume rebates (10-15% for top customers, estimated quarterly). ASC 606 adoption already complete — need Oracle Cloud Revenue Management configuration.",
};

export default function ERPARTab() {
  const [activeTool, setActiveTool] = useState("ar_setup");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.ar_setup);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateERPAR({ client_name: clientName, tool_type: activeTool, context, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounts Receivable</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud AR — invoice processing, credit management, collections, and revenue recognition</p>
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
