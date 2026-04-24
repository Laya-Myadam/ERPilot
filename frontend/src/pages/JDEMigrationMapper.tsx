import { useState } from "react";
import { generateJDEMigrationMap } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const JDE_VERSIONS = ["9.2 (current)", "9.1", "9.0 (EnterpriseOne 8.12)", "8.11 (EnterpriseOne)", "8.10", "World (AS/400)"];
const TARGET_SYSTEMS = ["Oracle Cloud HCM", "Oracle Cloud ERP", "Oracle Cloud HCM + ERP (Full Suite)"];

export default function JDEMigrationMapper() {
  const [companyName, setCompanyName] = useState("Acme Manufacturing Inc.");
  const [jdeVersion, setJdeVersion] = useState("9.2 (current)");
  const [modulesToMigrate, setModulesToMigrate] = useState("HR/Payroll (07/07Y): Employee master, job/position, pay history (3 years), W-2 history. Finance (09): Chart of accounts, open AP invoices, open AR, fixed assets. Distribution (41-43): Supplier/customer master, open POs, open sales orders.");
  const [employeeCount, setEmployeeCount] = useState("2,400 employees across 3 US legal entities, ~18,000 supplier records, ~4,200 customer records");
  const [dataYearsToMigrate, setDataYearsToMigrate] = useState("3");
  const [targetSystem, setTargetSystem] = useState("Oracle Cloud HCM + ERP (Full Suite)");
  const [complexityNotes, setComplexityNotes] = useState("JDE has heavy customization in payroll (union CBA rules baked into custom UBEs). Employee master has duplicate address book entries from 2018 acquisition. Chart of accounts has 12,000 accounts — need rationalization down to ~3,000. California employees on custom OT schedule not in standard JDE OT rules.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => {
    setCompanyName("Acme Manufacturing Inc."); setJdeVersion("9.2 (current)"); setTargetSystem("Oracle Cloud HCM + ERP (Full Suite)");
    setModulesToMigrate("HR/Payroll (07/07Y): Employee master, job/position, pay history (3 years), W-2 history. Finance (09): Chart of accounts, open AP invoices, open AR, fixed assets. Distribution (41-43): Supplier/customer master, open POs, open sales orders.");
    setEmployeeCount("2,400 employees across 3 US legal entities, ~18,000 supplier records, ~4,200 customer records");
    setDataYearsToMigrate("3");
    setComplexityNotes("JDE has heavy customization in payroll (union CBA rules baked into custom UBEs). Employee master has duplicate address book entries from 2018 acquisition. Chart of accounts has 12,000 accounts — need rationalization down to ~3,000. California employees on custom OT schedule not in standard JDE OT rules.");
  };

  const generate = async () => {
    if (!modulesToMigrate.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateJDEMigrationMap({
        company_name: companyName, jde_version: jdeVersion,
        modules_to_migrate: modulesToMigrate, employee_count: employeeCount,
        data_years_to_migrate: dataYearsToMigrate, target_system: targetSystem,
        complexity_notes: complexityNotes,
      });
      setResult(data.mapping);
    } catch { setResult("Error generating migration map. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">JDE → Oracle Cloud Migration Mapper</h1>
        <p className="text-zinc-400 mt-1">Generate JDE to Oracle Cloud field mappings, transformation rules, HDL file sequence, cutover strategy, and risk assessment</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Company Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">JDE Version</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={jdeVersion} onChange={e => setJdeVersion(e.target.value)}>
              {JDE_VERSIONS.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Target System</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={targetSystem} onChange={e => setTargetSystem(e.target.value)}>
              {TARGET_SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Modules & Objects to Migrate <span className="text-red-400">*</span></label>
          <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={modulesToMigrate} onChange={e => setModulesToMigrate(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Record Counts</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Complexity Notes & Customizations</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={complexityNotes} onChange={e => setComplexityNotes(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Years of Historical Data to Migrate</label>
          <select className="w-48 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            value={dataYearsToMigrate} onChange={e => setDataYearsToMigrate(e.target.value)}>
            <option>1</option><option>2</option><option>3</option><option>5</option><option>7</option><option>10</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={loadSample} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition">Load Sample</button>
          <button onClick={generate} disabled={loading || !modulesToMigrate.trim()}
            className="flex-1 py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
            {loading ? "Generating Migration Map..." : "Generate JDE → Oracle Migration Mapping"}
          </button>
        </div>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your JDE migration mapping will appear here — field-by-field mappings, transformation rules, HDL file sequence, code value translations, cutover strategy, and risk register." />
    </div>
  );
}
