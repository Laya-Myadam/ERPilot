import { useState } from "react";
import { generateSecurityRole } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const MODULES = ["Core HCM", "Payroll", "Absence Management", "Time and Labor", "Benefits", "Recruiting", "Compensation", "General Ledger", "Accounts Payable", "Accounts Receivable", "Procurement"];
const SYSTEMS = ["Oracle Cloud HCM", "Oracle Cloud ERP", "JD Edwards EnterpriseOne"];

export default function SecurityRoleDesigner() {
  const [roleName, setRoleName] = useState("Payroll Specialist");
  const [module, setModule] = useState("Payroll");
  const [erpSystem, setErpSystem] = useState("Oracle Cloud HCM");
  const [legislation, setLegislation] = useState("US");
  const [canDo, setCanDo] = useState(
    `View and edit element entries for employees in their assigned business unit\nRun payroll calculations (Quick Pay and Payroll Run)\nView payroll run results and statements of earnings\nResubmit failed payroll processes\nView and print payment documents\nAccess payroll costing results\nRun standard payroll reports (Payroll Register, Element Summary)`
  );
  const [cannotDo, setCannotDo] = useState(
    `Cannot approve payrolls — approval is done by Payroll Manager only\nCannot create or modify payroll elements or element definitions\nCannot view employees in other business units\nCannot access salary or compensation data\nCannot modify tax withholding setup\nCannot access HR personal data beyond what is needed for payroll`
  );
  const [dataRestrictions, setDataRestrictions] = useState(
    "Can only see employees assigned to the US Ohio business unit. Cannot see employees in Texas or California business units. Cannot see salary grade or compensation history."
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => {
    setRoleName("Payroll Specialist"); setModule("Payroll"); setErpSystem("Oracle Cloud HCM"); setLegislation("US");
    setCanDo("View and edit element entries for employees in their assigned business unit\nRun payroll calculations (Quick Pay and Payroll Run)\nView payroll run results and statements of earnings\nResubmit failed payroll processes\nView and print payment documents\nAccess payroll costing results\nRun standard payroll reports (Payroll Register, Element Summary)");
    setCannotDo("Cannot approve payrolls — approval is done by Payroll Manager only\nCannot create or modify payroll elements or element definitions\nCannot view employees in other business units\nCannot access salary or compensation data\nCannot modify tax withholding setup\nCannot access HR personal data beyond what is needed for payroll");
    setDataRestrictions("Can only see employees assigned to the US Ohio business unit. Cannot see employees in Texas or California business units. Cannot see salary grade or compensation history.");
  };

  const generate = async () => {
    if (!roleName.trim() || !canDo.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateSecurityRole({
        role_name: roleName, module, erp_system: erpSystem, legislation,
        what_user_can_do: canDo, what_user_cannot_do: cannotDo, data_restrictions: dataRestrictions,
      });
      setResult(data.design);
    } catch { setResult("Error generating role design. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">HCM Security Role Designer</h1>
        <p className="text-zinc-400 mt-1">Describe what a user should do → get the complete Oracle Cloud security role matrix with job roles, duty roles, data security profiles, and SOD conflicts</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Role Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={roleName} onChange={e => setRoleName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Module</label>
            <select value={module} onChange={e => setModule(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">System</label>
            <select value={erpSystem} onChange={e => setErpSystem(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select value={legislation} onChange={e => setLegislation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option>US</option><option>Canada</option><option>UK</option><option>Australia</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">What This User CAN Do <span className="text-red-400">*</span></label>
            <textarea rows={7} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="List every action this user needs to perform..."
              value={canDo} onChange={e => setCanDo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">What This User CANNOT Do</label>
            <textarea rows={7} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="Explicit restrictions to enforce..."
              value={cannotDo} onChange={e => setCannotDo(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Data Restrictions — What Data Can They See?</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={dataRestrictions} onChange={e => setDataRestrictions(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button onClick={loadSample} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition">Load Sample</button>
          <button onClick={generate} disabled={loading || !roleName.trim() || !canDo.trim()}
            className="flex-1 py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
            {loading ? "Designing Security Role..." : "Generate Oracle Security Role Design"}
          </button>
        </div>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your Oracle Cloud security role design will appear here — job roles, duty roles, data security profiles, SOD conflicts, and implementation steps." />
    </div>
  );
}
