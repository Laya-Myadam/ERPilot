import { useState } from "react";
import { generateHCMWorkbook } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const ALL_MODULES = ["Core HCM", "Payroll", "Absence Management", "Time and Labor (OTL)", "Benefits", "Talent Management", "Recruiting", "Learning", "Compensation", "Workforce Management"];

export default function HCMConfigWorkbook() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [selectedModules, setSelectedModules] = useState<string[]>(["Core HCM", "Payroll", "Absence Management", "Time and Labor (OTL)"]);
  const [legislation, setLegislation] = useState("US");
  const [employeeCount, setEmployeeCount] = useState("2,400");
  const [goLiveDate, setGoLiveDate] = useState("2025-10-01");
  const [legacySystem, setLegacySystem] = useState("ADP Workforce Now");
  const [businessContext, setBusinessContext] = useState("Mid-size manufacturing company with 3 US legal entities across Ohio, Texas, and California. Mix of salaried exempt and hourly non-exempt workers. Union workforce in 2 Ohio plants (CBA expires 2026). 12 job families, 6 grade levels. Currently on ADP with heavy customization. Phase 2 will add Canada operations in 2026.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleModule = (m: string) =>
    setSelectedModules(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const generate = async () => {
    if (!clientName.trim() || selectedModules.length === 0) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateHCMWorkbook({
        client_name: clientName,
        modules: selectedModules.join(", "),
        legislation,
        employee_count: employeeCount,
        go_live_date: goLiveDate,
        legacy_system: legacySystem,
        business_context: businessContext,
      });
      setResult(data.workbook);
    } catch {
      setResult("Error generating workbook. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">HCM Configuration Workbook</h1>
        <p className="text-zinc-400 mt-1">Generate the full Oracle HCM configuration workbook — org structure decisions, element lists, absence plans, open items, and data migration objects</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Acme Manufacturing Inc." value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select value={legislation} onChange={e => setLegislation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option>US</option>
              <option>Canada</option>
              <option>UK</option>
              <option>Australia</option>
              <option>Multi-Country</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Modules in Scope <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {ALL_MODULES.map(m => (
              <button key={m} onClick={() => toggleModule(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedModules.includes(m)
                    ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Count</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. 2,400" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Target Go-Live Date</label>
            <input type="date" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={goLiveDate} onChange={e => setGoLiveDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legacy System Being Replaced</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. ADP Workforce Now, PeopleSoft 9.2, SAP HCM" value={legacySystem} onChange={e => setLegacySystem(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Business Context (optional)</label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Manufacturing company with 3 US legal entities, union workforce in 2 plants, 12 different job families, expanding to Canada in Phase 2. Currently on ADP with heavy customization."
            value={businessContext} onChange={e => setBusinessContext(e.target.value)} />
        </div>

        <button onClick={generate} disabled={loading || !clientName.trim() || selectedModules.length === 0}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Configuration Workbook..." : "Generate HCM Configuration Workbook"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your full HCM configuration workbook will appear here — org structure, element lists, absence plans, open decisions, and data migration objects." />
    </div>
  );
}
