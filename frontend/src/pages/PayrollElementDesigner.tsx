import { useState } from "react";
import { generatePayrollElement } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const CLASSIFICATIONS = [
  "Standard Earnings", "Supplemental Earnings", "Imputed Earnings",
  "Pre-Tax Deductions", "Post-Tax Deductions", "Involuntary Deductions",
  "Employer Charges / Liabilities", "Information", "Absence Earnings"
];
const CALC_RULES = ["Flat Amount", "Hours x Rate", "Units x Rate", "Percentage of Earnings", "Fast Formula", "No Calculation"];
const LEGISLATIONS = ["US", "Canada", "UK", "Australia", "India"];

export default function PayrollElementDesigner() {
  const [elementName, setElementName] = useState("QUARTERLY_PERFORMANCE_BONUS");
  const [description, setDescription] = useState("Quarterly performance bonus paid to all active employees. Amount is determined by performance rating: Exceeds Expectations = 10% of base salary, Meets Expectations = 5% of base salary, Below Expectations = 0%. Paid in the first payroll of the month following quarter-end.");
  const [classification, setClassification] = useState("Supplemental Earnings");
  const [calcRule, setCalcRule] = useState("Percentage of Earnings");
  const [legislation, setLegislation] = useState("US");
  const [recurring, setRecurring] = useState("Non-Recurring");
  const [taxability, setTaxability] = useState("Subject to Federal Income Tax (supplemental rate 22%) and State Income Tax. Subject to FICA (Social Security and Medicare). Reported on W-2 Box 1.");
  const [specialRules, setSpecialRules] = useState("Only process in January, April, July, October payrolls. Exclude employees terminated before the last day of the quarter. Exclude employees on unpaid leave for more than 30 days in the quarter.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!elementName.trim() || !description.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generatePayrollElement({
        element_name: elementName,
        description,
        classification,
        calculation_rule: calcRule,
        legislation,
        recurring,
        taxability,
        special_rules: specialRules,
      });
      setResult(data.element);
    } catch {
      setResult("Error generating element. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Element Designer</h1>
        <p className="text-zinc-400 mt-1">Describe a pay component — get the complete Oracle Cloud Payroll element specification with input values, balances, and formula</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Element Name <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan font-mono"
              placeholder="e.g. QUARTERLY_BONUS or Car Allowance" value={elementName} onChange={e => setElementName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Primary Classification</label>
            <select value={classification} onChange={e => setClassification(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {CLASSIFICATIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Business Description <span className="text-red-400">*</span></label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Quarterly performance bonus paid to all employees. Amount varies by performance rating: Exceeds=10% of salary, Meets=5%, Below=0%. Subject to federal and state income tax but not FICA."
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Calculation Rule</label>
            <select value={calcRule} onChange={e => setCalcRule(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {CALC_RULES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Recurring</label>
            <select value={recurring} onChange={e => setRecurring(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option>Recurring</option>
              <option>Non-Recurring</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select value={legislation} onChange={e => setLegislation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {LEGISLATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Tax Treatment (optional)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Subject to FIT and SIT, exempt from FICA, reported on W-2 Box 14"
              value={taxability} onChange={e => setTaxability(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Special Rules (optional)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Only process in March payroll, exclude terminated employees"
              value={specialRules} onChange={e => setSpecialRules(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !elementName.trim() || !description.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Designing Element..." : "Generate Payroll Element Spec"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your payroll element spec will appear here — input values, balance feeds, formula, tax treatment, and configuration steps." />
    </div>
  );
}
