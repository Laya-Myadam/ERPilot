import { useState } from "react";
import { generateBenefitsConfig } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function BenefitsConfigGenerator() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [planTypes, setPlanTypes] = useState("Medical (PPO + HDHP), Dental (DMO + PPO), Vision, Basic Life (1x salary), Supplemental Life, FSA (Medical + Dependent Care), HSA");
  const [carriers, setCarriers] = useState("Medical: Anthem Blue Cross, Dental: Delta Dental, Vision: VSP, Life: MetLife");
  const [enrollmentWindowDays, setEnrollmentWindowDays] = useState("30");
  const [employeeCategories, setEmployeeCategories] = useState("Full-time regular (30+ hrs/week), Part-time (20-29 hrs/week) — medical only, Excludes contractors and seasonal workers");
  const [legislation, setLegislation] = useState("US");
  const [specialRules, setSpecialRules] = useState("ACA compliance required for 2,400 employees. Ohio employees covered by union CBA with separate medical plan (Teamsters Local 436 — United Healthcare). California employees require domestic partner coverage. Open enrollment window: Nov 1–Nov 30 for Jan 1 effective date.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!planTypes.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateBenefitsConfig({
        client_name: clientName, plan_types: planTypes, carriers,
        enrollment_window_days: enrollmentWindowDays,
        employee_categories: employeeCategories, legislation, special_rules: specialRules,
      });
      setResult(data.config);
    } catch { setResult("Error generating benefits config. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Benefits Open Enrollment Config</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud HCM Benefits — plan setup, life events, eligibility profiles, and carrier EDI integration spec</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
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
          <label className="block text-sm font-medium text-zinc-300 mb-1">Plan Types <span className="text-red-400">*</span></label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={planTypes} onChange={e => setPlanTypes(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Carriers</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={carriers} onChange={e => setCarriers(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">New Hire Enrollment Window (days)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={enrollmentWindowDays} onChange={e => setEnrollmentWindowDays(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Categories</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={employeeCategories} onChange={e => setEmployeeCategories(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Special Rules & Constraints</label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={specialRules} onChange={e => setSpecialRules(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading || !planTypes.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Benefits Config..." : "Generate Benefits Configuration Spec"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your Benefits config spec will appear here — plan definitions, eligibility profiles, life event setup, enrollment rules, and carrier EDI requirements." />
    </div>
  );
}
