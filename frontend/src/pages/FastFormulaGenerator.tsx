import { useState } from "react";
import { generateFastFormula } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const FORMULA_TYPES = ["Payroll", "Absence Management", "Proration", "Element Skip", "Validation", "Compensation", "Benefits", "Time and Labor"];

export default function FastFormulaGenerator() {
  const [formulaType, setFormulaType] = useState("Payroll");
  const [description, setDescription] = useState("Calculate overtime pay at 1.5x the hourly rate for all hours worked beyond 40 in a week. If the employee is salaried exempt (grade EX1 through EX5), return 0. Apply a weekly cap of $500 on overtime earnings.");
  const [elementName, setElementName] = useState("WEEKLY_OVERTIME_PAY");
  const [inputs, setInputs] = useState("HOURS_WORKED, HOURLY_RATE, SALARY_GRADE");
  const [expectedOutput, setExpectedOutput] = useState("OVERTIME_AMOUNT — numeric dollar value, minimum 0");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateFastFormula({
        formula_type: formulaType,
        description,
        element_name: elementName,
        inputs,
        expected_output: expectedOutput,
      });
      setResult(data.formula);
    } catch {
      setResult("Error generating formula. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fast Formula Generator</h1>
        <p className="text-zinc-400 mt-1">Generate Oracle HCM Fast Formulas from plain English business rules</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Formula Type</label>
            <select
              value={formulaType}
              onChange={e => setFormulaType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {FORMULA_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Element Name (optional)</label>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. OVERTIME_PAY"
              value={elementName}
              onChange={e => setElementName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Business Rule / Description <span className="text-red-400">*</span></label>
          <textarea
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Calculate overtime pay at 1.5x rate for hours worked beyond 40 in a week. If employee is exempt (salary grade EX1-EX5), return 0. Include a cap of $500 per week."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Inputs / Variables (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. HOURS_WORKED, SALARY_GRADE, HOURLY_RATE"
              value={inputs}
              onChange={e => setInputs(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Expected Return / Output (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. OVERTIME_AMOUNT (numeric dollar value)"
              value={expectedOutput}
              onChange={e => setExpectedOutput(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !description.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? "Generating Formula..." : "Generate Fast Formula"}
        </button>
      </div>


      <OutputPanel content={result} loading={loading} placeholder="Your generated Fast Formula will appear here with syntax highlighting and explanation." />
    </div>
  );
}
