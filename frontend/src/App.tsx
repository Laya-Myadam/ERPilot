import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ERPChatbot from './pages/ERPChatbot'
import DocSummarizer from './pages/DocSummarizer'
import ReleaseNotes from './pages/ReleaseNotes'
import SOWGenerator from './pages/SOWGenerator'
import MeetingNotes from './pages/MeetingNotes'
import MigrationAnalyzer from './pages/MigrationAnalyzer'
import IncidentReport from './pages/IncidentReport'
import SQLGenerator from './pages/SQLGenerator'
import ProposalGenerator from './pages/ProposalGenerator'
import ROICalculator from './pages/ROICalculator'
import TestScriptGenerator from './pages/TestScriptGenerator'
import TrainingGenerator from './pages/TrainingGenerator'
import AIOpportunityFinder from './pages/AIOpportunityFinder'
import GoLiveChecklist from './pages/GoLiveChecklist'
import FastFormulaGenerator from './pages/FastFormulaGenerator'
import HDLTemplateGenerator from './pages/HDLTemplateGenerator'
import KBArticleWriter from './pages/KBArticleWriter'
import BattleCardGenerator from './pages/BattleCardGenerator'
import PayrollReconciliation from './pages/PayrollReconciliation'
import AbsencePlanDesigner from './pages/AbsencePlanDesigner'
import PayrollElementDesigner from './pages/PayrollElementDesigner'
import OTLScheduleGenerator from './pages/OTLScheduleGenerator'
import HCMConfigWorkbook from './pages/HCMConfigWorkbook'
import ParallelRunChecklist from './pages/ParallelRunChecklist'
import StatusReportGenerator from './pages/StatusReportGenerator'
import SRTicketWriter from './pages/SRTicketWriter'
import ChangeRequestGenerator from './pages/ChangeRequestGenerator'
import SecurityRoleDesigner from './pages/SecurityRoleDesigner'
import IntegrationSpecGenerator from './pages/IntegrationSpecGenerator'
import KickoffPackGenerator from './pages/KickoffPackGenerator'
import OracleHCMHub from './pages/OracleHCMHub'
import OracleERPHub from './pages/OracleERPHub'
import JDEdwardsHub from './pages/JDEdwardsHub'
import BenefitsConfigGenerator from './pages/BenefitsConfigGenerator'
import CompensationPlanDesigner from './pages/CompensationPlanDesigner'
import RecruitingSetupGuide from './pages/RecruitingSetupGuide'
import GLChartDesigner from './pages/GLChartDesigner'
import APSetupGenerator from './pages/APSetupGenerator'
import JDEMigrationMapper from './pages/JDEMigrationMapper'
import DocumentChatbot from './pages/DocumentChatbot'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-bg-primary">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<ERPChatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/summarizer" element={<DocSummarizer />} />
              <Route path="/release-notes" element={<ReleaseNotes />} />
              <Route path="/sow" element={<SOWGenerator />} />
              <Route path="/meeting-notes" element={<MeetingNotes />} />
              <Route path="/migration" element={<MigrationAnalyzer />} />
              <Route path="/incident" element={<IncidentReport />} />
              <Route path="/sql" element={<SQLGenerator />} />
              <Route path="/proposal" element={<ProposalGenerator />} />
              <Route path="/roi" element={<ROICalculator />} />
              <Route path="/test-scripts" element={<TestScriptGenerator />} />
              <Route path="/training" element={<TrainingGenerator />} />
              <Route path="/ai-opportunity" element={<AIOpportunityFinder />} />
              <Route path="/golive" element={<GoLiveChecklist />} />
              <Route path="/fast-formula" element={<FastFormulaGenerator />} />
              <Route path="/hdl-template" element={<HDLTemplateGenerator />} />
              <Route path="/kb-article" element={<KBArticleWriter />} />
              <Route path="/battle-card" element={<BattleCardGenerator />} />
              <Route path="/payroll-recon" element={<PayrollReconciliation />} />
              <Route path="/absence-plan" element={<AbsencePlanDesigner />} />
              <Route path="/payroll-element" element={<PayrollElementDesigner />} />
              <Route path="/otl-schedule" element={<OTLScheduleGenerator />} />
              <Route path="/hcm-workbook" element={<HCMConfigWorkbook />} />
              <Route path="/parallel-run" element={<ParallelRunChecklist />} />
              <Route path="/status-report" element={<StatusReportGenerator />} />
              <Route path="/sr-ticket" element={<SRTicketWriter />} />
              <Route path="/change-request" element={<ChangeRequestGenerator />} />
              <Route path="/security-role" element={<SecurityRoleDesigner />} />
              <Route path="/integration-spec" element={<IntegrationSpecGenerator />} />
              <Route path="/kickoff-pack" element={<KickoffPackGenerator />} />
              <Route path="/hcm" element={<OracleHCMHub />} />
              <Route path="/erp" element={<OracleERPHub />} />
              <Route path="/jde" element={<JDEdwardsHub />} />
              <Route path="/benefits-config" element={<BenefitsConfigGenerator />} />
              <Route path="/compensation-plan" element={<CompensationPlanDesigner />} />
              <Route path="/recruiting-setup" element={<RecruitingSetupGuide />} />
              <Route path="/gl-designer" element={<GLChartDesigner />} />
              <Route path="/ap-setup" element={<APSetupGenerator />} />
              <Route path="/jde-migration" element={<JDEMigrationMapper />} />
              <Route path="/doc-chat" element={<DocumentChatbot />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
