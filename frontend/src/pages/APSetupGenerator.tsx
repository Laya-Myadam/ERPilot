import { useState } from "react";
import { generateAPSetup } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function APSetupGenerator() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [invoiceVolumeMonthly, setInvoiceVolumeMonthly] = useState("~1,200 invoices/month: 800 PO-matched (materials/components), 400 non-PO (utilities, professional services, facilities)");
  const [invoiceTypes, setInvoiceTypes] = useState("Standard Invoice, Credit Memo, Debit Memo, Prepayment, Recurring (rent/leases)");
  const [paymentMethods, setPaymentMethods] = useState("ACH (65% of payments), Check (20%), Wire Transfer (10%, international only), Virtual Card (5%)");
  const [approvalLevels, setApprovalLevels] = useState("Auto-approve: PO-matched invoices within 5% tolerance. Manual: $0–$10K → Department Manager, $10K–$50K → Director, $50K–$200K → VP Finance, >$200K → CFO");
  const [poMatchingRequired, setPoMatchingRequired] = useState(true);
  const [threeWayMatch, setThreeWayMatch] = useState(true);
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => {
    setClientName("Acme Manufacturing Inc."); setLegislation("US");
    setInvoiceVolumeMonthly("~1,200 invoices/month: 800 PO-matched (materials/components), 400 non-PO (utilities, professional services, facilities)");
    setInvoiceTypes("Standard Invoice, Credit Memo, Debit Memo, Prepayment, Recurring (rent/leases)");
    setPaymentMethods("ACH (65% of payments), Check (20%), Wire Transfer (10%, international only), Virtual Card (5%)");
    setApprovalLevels("Auto-approve: PO-matched invoices within 5% tolerance. Manual: $0–$10K → Department Manager, $10K–$50K → Director, $50K–$200K → VP Finance, >$200K → CFO");
    setPoMatchingRequired(true); setThreeWayMatch(true);
  };

  const generate = async () => {
    if (!clientName.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateAPSetup({
        client_name: clientName, invoice_volume_monthly: invoiceVolumeMonthly,
        invoice_types: invoiceTypes, payment_methods: paymentMethods,
        approval_levels: approvalLevels, po_matching_required: poMatchingRequired,
        three_way_match: threeWayMatch, legislation,
      });
      setResult(data.setup);
    } catch { setResult("Error generating AP setup. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounts Payable Setup Generator</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud AP — invoice processing, approval workflows, PO matching rules, payment setup, and supplier configuration</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={legislation} onChange={e => setLegislation(e.target.value)}>
              <option>US</option><option>Canada</option><option>UK</option><option>Australia</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Monthly Invoice Volume & Mix</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={invoiceVolumeMonthly} onChange={e => setInvoiceVolumeMonthly(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Invoice Types</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={invoiceTypes} onChange={e => setInvoiceTypes(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Methods</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={paymentMethods} onChange={e => setPaymentMethods(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Approval Thresholds</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={approvalLevels} onChange={e => setApprovalLevels(e.target.value)} />
        </div>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={poMatchingRequired} onChange={e => setPoMatchingRequired(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
            PO Matching Required
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={threeWayMatch} onChange={e => setThreeWayMatch(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
            3-Way Match (PO + Receipt + Invoice)
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={loadSample} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition">Load Sample</button>
          <button onClick={generate} disabled={loading || !clientName.trim()}
            className="flex-1 py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
            {loading ? "Generating AP Setup Guide..." : "Generate Accounts Payable Configuration"}
          </button>
        </div>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your AP configuration spec will appear here — invoice setup, approval workflows, PO matching rules, payment configuration, supplier requirements, and test scenarios." />
    </div>
  );
}
