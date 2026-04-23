import { useState } from "react";
import { generateKBArticle } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const PLATFORMS = ["ServiceNow", "Oracle Fusion HCM", "Oracle ERP Cloud", "Oracle Fusion Financials", "General ITSM", "Oracle JD Edwards"];

export default function KBArticleWriter() {
  const [platform, setPlatform] = useState("Oracle Fusion HCM");
  const [incidentSummary, setIncidentSummary] = useState("All US hourly employees unable to submit timecards — error 'Period is Closed' appearing for all workers during the April 1–15 pay period");
  const [rootCause, setRootCause] = useState("Time Entry Period was closed prematurely by the Payroll Administrator before all timecards were submitted and approved. Period was closed on April 14 instead of April 16.");
  const [resolutionSteps, setResolutionSteps] = useState("1. Navigate to Payroll > Administration > Time Entry Periods. 2. Locate the April 1–15 period with status Closed. 3. Click Actions > Reopen Period. 4. Notify all affected employees via email to resubmit their timecards within 24 hours. 5. Once all timecards are submitted and approved by managers, close the period again. 6. Confirm payroll transfer process picks up all approved timecards.");
  const [affectedSystems, setAffectedSystems] = useState("Oracle Fusion HCM Time and Labor, Payroll module, US legislative data group");
  const [category, setCategory] = useState("Payroll");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!incidentSummary.trim() || !resolutionSteps.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateKBArticle({
        platform,
        incident_summary: incidentSummary,
        root_cause: rootCause,
        resolution_steps: resolutionSteps,
        affected_systems: affectedSystems,
        category,
      });
      setResult(data.article);
    } catch {
      setResult("Error generating article. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Knowledge Base Article Writer</h1>
        <p className="text-zinc-400 mt-1">Convert incident resolutions into structured ServiceNow KB articles instantly</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Platform / System</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Category (optional)</label>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Payroll, Integrations, User Access"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Incident Summary <span className="text-red-400">*</span></label>
          <textarea
            rows={2}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Users unable to submit timecards in Oracle HCM — error 'Period is Closed' appearing for all US hourly workers during Q1 close"
            value={incidentSummary}
            onChange={e => setIncidentSummary(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Root Cause (optional)</label>
          <textarea
            rows={2}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Time Entry Period was closed prematurely by Payroll Admin before all timecards were approved"
            value={rootCause}
            onChange={e => setRootCause(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Resolution Steps <span className="text-red-400">*</span></label>
          <textarea
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. 1. Navigate to Payroll > Time Entry Periods. 2. Find the closed period and click Reopen. 3. Advise affected workers to resubmit timecards. 4. After all timecards approved, close period again."
            value={resolutionSteps}
            onChange={e => setResolutionSteps(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Affected Systems / Modules (optional)</label>
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            placeholder="e.g. Oracle HCM Time and Labor, Payroll module, US legislation"
            value={affectedSystems}
            onChange={e => setAffectedSystems(e.target.value)}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !incidentSummary.trim() || !resolutionSteps.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? "Writing KB Article..." : "Generate KB Article"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your KB article will appear here — symptoms, root cause, resolution steps, prevention, and keywords ready to paste into ServiceNow." />
    </div>
  );
}
