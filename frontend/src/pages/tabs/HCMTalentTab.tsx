import { useState } from "react";
import { generateHCMTalent } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "performance_review", label: "Performance Review Template", desc: "Build Oracle performance review templates with sections, rating scales, and calibration workflow" },
  { id: "goal_setting", label: "Goal-Setting Framework", desc: "Configure goal management with OKR/SMART methodology, cascade structure, and approval workflow" },
  { id: "succession", label: "Succession Plan Config", desc: "Set up talent pools, readiness assessments, 9-box grid, and succession review process" },
  { id: "talent_profile", label: "Talent Profile Setup", desc: "Configure skills library, competency framework, and talent profile sections" },
];

const DEFAULTS: Record<string, string> = {
  performance_review: "Annual performance review for 2,400 employees. 360-degree review for director level and above (manager + 3 peers + skip-level). 5-point rating scale: 1=Does Not Meet, 2=Partially Meets, 3=Meets, 4=Exceeds, 5=Outstanding. Forced distribution: no more than 15% can receive a 5. Sections: Goal Achievement (40%), Core Competencies (30%), Role Competencies (20%), Development (10%). Mid-year check-in (no rating, narrative only). Calibration required for all rating changes.",
  goal_setting: "SMART goal framework for all employees. 3-7 goals per person summing to 100% weight. Annual plan (Jan 1 – Dec 31). Cascade: CEO sets 5 corporate goals → VP/Directors cascade to team goals → employees set individual goals aligned to team. Goal approval: Manager must approve within 14 days. Quarterly progress check-ins. Goal achievement rating (1-5) feeds 40% of performance rating.",
  succession: "Succession planning for all Director-level and above positions (85 roles). Talent pool approach: High Potential pool (top 10% identified annually), Leadership Pipeline pool, Critical Role pool. 9-box grid: Performance (1-5 rating) × Potential (Assessed by HRBP). Readiness levels: Ready Now, 1-2 Years, 3-5 Years. Annual succession review in Q4. 2 successors minimum per critical role.",
  talent_profile: "Talent profile for all 2,400 employees. Skills library: 150 skills across 8 categories (Technical, Leadership, Functional, Industry, Languages, Certifications, Tools, Soft Skills). Proficiency scale: 1=Awareness, 2=Working, 3=Practitioner, 4=Expert. Core competencies: 6 for all employees (Communication, Collaboration, Results Focus, Innovation, Integrity, Customer Focus). Leadership competencies: 4 additional for managers. Technical competencies: role/job family specific.",
};

export default function HCMTalentTab() {
  const [activeTool, setActiveTool] = useState("performance_review");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.performance_review);
  const [employeeCount, setEmployeeCount] = useState("2,400");
  const [reviewCycle, setReviewCycle] = useState("Annual");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => { setActiveTool(id); setContext(DEFAULTS[id]); setResult(""); };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateHCMTalent({ client_name: clientName, tool_type: activeTool, context, employee_count: employeeCount, review_cycle: reviewCycle });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Talent Management</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Cloud Talent — performance reviews, goal setting, succession planning, and talent profiles</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => selectTool(t.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeTool === t.id ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan" : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="card-glass rounded-xl p-6 space-y-4">
        <p className="text-xs text-zinc-500">{active.desc}</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Review Cycle</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={reviewCycle} onChange={e => setReviewCycle(e.target.value)}>
              <option>Annual</option><option>Semi-Annual</option><option>Quarterly</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Requirements & Context <span className="text-red-400">*</span></label>
          <textarea rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none" value={context} onChange={e => setContext(e.target.value)} />
        </div>
        <button onClick={generate} disabled={loading || !context.trim()} className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? `Generating ${active.label}...` : `Generate ${active.label}`}
        </button>
      </div>
      <OutputPanel content={result} loading={loading} placeholder={`Your ${active.label} configuration will appear here.`} />
    </div>
  );
}
