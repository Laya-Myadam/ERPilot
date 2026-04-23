import { useState } from "react";
import { generateHDLTemplate } from "../api/client";
import OutputPanel from "../components/ui/OutputPanel";

const BUSINESS_OBJECTS = [
  "Worker", "Person Name", "Person Address", "Assignment", "Salary",
  "Element Entry", "Position", "Job", "Location", "Organization",
  "Grade", "Payroll Relationship", "Absence", "Benefits Enrollment",
  "Person Legislative", "Worker Contract", "HCM Data Loader Loader"
];

const OPERATIONS = ["Load (Create/Update)", "Delete", "Merge"];

export default function HDLTemplateGenerator() {
  const [businessObject, setBusinessObject] = useState("Worker");
  const [operation, setOperation] = useState("Load (Create/Update)");
  const [fieldsNeeded, setFieldsNeeded] = useState("PersonNumber, FirstName, LastName, DateOfBirth, NationalIdentifierType, NationalIdentifier, LegislativeDataGroupName, StartDate");
  const [specialReqs, setSpecialReqs] = useState("US legislation only. Migrating 850 employees from ADP Workforce Now. Employee IDs are 6-digit numeric. Effective date January 1, 2025.");
  const [numRecords, setNumRecords] = useState("850");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    try {
      const data = await generateHDLTemplate({
        business_object: businessObject,
        operation,
        fields_needed: fieldsNeeded,
        special_requirements: specialReqs,
        num_records: numRecords,
      });
      setResult(data.template);
    } catch {
      setResult("Error generating template. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">HCM Data Loader Template</h1>
        <p className="text-zinc-400 mt-1">Generate Oracle HDL file templates for bulk data loads into Oracle Fusion HCM</p>
      </div>

      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Business Object</label>
            <select
              value={businessObject}
              onChange={e => setBusinessObject(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {BUSINESS_OBJECTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Operation</label>
            <select
              value={operation}
              onChange={e => setOperation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
            >
              {OPERATIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Fields / Columns Needed (optional)</label>
          <textarea
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
            placeholder="e.g. PersonNumber, FirstName, LastName, DateOfBirth, NationalIdentifier, LegislativeDataGroupName — or leave blank for all standard fields"
            value={fieldsNeeded}
            onChange={e => setFieldsNeeded(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Special Requirements (optional)</label>
            <textarea
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan resize-none"
              placeholder="e.g. Client uses US legislation only, migrating from legacy system with 5-digit employee IDs, effective date 01-JAN-2024"
              value={specialReqs}
              onChange={e => setSpecialReqs(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Approx. Record Count</label>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-cyan"
              placeholder="e.g. 500"
              value={numRecords}
              onChange={e => setNumRecords(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? "Generating HDL Template..." : "Generate HDL Template"}
        </button>
      </div>

      <OutputPanel content={result} loading={loading} placeholder="Your HDL file template and field guide will appear here." />
    </div>
  );
}
