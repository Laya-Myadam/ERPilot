import { useState } from "react";
import { generatePayrollRecon } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function PayrollReconciliation() {
  const [payrollName, setPayrollName] = useState("US Biweekly Hourly Payroll");
  const [period, setPeriod] = useState("April 1–15, 2025");
  const [empCurrent, setEmpCurrent] = useState("487");
  const [empPrevious, setEmpPrevious] = useState("481");
  const [currentRun, setCurrentRun] = useState(`Gross Pay: $1,248,320.00
Regular Pay: $1,102,540.00
Overtime Pay: $87,430.00
Bonus Pay: $58,350.00
Federal Income Tax: $187,248.00
Social Security EE: $77,396.00
Medicare EE: $18,109.00
401k Pre-tax: $62,416.00
Medical Deductions: $31,208.00
Net Pay: $871,943.00`);
  const [previousRun, setPreviousRun] = useState(`Gross Pay: $1,201,880.00
Regular Pay: $1,098,240.00
Overtime Pay: $52,190.00
Bonus Pay: $51,450.00
Federal Income Tax: $180,282.00
Social Security EE: $74,516.00
Medicare EE: $17,427.00
401k Pre-tax: $60,094.00
Medical Deductions: $30,047.00
Net Pay: $839,514.00`);
  const [notes, setNotes] = useState("6 new hires this period, Q1 annual bonus paid out, one retroactive pay adjustment for a rate change effective March 1.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!currentRun.trim() || !previousRun.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generatePayrollRecon({
        payroll_name: payrollName,
        period,
        employee_count_current: empCurrent,
        employee_count_previous: empPrevious,
        current_run: currentRun,
        previous_run: previousRun,
        notes,
      });
      setResult(data.analysis);
    } catch {
      setResult("Error analyzing. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const placeholder_current = `Gross Pay: $1,248,320.00
Regular Pay: $1,102,540.00
Overtime Pay: $87,430.00
Bonus Pay: $58,350.00
Federal Income Tax: $187,248.00
Social Security EE: $77,396.00
Medicare EE: $18,109.00
401k Pre-tax: $62,416.00
Medical Deductions: $31,208.00
Net Pay: $871,943.00`;

  const placeholder_previous = `Gross Pay: $1,201,880.00
Regular Pay: $1,098,240.00
Overtime Pay: $52,190.00
Bonus Pay: $51,450.00
Federal Income Tax: $180,282.00
Social Security EE: $74,516.00
Medicare EE: $17,427.00
401k Pre-tax: $60,094.00
Medical Deductions: $30,047.00
Net Pay: $839,514.00`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Reconciliation Analyzer</h1>
        <p className="text-zinc-400 mt-1">Paste current and previous run totals — AI identifies variances, likely causes, and investigation steps</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Payroll Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. US Semi-Monthly Payroll" value={payrollName} onChange={e => setPayrollName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Pay Period</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. April 1–15, 2025" value={period} onChange={e => setPeriod(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count — Current Run</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. 487" value={empCurrent} onChange={e => setEmpCurrent(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count — Previous Run</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. 481" value={empPrevious} onChange={e => setEmpPrevious(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Current Run Totals <span className="text-red-400">*</span></label>
            <textarea rows={10} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none font-mono"
              placeholder={placeholder_current} value={currentRun} onChange={e => setCurrentRun(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Previous Run Totals <span className="text-red-400">*</span></label>
            <textarea rows={10} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none font-mono"
              placeholder={placeholder_previous} value={previousRun} onChange={e => setPreviousRun(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Additional Notes (optional)</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. 6 new hires this period, one retroactive pay adjustment, annual bonus paid for Q1"
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={analyze} disabled={loading || !currentRun.trim() || !previousRun.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Analyzing Variances..." : "Analyze Payroll Reconciliation"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Paste both run totals above — AI will build a variance table, flag critical differences, and give investigation steps." />
    </div>
  );
}
