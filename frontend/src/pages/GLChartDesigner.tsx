import { useState } from "react";
import { generateGLDesign } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function GLChartDesigner() {
  const [companyName, setCompanyName] = useState("Acme Manufacturing Inc.");
  const [industry, setIndustry] = useState("Manufacturing — industrial equipment and components");
  const [legalEntities, setLegalEntities] = useState("3 US legal entities: Acme Manufacturing Ohio LLC, Acme Texas Operations Inc., Acme California Logistics Inc. + 1 Canadian entity: Acme Canada Ltd.");
  const [numSegments, setNumSegments] = useState("6");
  const [reportingRequirements, setReportingRequirements] = useState("US GAAP consolidated financials, entity-level P&L, department-level cost center reporting, product line profitability, intercompany elimination, management reporting by division");
  const [intercompanyNeeded, setIntercompanyNeeded] = useState(true);
  const [hasProjects, setHasProjects] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!companyName.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateGLDesign({
        company_name: companyName, industry, legal_entities: legalEntities,
        num_segments: numSegments, reporting_requirements: reportingRequirements,
        intercompany_needed: intercompanyNeeded, has_projects: hasProjects,
      });
      setResult(data.design);
    } catch { setResult("Error generating COA design. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">GL Chart of Accounts Designer</h1>
        <p className="text-zinc-400 mt-1">Design Oracle Cloud GL COA structure — segments, value sets, natural accounts, cross-validation rules, and account hierarchies</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Company Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Industry</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Legal Entities</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={legalEntities} onChange={e => setLegalEntities(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Reporting Requirements</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={reportingRequirements} onChange={e => setReportingRequirements(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Number of Segments</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={numSegments} onChange={e => setNumSegments(e.target.value)}>
              {["4","5","6","7","8"].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="interco" checked={intercompanyNeeded} onChange={e => setIntercompanyNeeded(e.target.checked)}
              className="w-4 h-4 accent-cyan-400" />
            <label htmlFor="interco" className="text-sm text-zinc-300">Intercompany Required</label>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="projects" checked={hasProjects} onChange={e => setHasProjects(e.target.checked)}
              className="w-4 h-4 accent-cyan-400" />
            <label htmlFor="projects" className="text-sm text-zinc-300">Project Accounting</label>
          </div>
        </div>

        <button onClick={generate} disabled={loading || !companyName.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Designing Chart of Accounts..." : "Generate GL Chart of Accounts Design"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your COA design will appear here — segment structure, natural account ranges, value sets, cross-validation rules, and account hierarchy rollups." />
    </div>
  );
}
