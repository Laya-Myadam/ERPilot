import { useState } from "react";
import { generateERPCash } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "bank_recon", label: "Bank Reconciliation Config", desc: "Set up bank statement import formats, auto-matching rules, tolerances, and exception handling" },
  { id: "forecasting", label: "Cash Forecasting Setup", desc: "Configure rolling cash forecasts, liquidity alerts, and treasury reporting" },
  { id: "bank_account", label: "Bank Account Setup", desc: "Complete bank account setup checklist — accounts, payment formats, signatories, and controls" },
  { id: "netting", label: "Netting Setup Designer", desc: "Configure intercompany netting agreements, settlement rules, and FX handling" },
];

const DEFAULTS: Record<string, string> = {
  bank_recon: "4 operating bank accounts (Ohio, Texas, California, Canada) + 1 payroll account (Ohio) + 1 concentration account. Banks: JP Morgan Chase (US), RBC (Canada). Statement format: BAI2 for Chase, MT940 for RBC. Daily auto-import via bank SFTP. Matching rules: exact match on check number + amount, ACH match on company ID + amount, wire match on reference + amount ±$0.01. Tolerance: $0.05 for rounding differences. Monthly reconciliation must be completed by business day 5. Controller reviews and approves.",
  forecasting: "13-week rolling cash forecast, updated every Monday by 9am. Data sources: AR aging (expected receipts by week), AP payment schedule (open invoices by due date), payroll dates (bi-weekly, known amounts), debt service (fixed schedule), capital expenditure plan (from project module). Minimum cash balance policy: $2M USD across all accounts. Alert when projected balance falls below $3M (buffer). Short-term investment: excess cash >$5M in operating account invested in money market. Credit line: $10M revolving — alert when forecast requires draw.",
  bank_account: "5 bank accounts to set up in Oracle: (1) Chase Operating - Ohio, USD, checking, general disbursements; (2) Chase Operating - Texas, USD, checking; (3) Chase Operating - California, USD, checking; (4) Chase Payroll - Ohio, USD, dedicated payroll; (5) RBC Operating - Canada, CAD, checking. Payment formats needed: NACHA ACH for US payments, Positive Pay file to Chase (daily), Wire format for international. Dual control: any wire >$100K requires 2 approvers. User access: AP team for US accounts, Canada controller for RBC.",
  netting: "3 US legal entities regularly have intercompany balances. Monthly netting on last business day of month. Entities: Acme Ohio (parent), Acme Texas (sub), Acme California (sub). Typical netting: Texas owes Ohio ~$180K for shared services, California owes Ohio ~$95K, California owes Texas ~$12K for parts transfers. Settlement currency: USD. Minimum net amount to settle: $1,000 (ignore smaller balances). AP/AR netting — offset payables against receivables per entity pair. Treasury approves netting proposal by day 25, settlement processed day 28-29.",
};

export default function ERPCashTab() {
  const [activeTool, setActiveTool] = useState("bank_recon");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.bank_recon);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateERPCash({ client_name: clientName, tool_type: activeTool, context, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cash Management</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud Cash Management — bank reconciliation, cash forecasting, bank accounts, and intercompany netting</p>
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
