import { useState } from "react";
import { generateSRTicket } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const PRODUCTS = ["Oracle Cloud HCM", "Oracle Cloud Payroll", "Oracle Cloud ERP", "Oracle Cloud SCM", "JD Edwards EnterpriseOne", "Oracle Integration Cloud", "Oracle Analytics Cloud"];
const MODULES = ["Core HCM", "Payroll", "Absence Management", "Time and Labor", "Benefits", "Recruiting", "General Ledger", "Accounts Payable", "Procurement", "Order Management"];
const SEVERITIES = [
  { value: "1-Critical", label: "Sev 1 — Critical (System down, no workaround)", color: "border-red-500 bg-red-500/10 text-red-400" },
  { value: "2-High", label: "Sev 2 — High (Major function broken)", color: "border-orange-500 bg-orange-500/10 text-orange-400" },
  { value: "3-Medium", label: "Sev 3 — Medium (Function impaired)", color: "border-yellow-500 bg-yellow-500/10 text-yellow-400" },
  { value: "4-Low", label: "Sev 4 — Low (Minor issue)", color: "border-zinc-500 bg-zinc-700 text-zinc-300" },
];

export default function SRTicketWriter() {
  const [product, setProduct] = useState("Oracle Cloud Payroll");
  const [module, setModule] = useState("Payroll");
  const [severity, setSeverity] = useState("2-High");
  const [environment, setEnvironment] = useState("Production");
  const [problemSummary, setProblemSummary] = useState("Payroll calculation producing incorrect overtime amounts for California employees — system calculating OT at 1.5x after 40 weekly hours but not applying daily OT (1.5x after 8 hours/day) as required by California law");
  const [stepsToReproduce, setStepsToReproduce] = useState("1. Log in as Payroll Manager\n2. Run Quick Pay for any California hourly employee (e.g., Person #100345)\n3. Employee worked: Mon 10hrs, Tue 10hrs, Wed 8hrs, Thu 8hrs, Fri 4hrs (total 40 hrs)\n4. Review payroll run results — Statement of Earnings\n5. Observe: No daily OT calculated for Mon and Tue despite 10-hr workday");
  const [expectedBehavior, setExpectedBehavior] = useState("California employees should receive OT (1.5x) for any hours worked beyond 8 in a single day, regardless of weekly total. Mon and Tue should show 2 OT hours each = 4 total daily OT hours.");
  const [actualBehavior, setActualBehavior] = useState("System only calculates weekly OT (FLSA method). No daily OT is being calculated. California employees on a 4x10 schedule receive no overtime despite working 10-hour days.");
  const [errorMessages, setErrorMessages] = useState("No error message displayed. Incorrect calculation is silent — only detected by reviewing pay stub.");
  const [workaroundTried, setWorkaroundTried] = useState("Manually adjusting element entries for affected employees — not scalable for 180 CA employees. Reviewed fast formula CALC_OVERTIME — daily OT logic appears to be missing for CA legislative data group.");
  const [businessImpact, setBusinessImpact] = useState("180 California employees underpaid for OT. April 15 payroll go-live at risk. Potential wage theft liability under California Labor Code. Estimated underpayment: ~$45,000 per biweekly period.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!problemSummary.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateSRTicket({
        product, module, severity, environment,
        problem_summary: problemSummary, steps_to_reproduce: stepsToReproduce,
        expected_behavior: expectedBehavior, actual_behavior: actualBehavior,
        error_messages: errorMessages, workaround_tried: workaroundTried, business_impact: businessImpact,
      });
      setResult(data.ticket);
    } catch { setResult("Error generating SR. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Oracle SR Ticket Writer</h1>
        <p className="text-zinc-400 mt-1">Generate a perfectly structured Oracle Support Request — good SRs get resolved in days, bad ones take weeks</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {SEVERITIES.map(s => (
            <button key={s.value} onClick={() => setSeverity(s.value)}
              className={`py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all text-center leading-tight ${severity === s.value ? s.color : "border-zinc-700 bg-zinc-800 text-zinc-400"}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Product</label>
            <select value={product} onChange={e => setProduct(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Module</label>
            <select value={module} onChange={e => setModule(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Environment</label>
            <select value={environment} onChange={e => setEnvironment(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option>Production</option><option>Test / UAT</option><option>Development</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Problem Summary <span className="text-red-400">*</span></label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={problemSummary} onChange={e => setProblemSummary(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Steps to Reproduce</label>
            <textarea rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={stepsToReproduce} onChange={e => setStepsToReproduce(e.target.value)} />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Expected Behavior</label>
              <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
                value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Actual Behavior</label>
              <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
                value={actualBehavior} onChange={e => setActualBehavior(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Error Messages</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={errorMessages} onChange={e => setErrorMessages(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Workarounds Tried</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={workaroundTried} onChange={e => setWorkaroundTried(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Business Impact</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={businessImpact} onChange={e => setBusinessImpact(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !problemSummary.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Writing SR Ticket..." : "Generate Oracle SR Ticket"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your structured Oracle SR will appear here — ready to paste into Oracle Support portal for fastest resolution." />
    </div>
  );
}
