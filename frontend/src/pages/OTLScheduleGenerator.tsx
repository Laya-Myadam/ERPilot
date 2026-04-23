import { useState } from "react";
import { generateOTLSchedule } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const PAY_PERIODS = ["Weekly", "Biweekly", "Semi-Monthly", "Monthly"];
const EMPLOYEE_TYPES = ["Hourly Non-Exempt", "Salaried Exempt", "Salaried Non-Exempt", "Part-Time Hourly", "Union / CBA", "Shift Worker"];

export default function OTLScheduleGenerator() {
  const [scheduleName, setScheduleName] = useState("Standard Day Shift — 5x8");
  const [shiftPattern, setShiftPattern] = useState("Monday through Friday, 8:00 AM to 5:00 PM, with a 1-hour unpaid lunch break. Standard 40 hours per week, 8 paid hours per day. No scheduled weekend work. Employees may occasionally work Saturday with manager approval.");
  const [overtimeRules, setOvertimeRules] = useState("Time and a half (1.5x) for all hours worked beyond 40 in a workweek (Sunday–Saturday). Double time (2x) for any hours worked on the 7th consecutive day regardless of total weekly hours. No daily overtime threshold except California employees who get OT after 8 hours in a day.");
  const [employeeType, setEmployeeType] = useState("Hourly Non-Exempt");
  const [payPeriod, setPayPeriod] = useState("Biweekly");
  const [legislation, setLegislation] = useState("US");
  const [specialRules, setSpecialRules] = useState("Holiday pay at straight time for 10 company holidays. On-call premium of $50 per day when on the on-call rotation. Shift differential of $2/hour for any hours worked after 6:00 PM.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!shiftPattern.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const data = await generateOTLSchedule({
        schedule_name: scheduleName,
        shift_pattern: shiftPattern,
        overtime_rules: overtimeRules,
        employee_type: employeeType,
        pay_period: payPeriod,
        legislation,
        special_rules: specialRules,
      });
      setResult(data.schedule);
    } catch {
      setResult("Error generating schedule. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">OTL Work Schedule Generator</h1>
        <p className="text-zinc-400 mt-1">Input a shift pattern — get the complete Oracle Time and Labor configuration spec with overtime rules and payroll integration</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Schedule Name (optional)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Standard Day Shift — 5x8" value={scheduleName} onChange={e => setScheduleName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Type</label>
            <select value={employeeType} onChange={e => setEmployeeType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {EMPLOYEE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Shift Pattern <span className="text-red-400">*</span></label>
          <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Monday–Friday, 8:00 AM to 5:00 PM, 1 hour unpaid lunch. 40 hours/week standard. OR: 4x10 schedule (Mon–Thu 7am–6pm, 10 hrs/day, 30 min paid break). OR: 3-shift rotation: Day (6am–2pm), Evening (2pm–10pm), Night (10pm–6am), rotating weekly."
            value={shiftPattern} onChange={e => setShiftPattern(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Overtime Rules (optional)</label>
          <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. Time and a half after 40 hours/week. Double time after 12 hours in a single day (California). Consecutive day premium: double time on 7th consecutive day regardless of total hours."
            value={overtimeRules} onChange={e => setOvertimeRules(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Pay Period</label>
            <select value={payPeriod} onChange={e => setPayPeriod(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              {PAY_PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Legislation</label>
            <select value={legislation} onChange={e => setLegislation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan">
              <option>US</option>
              <option>Canada</option>
              <option>UK</option>
              <option>Australia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Special Rules (optional)</label>
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. Holiday pay at 1.5x, on-call premium $50/day"
              value={specialRules} onChange={e => setSpecialRules(e.target.value)} />
          </div>
        </div>

        <button onClick={generate} disabled={loading || !shiftPattern.trim()}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition">
          {loading ? "Generating OTL Schedule..." : "Generate OTL Work Schedule Spec"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your OTL work schedule configuration spec will appear here — shifts, overtime rules, payroll element mapping, and test scenarios." />
    </div>
  );
}
