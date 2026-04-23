import { useState } from "react";
import { generateHCMLearning } from "../../api/client";
import OutputPanel from "../../components/ui/OutputPanel";

const TOOLS = [
  { id: "course_catalog", label: "Course Catalog Setup", desc: "Build the Oracle Learning course catalog structure, content types, and enrollment rules" },
  { id: "learning_path", label: "Learning Path Designer", desc: "Design role-based learning paths with prerequisites, sequencing, and completion rules" },
  { id: "compliance", label: "Compliance Training Config", desc: "Automate mandatory compliance training assignments, reminders, and escalation" },
  { id: "certification", label: "Certification Program Setup", desc: "Configure certification programs with exams, digital badges, and renewal cycles" },
];

const DEFAULTS: Record<string, string> = {
  course_catalog: "Oracle Learning Cloud catalog for 2,400 employees across Manufacturing, Finance, HR, IT, Engineering, and Operations. Need: 5 top-level categories (Safety & Compliance, Leadership, Technical Skills, HR Policies, Product Knowledge). Mix of ILT, eLearning (SCORM), and video content. Manager approval required for external certifications over $500. Self-enrollment for all standard courses.",
  learning_path: "New hire onboarding path (Days 1/30/60/90) for manufacturing and professional roles. Role-specific paths for: Production Operators, Finance Analysts, HR Business Partners, IT staff. Include compliance prerequisites (OSHA, harassment, safety) before any role-specific content. Certification required at path completion for safety-critical roles.",
  compliance: "Annual compliance training required for all 2,400 employees: Workplace Harassment Prevention (CA mandates 2-hrs for supervisors), OSHA Safety (annual refresh), Code of Ethics, Data Privacy / GDPR basics, Anti-Bribery/FCPA. New hires must complete within 30 days. Ohio union employees have separate safety certification requirement per CBA.",
  certification: "Oracle HCM Certification Program for internal consultants and power users. 3 levels: HCM User (modules: Core, Payroll basics), HCM Power User (all modules + config), HCM Administrator (security + fast formula). 2-year renewal with annual refresher. Digital badge on completion. Exam: 50 questions, 70% passing score, 2 retake attempts.",
};

export default function HCMLearningTab() {
  const [activeTool, setActiveTool] = useState("course_catalog");
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [context, setContext] = useState(DEFAULTS.course_catalog);
  const [employeeCount, setEmployeeCount] = useState("2,400");
  const [legislation, setLegislation] = useState("US");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTool = (id: string) => {
    setActiveTool(id);
    setContext(DEFAULTS[id]);
    setResult("");
  };

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateHCMLearning({ client_name: clientName, tool_type: activeTool, context, employee_count: employeeCount, legislation });
      setResult(data.result);
    } catch { setResult("Error generating output. Check backend connection."); }
    finally { setLoading(false); }
  };

  const active = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Learning Management</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Learning Cloud — catalogs, paths, compliance training, and certification programs</p>
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
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan" value={legislation} onChange={e => setLegislation(e.target.value)}>
              <option>US</option><option>Canada</option><option>UK</option><option>Australia</option>
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
