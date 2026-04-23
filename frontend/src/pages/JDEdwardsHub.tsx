import { useState } from "react";
import JDEMigrationMapper from "./JDEMigrationMapper";
import JDEFinanceTab from "./tabs/JDEFinanceTab";
import JDEDistributionTab from "./tabs/JDEDistributionTab";
import JDEManufacturingTab from "./tabs/JDEManufacturingTab";

const TABS = [
  { id: "hr-payroll", label: "HR / Payroll (07)" },
  { id: "finance", label: "Finance (09)" },
  { id: "distribution", label: "Distribution (41–43)" },
  { id: "manufacturing", label: "Manufacturing (30–40)" },
];


export default function JDEdwardsHub() {
  const [activeTab, setActiveTab] = useState("hr-payroll");

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm">🏭</div>
            <h1 className="text-2xl font-bold text-white">JD Edwards EnterpriseOne</h1>
          </div>
          <p className="text-zinc-400 text-sm">Migration mapping, configuration analysis, and upgrade tools for JD Edwards EnterpriseOne</p>
        </div>
      </div>

      {/* Module Tab Bar */}
      <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-black"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">

          {/* HR/Payroll — JDE Migration Mapper + planned tools */}
          {activeTab === "hr-payroll" && (
            <div className="space-y-8">
              <JDEMigrationMapper />
            </div>
          )}

          {activeTab === "finance" && <JDEFinanceTab />}
          {activeTab === "distribution" && <JDEDistributionTab />}
          {activeTab === "manufacturing" && <JDEManufacturingTab />}
        </div>
      </div>
    </div>
  );
}
