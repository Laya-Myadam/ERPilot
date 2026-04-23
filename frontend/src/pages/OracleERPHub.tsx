import { useState } from "react";
import GLChartDesigner from "./GLChartDesigner";
import APSetupGenerator from "./APSetupGenerator";
import ERPARTab from "./tabs/ERPARTab";
import ERPFixedAssetsTab from "./tabs/ERPFixedAssetsTab";
import ERPProcurementTab from "./tabs/ERPProcurementTab";
import ERPProjectsTab from "./tabs/ERPProjectsTab";
import ERPCashTab from "./tabs/ERPCashTab";

const TABS = [
  { id: "gl", label: "General Ledger" },
  { id: "ap", label: "Accounts Payable" },
  { id: "ar", label: "Accounts Receivable" },
  { id: "fa", label: "Fixed Assets" },
  { id: "procurement", label: "Procurement" },
  { id: "projects", label: "Project Costing" },
  { id: "cash", label: "Cash Management" },
];


export default function OracleERPHub() {
  const [activeTab, setActiveTab] = useState("gl");

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-sm">💰</div>
            <h1 className="text-2xl font-bold text-white">Oracle Cloud ERP / Finance</h1>
          </div>
          <p className="text-zinc-400 text-sm">AI-powered tools for Oracle Cloud Financials — GL, AP, AR, Fixed Assets, Procurement, and Project Costing</p>
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
                    ? "bg-accent-purple text-white"
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
          {activeTab === "gl" && <GLChartDesigner />}
          {activeTab === "ap" && <APSetupGenerator />}

          {activeTab === "ar" && <ERPARTab />}
          {activeTab === "fa" && <ERPFixedAssetsTab />}
          {activeTab === "procurement" && <ERPProcurementTab />}
          {activeTab === "projects" && <ERPProjectsTab />}
          {activeTab === "cash" && <ERPCashTab />}
        </div>
      </div>
    </div>
  );
}
