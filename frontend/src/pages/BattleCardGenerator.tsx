import { useState } from "react";
import { generateBattleCard } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const COMPETITORS = [
  "Accenture", "Deloitte", "PwC", "KPMG", "IBM",
  "Workday (SI)", "SAP (SI)", "Infosys", "Wipro", "Cognizant",
  "EY", "Capgemini", "HCL", "TCS", "Infor"
];

const INDUSTRIES = ["Manufacturing", "Healthcare", "Government / Public Sector", "Financial Services", "Retail", "Energy & Utilities", "Higher Education", "Non-Profit", "Professional Services"];

export default function BattleCardGenerator() {
  const [competitor, setCompetitor] = useState("Accenture");
  const [dealContext, setDealContext] = useState("900-person manufacturing company currently on Oracle EBS 12.2, evaluating an upgrade to Oracle Fusion Cloud HCM and ERP. Accenture is proposing a 26-month implementation at $4.1M with a team of 18 consultants, most of whom are generalists. We are proposing a phased 18-month approach at $2.4M with a dedicated Oracle-only team.");
  const [clientIndustry, setClientIndustry] = useState("Manufacturing");
  const [painPoints, setPainPoints] = useState("Their last ERP implementation (SAP, 2018) went 60% over budget and 8 months late. They want a dedicated team, not consultants rotating off after go-live. CFO is specifically concerned about post-go-live managed services support quality.");
  const [modulesInScope, setModulesInScope] = useState("Oracle Fusion Cloud HCM (Core HCM, Payroll, Absence, OTL), Oracle ERP Cloud (GL, AP, AR, Fixed Assets, Procurement)");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!dealContext.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateBattleCard({
        competitor,
        deal_context: dealContext,
        client_industry: clientIndustry,
        pain_points: painPoints,
        modules_in_scope: modulesInScope,
      });
      setResult(data.battle_card);
    } catch {
      setResult("Error generating battle card. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Battle Card Generator</h1>
        <p className="text-zinc-400 mt-1">Competitive intelligence cards to position Denovo against any competitor — for internal sales use</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Competitor</label>
            <select
              value={competitor}
              onChange={e => setCompetitor(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {COMPETITORS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Client Industry</label>
            <select
              value={clientIndustry}
              onChange={e => setClientIndustry(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Deal Context <span className="text-red-400">*</span></label>
          <textarea
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. 800-person manufacturing company, currently on Oracle EBS 12.2, evaluating Oracle Fusion Cloud upgrade. Accenture is proposing a 24-month implementation at $3.2M. We're proposing a phased approach at $1.8M over 18 months."
            value={dealContext}
            onChange={e => setDealContext(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Known Client Pain Points (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. Last implementation went over budget by 40%, want dedicated Oracle experts not generalists, concerned about post-go-live support"
              value={painPoints}
              onChange={e => setPainPoints(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Oracle Modules in Scope (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. Oracle Fusion HCM, Payroll, Recruiting, Oracle ERP Cloud Financials, Procurement"
              value={modulesInScope}
              onChange={e => setModulesInScope(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !dealContext.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-purple text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? "Building Battle Card..." : `Generate Battle Card vs ${competitor}`}
        </button>
      </div>

      {result && (
        <div className="flex items-center gap-2 -mb-2">
          <span className="text-xs bg-red-900/40 text-red-300 border border-red-800 px-2 py-0.5 rounded font-medium">INTERNAL USE ONLY</span>
        </div>
      )}
      <OutputPanel content={result} loading={loading} placeholder="Your battle card will appear here — competitor weaknesses, Denovo differentiators, landmine questions, and objection handling." />
    </div>
  );
}
