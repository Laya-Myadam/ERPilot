import { useState } from "react";
import { generateAbsencePlan } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const LEAVE_TYPES = ["Vacation / PTO", "Sick Leave", "FMLA", "Maternity / Paternity", "Bereavement", "Jury Duty", "Military Leave", "Short-Term Disability", "Long-Term Disability", "Comp Time", "Custom"];
const LEGISLATIONS = ["US", "Canada", "UK", "Australia", "India", "Multi-Country"];

export default function AbsencePlanDesigner() {
  const [planName, setPlanName] = useState("US Annual Vacation Accrual Plan");
  const [leaveType, setLeaveType] = useState("Vacation / PTO");
  const [legislation, setLegislation] = useState("US");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [policyDescription, setPolicyDescription] = useState("Full-time employees accrue 1.25 days of vacation per month (15 days/year) for years 1–3 of service, increasing to 1.67 days/month (20 days/year) after 3 years, and 2.08 days/month (25 days/year) after 10 years. Part-time employees accrue proportionally based on scheduled hours vs 40-hour week. Accrual begins on hire date. No accrual during unpaid leaves of absence.");
  const [accrualRules, setAccrualRules] = useState("Accrues on the first of each month. Maximum balance cap of 40 days. New hires have a 90-day waiting period before they can use (but not before they accrue) vacation.");
  const [carryoverRules, setCarryoverRules] = useState("Maximum 10 days carry over to next calendar year. Any balance above 10 days is forfeited on December 31. No payout of forfeited balance.");
  const [eligibility, setEligibility] = useState("Regular full-time and part-time employees only. Excludes contractors, temporary workers, and interns.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!policyDescription.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateAbsencePlan({
        plan_name: planName,
        leave_type: leaveType,
        legislation,
        client_name: clientName,
        policy_description: policyDescription,
        accrual_rules: accrualRules,
        carryover_rules: carryoverRules,
        eligibility,
      });
      setResult(data.plan);
    } catch {
      setResult("Error generating plan. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Absence Plan Designer</h1>
        <p className="text-zinc-400 mt-1">Input client leave policy in plain English — get the full Oracle Absence Plan configuration spec</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Leave Type</label>
            <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select value={legislation} onChange={e => setLegislation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {LEGISLATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name (optional)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Plan Name (optional)</label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            placeholder="e.g. US Annual Vacation Plan — will be auto-generated if blank"
            value={planName} onChange={e => setPlanName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Leave Policy Description <span className="text-red-400">*</span></label>
          <textarea rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Full-time employees accrue 1.25 days of vacation per month (15 days/year) for years 1–3, increasing to 1.67 days/month (20 days/year) after 3 years of service, and 2.08 days/month (25 days/year) after 10 years. Part-time employees accrue proportionally based on scheduled hours. Accrual begins on hire date. No accrual during unpaid leaves."
            value={policyDescription} onChange={e => setPolicyDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Accrual Rules (optional — if not in description)</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. Accrues first of month, maximum balance 40 days, waiting period 90 days for new hires"
              value={accrualRules} onChange={e => setAccrualRules(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Carryover Rules (optional)</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. Maximum 10 days carry over to next year, any balance above 10 is forfeited on December 31"
              value={carryoverRules} onChange={e => setCarryoverRules(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Eligibility (optional)</label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            placeholder="e.g. Regular full-time and part-time employees only; excludes contractors and temporary workers"
            value={eligibility} onChange={e => setEligibility(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading || !policyDescription.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Designing Absence Plan..." : "Generate Oracle Absence Plan Spec"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your complete Oracle Absence Plan configuration spec will appear here — accrual rules, carryover, Fast Formulas, and configuration steps." />
    </div>
  );
}
