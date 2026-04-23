import { useState } from "react";
import { generateCompensationPlan } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const PLAN_TYPES = ["Merit (Annual Salary Review)", "Bonus (Annual / Quarterly)", "Equity (RSU / Stock Options)", "Merit + Bonus (Combined)", "Total Compensation"];

export default function CompensationPlanDesigner() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [planType, setPlanType] = useState("Merit + Bonus (Combined)");
  const [planCycle, setPlanCycle] = useState("Annual");
  const [gradeStructure, setGradeStructure] = useState("8 grades (G1–G8): G1 $35K–$50K, G2 $48K–$68K, G3 $65K–$90K, G4 $85K–$115K, G5 $110K–$150K, G6 $140K–$185K, G7 $175K–$230K, G8 $220K–$300K");
  const [budgetPercent, setBudgetPercent] = useState("3.5% merit pool, 10–20% target bonus by grade");
  const [performanceRatings, setPerformanceRatings] = useState("1 = Does Not Meet, 2 = Partially Meets, 3 = Meets Expectations, 4 = Exceeds, 5 = Outstanding");
  const [approvalWorkflow, setApprovalWorkflow] = useState("Direct Manager enters recommendations → HR Business Partner reviews → Compensation validates → CHRO approves total spend");
  const [specialRules, setSpecialRules] = useState("New hires within 6 months of cycle start are not eligible for merit but can receive spot bonus. Employees on PIP are ineligible. California salary transparency law requires grade posting on requisitions. Union employees in Ohio are excluded — governed by CBA.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!planType.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateCompensationPlan({
        client_name: clientName, plan_type: planType, plan_cycle: planCycle,
        grade_structure: gradeStructure, budget_percent: budgetPercent,
        performance_ratings: performanceRatings, approval_workflow: approvalWorkflow,
        special_rules: specialRules,
      });
      setResult(data.plan);
    } catch { setResult("Error generating compensation plan. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compensation Plan Designer</h1>
        <p className="text-zinc-400 mt-1">Design Oracle Cloud HCM Compensation plans — grade structures, merit matrices, bonus targets, and approval workflows</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Plan Type <span className="text-red-400">*</span></label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={planType} onChange={e => setPlanType(e.target.value)}>
              {PLAN_TYPES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Plan Cycle</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={planCycle} onChange={e => setPlanCycle(e.target.value)}>
              <option>Annual</option><option>Semi-Annual</option><option>Quarterly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Salary Grade Structure</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={gradeStructure} onChange={e => setGradeStructure(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Budget %</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={budgetPercent} onChange={e => setBudgetPercent(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Performance Rating Scale</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={performanceRatings} onChange={e => setPerformanceRatings(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Approval Workflow</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={approvalWorkflow} onChange={e => setApprovalWorkflow(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Special Rules & Eligibility Exclusions</label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={specialRules} onChange={e => setSpecialRules(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading || !planType.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Designing Compensation Plan..." : "Generate Compensation Plan Design"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your compensation plan design will appear here — grade structure, merit matrix, bonus targets, approval workflow, Oracle config steps, and test scenarios." />
    </div>
  );
}
