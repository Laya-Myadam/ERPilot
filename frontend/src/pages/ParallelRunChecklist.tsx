import { useState } from "react";
import { generateParallelRunChecklist } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function ParallelRunChecklist() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [payrollName, setPayrollName] = useState("US Biweekly Hourly Payroll");
  const [runNumber, setRunNumber] = useState("1");
  const [payPeriod, setPayPeriod] = useState("April 1–15, 2025");
  const [legacySystem, setLegacySystem] = useState("ADP Workforce Now");
  const [employeeCount, setEmployeeCount] = useState("850");
  const [modules, setModules] = useState("Payroll, Absence, OTL");
  const [specialFocus, setSpecialFocus] = useState("Union employees in Ohio plants have CBA-specific rates and premiums. California employees have daily overtime rules. One retroactive pay adjustment for a March 1 rate change affects 45 employees.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    try {
      const data = await generateParallelRunChecklist({
        client_name: clientName,
        payroll_name: payrollName,
        parallel_run_number: runNumber,
        pay_period: payPeriod,
        legacy_system: legacySystem,
        employee_count: employeeCount,
        modules,
        special_focus: specialFocus,
      });
      setResult(data.checklist);
    } catch {
      setResult("Error generating checklist. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Parallel Run Checklist</h1>
        <p className="text-zinc-400 mt-1">Generate a comprehensive payroll parallel run validation guide — gross pay, net pay, taxes, deductions, headcount reconciliation, and sign-off criteria</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Payroll Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. US Biweekly Hourly Payroll" value={payrollName} onChange={e => setPayrollName(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Parallel Run Number</label>
            <select value={runNumber} onChange={e => setRunNumber(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option value="1">1st Parallel Run</option>
              <option value="2">2nd Parallel Run</option>
              <option value="3">3rd Parallel Run</option>
              <option value="Mock">Mock Run (Pre-Parallel)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Pay Period</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. April 1–15, 2025" value={payPeriod} onChange={e => setPayPeriod(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count (approx.)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. 850" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legacy System Being Replaced</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. ADP Workforce Now, Ceridian Dayforce, PeopleSoft" value={legacySystem} onChange={e => setLegacySystem(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Modules Running in Parallel</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Payroll, Absence, OTL" value={modules} onChange={e => setModules(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Special Focus Areas (optional)</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Pay special attention to union employees on CBA rates, retroactive pay from Q1, California-specific overtime rules, and garnishment calculations"
            value={specialFocus} onChange={e => setSpecialFocus(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Parallel Run Checklist..." : `Generate ${runNumber === "1" ? "1st" : runNumber === "2" ? "2nd" : runNumber === "3" ? "3rd" : ""} Parallel Run Checklist`}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your parallel run checklist will appear here — pre-run checks, reconciliation matrix, variance thresholds, and sign-off template." />
    </div>
  );
}
