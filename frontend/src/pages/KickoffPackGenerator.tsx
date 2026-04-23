import { useState } from "react";
import { generateKickoffPack } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function KickoffPackGenerator() {
  const [projectName, setProjectName] = useState("Oracle Fusion Cloud HCM Implementation");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [modules, setModules] = useState("Core HCM, Payroll, Absence Management, Time and Labor (OTL)");
  const [goLiveDate, setGoLiveDate] = useState("October 1, 2025");
  const [projectStartDate, setProjectStartDate] = useState("April 21, 2025");
  const [clientTeam, setClientTeam] = useState("Jennifer Walsh (CHRO, Executive Sponsor), Mark Davis (IT Director), Lisa Chen (Payroll Manager, SME), Tom Rivera (HR Manager, SME), 2 dedicated UAT testers TBD");
  const [denovoTeam, setDenovoTeam] = useState("Sarah Chen (Lead HCM Consultant), Raj Patel (Payroll Consultant), Michael Torres (Project Manager), Priya Sharma (Engagement Director)");
  const [legacySystem, setLegacySystem] = useState("ADP Workforce Now (HCM + Payroll)");
  const [employeeCount, setEmployeeCount] = useState("2,400 employees across 3 US legal entities (Ohio, Texas, California)");
  const [specialConstraints, setSpecialConstraints] = useState("Hard go-live deadline of October 1 — cannot move due to ADP contract expiration. Union employees in Ohio require CBA compliance review before payroll config sign-off. California OT rules need legal approval. Budget is fixed at $2.1M.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!projectName.trim() || !clientName.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateKickoffPack({
        project_name: projectName, client_name: clientName, modules,
        go_live_date: goLiveDate, project_start_date: projectStartDate,
        client_team: clientTeam, denovo_team: denovoTeam,
        legacy_system: legacySystem, employee_count: employeeCount,
        special_constraints: specialConstraints,
      });
      setResult(data.pack);
    } catch { setResult("Error generating kickoff pack. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Kickoff Pack Generator</h1>
        <p className="text-zinc-400 mt-1">Generate the complete first-week document pack — project charter, RACI, milestone plan, risk register, communication plan, and 30-day action plan</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Project Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={projectName} onChange={e => setProjectName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Modules in Scope</label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            value={modules} onChange={e => setModules(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Target Go-Live Date</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={goLiveDate} onChange={e => setGoLiveDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Project Start Date</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legacy System</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={legacySystem} onChange={e => setLegacySystem(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count / Scope</label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Team</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={clientTeam} onChange={e => setClientTeam(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Denovo Team</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={denovoTeam} onChange={e => setDenovoTeam(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Special Constraints & Notes</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={specialConstraints} onChange={e => setSpecialConstraints(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading || !projectName.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Kickoff Pack..." : "Generate Complete Project Kickoff Pack"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your complete kickoff pack will appear here — project charter, RACI matrix, milestone plan, risk register, communication plan, 30-day action plan, and client checklist." />
    </div>
  );
}
