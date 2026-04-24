import { useState } from "react";
import { generateChangeRequest } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function ChangeRequestGenerator() {
  const [projectName, setProjectName] = useState("Oracle Fusion Cloud HCM Implementation");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [crTitle, setCrTitle] = useState("Add Canada HCM Configuration for 120 Ontario Employees — Phase 1 Expansion");
  const [requestedBy, setRequestedBy] = useState("Jennifer Walsh, CHRO — Acme Manufacturing");
  const [changeDescription, setChangeDescription] = useState("Client has decided to accelerate the Phase 2 Canada expansion into the current Phase 1 project scope. This requires adding Canadian legislation configuration for Ontario, configuring a separate Canadian payroll definition (semi-monthly), migrating 120 Canadian employees from ADP Canada, and configuring province-specific absence plans (Ontario ESA compliance). This was explicitly listed as out-of-scope in the original SOW.");
  const [reasonForChange, setReasonForChange] = useState("Acme is acquiring a Canadian company (closing June 30) and needs all employees on a single Oracle Cloud HCM system by August 1 to consolidate HR operations before the acquisition integration period.");
  const [modulesAffected, setModulesAffected] = useState("Core HCM, Payroll, Absence Management, OTL, HDL Data Migration");
  const [originalScope, setOriginalScope] = useState("Original SOW Section 2.3 explicitly excludes Canada operations. Scope limited to 3 US legal entities (Ohio, Texas, California).");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => { setProjectName("Oracle Fusion Cloud HCM Implementation"); setClientName("Acme Manufacturing Inc."); setCrTitle("Add Canada HCM Configuration for 120 Ontario Employees — Phase 1 Expansion"); setRequestedBy("Jennifer Walsh, CHRO — Acme Manufacturing"); setChangeDescription("Client has decided to accelerate the Phase 2 Canada expansion into the current Phase 1 project scope. This requires adding Canadian legislation configuration for Ontario, configuring a separate Canadian payroll definition (semi-monthly), migrating 120 Canadian employees from ADP Canada, and configuring province-specific absence plans (Ontario ESA compliance). This was explicitly listed as out-of-scope in the original SOW."); setReasonForChange("Acme is acquiring a Canadian company (closing June 30) and needs all employees on a single Oracle Cloud HCM system by August 1 to consolidate HR operations before the acquisition integration period."); setModulesAffected("Core HCM, Payroll, Absence Management, OTL, HDL Data Migration"); setOriginalScope("Original SOW Section 2.3 explicitly excludes Canada operations. Scope limited to 3 US legal entities (Ohio, Texas, California)."); };

  const generate = async () => {
    if (!crTitle.trim() || !changeDescription.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateChangeRequest({
        project_name: projectName, client_name: clientName, cr_title: crTitle,
        requested_by: requestedBy, change_description: changeDescription,
        reason_for_change: reasonForChange, modules_affected: modulesAffected,
        original_scope: originalScope,
      });
      setResult(data.document);
    } catch { setResult("Error generating CR. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Change Request Generator</h1>
        <p className="text-zinc-400 mt-1">Document scope changes formally — stop scope creep, protect revenue, get client sign-off with a proper CR every time</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">CR Title <span className="text-red-400">*</span></label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            value={crTitle} onChange={e => setCrTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Requested By</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={requestedBy} onChange={e => setRequestedBy(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Modules Affected</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={modulesAffected} onChange={e => setModulesAffected(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Change Description <span className="text-red-400">*</span></label>
          <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={changeDescription} onChange={e => setChangeDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Business Justification</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={reasonForChange} onChange={e => setReasonForChange(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Original Scope Reference</label>
            <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={originalScope} onChange={e => setOriginalScope(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={loadSample} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition">Load Sample</button>
          <button onClick={generate} disabled={loading || !crTitle.trim()} className="flex-1 py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
            {loading ? "Generating Change Request..." : "Generate Change Request Document"}
          </button>
        </div>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your formal Change Request document will appear here — with schedule impact, effort estimate, cost breakdown, and approval signature table." />
    </div>
  );
}
