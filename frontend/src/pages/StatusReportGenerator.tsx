import { useState } from "react";
import { generateStatusReport } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const STATUS_OPTIONS = [
  { value: "Green", label: "🟢 Green — On Track", color: "border-green-500 bg-green-500/10 text-green-400" },
  { value: "Yellow", label: "🟡 Yellow — At Risk", color: "border-yellow-500 bg-yellow-500/10 text-yellow-400" },
  { value: "Red", label: "🔴 Red — Off Track", color: "border-red-500 bg-red-500/10 text-red-400" },
];

export default function StatusReportGenerator() {
  const [projectName, setProjectName] = useState("Oracle Fusion Cloud HCM Implementation");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [reportPeriod, setReportPeriod] = useState("Week of April 14–18, 2025");
  const [overallStatus, setOverallStatus] = useState("Yellow");
  const [percentComplete, setPercentComplete] = useState("42%");
  const [budgetStatus, setBudgetStatus] = useState("On budget — $840K of $2.1M spent");
  const [accomplishments, setAccomplishments] = useState(
    `Completed Core HCM configuration for all 3 legal entities (Ohio, Texas, California)\nFinalized payroll element design for 18 standard earnings elements — client signed off\nCompleted HDL data migration templates for Worker and Assignment objects\nHeld absence plan design workshop — all 6 leave types documented and approved`
  );
  const [inProgress, setInProgress] = useState(
    `Fast Formula development for overtime and shift differential (Sarah Chen, due Apr 25)\nPayroll element entry load for 850 employees — 60% complete (Raj Patel, due Apr 22)\nOTL work schedule configuration for 3-shift manufacturing pattern (Sarah Chen, due Apr 28)`
  );
  const [upcoming, setUpcoming] = useState(
    `System Integration Testing (SIT) kickoff — May 5\nParallel run #1 setup and execution — May 12-16\nUAT environment refresh and test script distribution — May 1`
  );
  const [risksIssues, setRisksIssues] = useState(
    `YELLOW RISK: Client UAT team availability — only 2 of 5 designated testers confirmed available for May 19 UAT week. Impact: UAT may extend by 1 week.\nYELLOW ISSUE: California OT fast formula requires legal review of Double Time rule — awaiting client HR Legal sign-off (due Apr 16, now Apr 21). Could delay payroll SIT.`
  );
  const [decisionsNeeded, setDecisionsNeeded] = useState(
    `1. Confirm UAT team members and availability for week of May 19 — needed by Apr 21\n2. HR Legal sign-off on California Double Time fast formula — needed by Apr 21\n3. Decision on 401k integration: real-time API vs weekly SFTP file — needed by Apr 25`
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!projectName.trim() || !clientName.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateStatusReport({
        project_name: projectName, client_name: clientName, report_period: reportPeriod,
        overall_status: overallStatus, percent_complete: percentComplete, budget_status: budgetStatus,
        accomplishments, in_progress: inProgress, upcoming, risks_issues: risksIssues,
        decisions_needed: decisionsNeeded,
      });
      setResult(data.report);
    } catch { setResult("Error generating report. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Status Report</h1>
        <p className="text-zinc-400 mt-1">Generate a professional client-ready weekly status report in seconds — every consultant, every week</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Project Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={projectName} onChange={e => setProjectName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Report Period</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Week of April 14–18, 2025"
              value={reportPeriod} onChange={e => setReportPeriod(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {STATUS_OPTIONS.map(s => (
            <button key={s.value} onClick={() => setOverallStatus(s.value)}
              className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${overallStatus === s.value ? s.color : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500"}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">% Complete</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={percentComplete} onChange={e => setPercentComplete(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Budget Status</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={budgetStatus} onChange={e => setBudgetStatus(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Accomplishments This Period <span className="text-red-400">*</span></label>
          <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={accomplishments} onChange={e => setAccomplishments(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">In Progress</label>
            <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={inProgress} onChange={e => setInProgress(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Upcoming Next Period</label>
            <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={upcoming} onChange={e => setUpcoming(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Risks & Issues (optional)</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={risksIssues} onChange={e => setRisksIssues(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Decisions Needed from Client (optional)</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={decisionsNeeded} onChange={e => setDecisionsNeeded(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !projectName.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Status Report..." : "Generate Client Status Report"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your formatted weekly status report will appear here — ready to copy and send to the client." />
    </div>
  );
}
