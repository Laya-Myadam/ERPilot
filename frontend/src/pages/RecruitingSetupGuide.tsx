import { useState } from "react";
import { generateRecruitingSetup } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

export default function RecruitingSetupGuide() {
  const [clientName, setClientName] = useState("Acme Manufacturing Inc.");
  const [jobFamilies, setJobFamilies] = useState("Manufacturing & Operations, Finance & Accounting, Human Resources, Information Technology, Engineering, Sales & Marketing, Supply Chain & Logistics, Executive");
  const [hiringStages, setHiringStages] = useState("New → Application Review → Phone Screen → Hiring Manager Interview → Panel Interview → Reference Check → Offer Extended → Background Check → Offer Accepted → Hired");
  const [offerApprovalLevels, setOfferApprovalLevels] = useState("Hiring Manager proposes offer → HR Compensation reviews → HR Business Partner approves → Director approval for offers >$120K → CHRO for VP+ offers");
  const [backgroundCheckVendor, setBackgroundCheckVendor] = useState("HireRight (criminal, employment verification, education)");
  const [integrations, setIntegrations] = useState("Oracle Cloud HCM Core (new hire conversion), LinkedIn Recruiter (job posting), Indeed (job board sync), HireRight (background check), DocuSign (offer letters)");
  const [annualHireVolume, setAnnualHireVolume] = useState("~280 external hires/year: 180 production/operations, 60 professional/exempt, 40 management");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => {
    setClientName("Acme Manufacturing Inc.");
    setJobFamilies("Manufacturing & Operations, Finance & Accounting, Human Resources, Information Technology, Engineering, Sales & Marketing, Supply Chain & Logistics, Executive");
    setHiringStages("New → Application Review → Phone Screen → Hiring Manager Interview → Panel Interview → Reference Check → Offer Extended → Background Check → Offer Accepted → Hired");
    setOfferApprovalLevels("Hiring Manager proposes offer → HR Compensation reviews → HR Business Partner approves → Director approval for offers >$120K → CHRO for VP+ offers");
    setBackgroundCheckVendor("HireRight (criminal, employment verification, education)");
    setIntegrations("Oracle Cloud HCM Core (new hire conversion), LinkedIn Recruiter (job posting), Indeed (job board sync), HireRight (background check), DocuSign (offer letters)");
    setAnnualHireVolume("~280 external hires/year: 180 production/operations, 60 professional/exempt, 40 management");
  };

  const generate = async () => {
    if (!jobFamilies.trim()) return;
    setLoading(true); setResult("");
    try {
      const data = await generateRecruitingSetup({
        client_name: clientName, job_families: jobFamilies, hiring_stages: hiringStages,
        offer_approval_levels: offerApprovalLevels, background_check_vendor: backgroundCheckVendor,
        integrations, annual_hire_volume: annualHireVolume,
      });
      setResult(data.guide);
    } catch { setResult("Error generating recruiting setup. Check backend connection."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Oracle Recruiting (IRC) Setup Guide</h1>
        <p className="text-zinc-400 mt-1">Configure Oracle Recruiting Cloud — requisition workflows, candidate selection stages, offer management, career site, and vendor integrations</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Annual Hire Volume</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={annualHireVolume} onChange={e => setAnnualHireVolume(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Job Families <span className="text-red-400">*</span></label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={jobFamilies} onChange={e => setJobFamilies(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Hiring Stages (Candidate Selection Workflow)</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={hiringStages} onChange={e => setHiringStages(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Offer Approval Levels</label>
          <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            value={offerApprovalLevels} onChange={e => setOfferApprovalLevels(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Background Check Vendor</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={backgroundCheckVendor} onChange={e => setBackgroundCheckVendor(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Integrations</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              value={integrations} onChange={e => setIntegrations(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={loadSample} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition">Load Sample</button>
          <button onClick={generate} disabled={loading || !jobFamilies.trim()}
            className="flex-1 py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
            {loading ? "Generating Recruiting Setup Guide..." : "Generate Oracle Recruiting Setup Guide"}
          </button>
        </div>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your Oracle Recruiting setup guide will appear here — requisition config, candidate workflow, offer management, career site setup, integrations, and go-live checklist." />
    </div>
  );
}
