import { useState } from "react";
import { generateIntegrationSpec } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const SYSTEMS = ["Oracle Cloud HCM", "Oracle Cloud ERP", "JD Edwards EnterpriseOne", "Salesforce CRM", "ADP Workforce Now", "Ceridian Dayforce", "Workday", "SAP", "Microsoft Dynamics", "ServiceNow", "BambooHR", "Greenhouse (ATS)", "DocuSign", "Custom SFTP", "Legacy ERP"];
const DIRECTIONS = ["Source → Target (One-way)", "Target → Source (One-way)", "Bidirectional"];
const FREQUENCIES = ["Real-time (event-triggered)", "Near real-time (every 15 min)", "Hourly", "Daily (batch)", "Weekly", "On-demand"];

export default function IntegrationSpecGenerator() {
  const [integrationName, setIntegrationName] = useState("Oracle Cloud HCM to ADP Benefits Integration");
  const [sourceSystem, setSourceSystem] = useState("Oracle Cloud HCM");
  const [targetSystem, setTargetSystem] = useState("ADP Workforce Now");
  const [direction, setDirection] = useState("Source → Target (One-way)");
  const [frequency, setFrequency] = useState("Daily (batch)");
  const [dataObjects, setDataObjects] = useState("Employee personal data (new hires, terminations, name/address changes), Benefits enrollment elections, Dependent information, Life event triggers (marriage, birth, divorce)");
  const [businessPurpose, setBusinessPurpose] = useState("Automatically sync Oracle Cloud HCM employee data to ADP for benefits administration. When an employee is hired, terminated, or has a qualifying life event in Oracle, ADP must be updated within 24 hours to ensure correct benefits enrollment and payroll deductions.");
  const [volume, setVolume] = useState("~850 employees total. Daily changes: 2-5 new hires, 1-3 terminations, 10-20 personal data changes. Open enrollment period: up to 800 transactions in 2-week window.");
  const [specialReqs, setSpecialReqs] = useState("Must handle ADP's proprietary file format (834 EDI for benefits). SSN must be masked in transit logs. Failed records must be quarantined and emailed to HR Operations within 1 hour. Must support retroactive effective dates for life events.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!businessPurpose.trim() || !dataObjects.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateIntegrationSpec({
        integration_name: integrationName, source_system: sourceSystem, target_system: targetSystem,
        direction, frequency, data_objects: dataObjects, business_purpose: businessPurpose,
        volume, special_requirements: specialReqs,
      });
      setResult(data.spec);
    } catch { setResult("Error generating spec. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Integration Spec Generator</h1>
        <p className="text-zinc-400 mt-1">Describe a system integration → get the complete specification with field mappings, transformation rules, error handling, and test scenarios</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Integration Name</label>
          <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            value={integrationName} onChange={e => setIntegrationName(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Source System</label>
            <select value={sourceSystem} onChange={e => setSourceSystem(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Target System</label>
            <select value={targetSystem} onChange={e => setTargetSystem(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Direction</label>
            <select value={direction} onChange={e => setDirection(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {DIRECTIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Data Objects / What's Being Transferred <span className="text-red-400">*</span></label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={dataObjects} onChange={e => setDataObjects(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Business Purpose <span className="text-red-400">*</span></label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={businessPurpose} onChange={e => setBusinessPurpose(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Volume & Frequency Details</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={volume} onChange={e => setVolume(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Special Requirements</label>
            <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              value={specialReqs} onChange={e => setSpecialReqs(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !businessPurpose.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating Integration Spec..." : "Generate Integration Specification"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your integration spec will appear here — field mappings, transformation rules, error handling, security, test plan, and monitoring runbook." />
    </div>
  );
}
