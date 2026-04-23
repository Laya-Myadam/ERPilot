import { useState } from "react";
import FastFormulaGenerator from "./FastFormulaGenerator";
import PayrollElementDesigner from "./PayrollElementDesigner";
import PayrollReconciliation from "./PayrollReconciliation";
import ParallelRunChecklist from "./ParallelRunChecklist";
import HDLTemplateGenerator from "./HDLTemplateGenerator";
import HCMConfigWorkbook from "./HCMConfigWorkbook";
import SecurityRoleDesigner from "./SecurityRoleDesigner";
import AbsencePlanDesigner from "./AbsencePlanDesigner";
import OTLScheduleGenerator from "./OTLScheduleGenerator";
import BenefitsConfigGenerator from "./BenefitsConfigGenerator";
import CompensationPlanDesigner from "./CompensationPlanDesigner";
import RecruitingSetupGuide from "./RecruitingSetupGuide";
import HCMLearningTab from "./tabs/HCMLearningTab";
import HCMTalentTab from "./tabs/HCMTalentTab";
import HCMWorkforceTab from "./tabs/HCMWorkforceTab";

const TABS = [
  { id: "core-hcm", label: "Core HCM" },
  { id: "payroll", label: "Payroll" },
  { id: "absence", label: "Absence Mgmt" },
  { id: "otl", label: "Time & Labor" },
  { id: "benefits", label: "Benefits" },
  { id: "compensation", label: "Compensation" },
  { id: "recruiting", label: "Recruiting" },
  { id: "learning", label: "Learning" },
  { id: "talent", label: "Talent Mgmt" },
  { id: "workforce", label: "Workforce" },
];

const CORE_TOOLS = [
  { id: "hdl", label: "HDL Template Generator" },
  { id: "workbook", label: "HCM Config Workbook" },
  { id: "security", label: "Security Role Designer" },
];

const PAYROLL_TOOLS = [
  { id: "fast-formula", label: "Fast Formula Generator" },
  { id: "element", label: "Payroll Element Designer" },
  { id: "recon", label: "Payroll Reconciliation" },
  { id: "parallel", label: "Parallel Run Checklist" },
];


export default function OracleHCMHub() {
  const [activeTab, setActiveTab] = useState("core-hcm");
  const [coreTool, setCoreTool] = useState("hdl");
  const [payrollTool, setPayrollTool] = useState("fast-formula");

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-sm">☁️</div>
            <h1 className="text-2xl font-bold text-white">Oracle Cloud HCM</h1>
          </div>
          <p className="text-zinc-400 text-sm">AI-powered tools for every HCM module — configure, design, and document faster</p>
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
                    ? "bg-accent-cyan text-black"
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

          {/* CORE HCM */}
          {activeTab === "core-hcm" && (
            <div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {CORE_TOOLS.map(t => (
                  <button key={t.id} onClick={() => setCoreTool(t.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      coreTool === t.id
                        ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              {coreTool === "hdl" && <HDLTemplateGenerator />}
              {coreTool === "workbook" && <HCMConfigWorkbook />}
              {coreTool === "security" && <SecurityRoleDesigner />}
            </div>
          )}

          {/* PAYROLL */}
          {activeTab === "payroll" && (
            <div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {PAYROLL_TOOLS.map(t => (
                  <button key={t.id} onClick={() => setPayrollTool(t.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      payrollTool === t.id
                        ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              {payrollTool === "fast-formula" && <FastFormulaGenerator />}
              {payrollTool === "element" && <PayrollElementDesigner />}
              {payrollTool === "recon" && <PayrollReconciliation />}
              {payrollTool === "parallel" && <ParallelRunChecklist />}
            </div>
          )}

          {activeTab === "absence" && <AbsencePlanDesigner />}
          {activeTab === "otl" && <OTLScheduleGenerator />}
          {activeTab === "benefits" && <BenefitsConfigGenerator />}
          {activeTab === "compensation" && <CompensationPlanDesigner />}
          {activeTab === "recruiting" && <RecruitingSetupGuide />}

          {activeTab === "learning" && <HCMLearningTab />}
          {activeTab === "talent" && <HCMTalentTab />}
          {activeTab === "workforce" && <HCMWorkforceTab />}
        </div>
      </div>
    </div>
  );
}
