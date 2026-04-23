import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const fetchDashboardStats = () => api.get('/dashboard/stats').then(r => r.data)

export const chatWithERP = async (message: string, history: {role:string,content:string}[], onChunk: (c: string) => void) => {
  const response = await fetch('/api/chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onChunk(decoder.decode(value))
  }
}

export const summarizeDocument = (document: string, doc_type: string) =>
  api.post('/summarizer/summarize', { document, doc_type }).then(r => r.data)

export const analyzeReleaseNotes = (release_notes: string, client_modules: string[]) =>
  api.post('/release-notes/analyze', { release_notes, client_modules }).then(r => r.data)

export const generateSOW = (data: object) =>
  api.post('/sow/generate', data).then(r => r.data)

export const extractMeetingNotes = (transcript: string, meeting_type: string) =>
  api.post('/meeting-notes/extract', { transcript, meeting_type }).then(r => r.data)

export const analyzeMigration = (data: object) =>
  api.post('/migration/analyze', data).then(r => r.data)

export const draftIncidentReport = (data: object) =>
  api.post('/incident/draft', data).then(r => r.data)

export const generateSQL = (description: string, system: string, tables_hint: string) =>
  api.post('/sql/generate', { description, system, tables_hint }).then(r => r.data)

export const generateProposal = (data: object) =>
  api.post('/proposal/generate', data).then(r => r.data)

export const calculateROI = (data: object) =>
  api.post('/roi/calculate', data).then(r => r.data)

export const generateTestScript = (module: string, system: string, test_type: string, scenario: string) =>
  api.post('/test-scripts/generate', { module, system, test_type, scenario }).then(r => r.data)

export const generateTraining = (module: string, system: string, user_role: string, client_name: string, config_notes: string) =>
  api.post('/training/generate', { module, system, user_role, client_name, config_notes }).then(r => r.data)

export const findAIOpportunity = (client_name: string, industry: string, current_modules: string[], pain_points: string, erp_system: string, company_size: string) =>
  api.post('/ai-opportunity/analyze', { client_name, industry, current_modules, pain_points, erp_system, company_size }).then(r => r.data)

export const generateGoLiveChecklist = (project_name: string, client_name: string, go_live_date: string, modules: string[], erp_system: string, team_size: number, cutover_window: string, special_considerations: string) =>
  api.post('/golive/generate', { project_name, client_name, go_live_date, modules, erp_system, team_size, cutover_window, special_considerations }).then(r => r.data)

export const transcribeAudio = async (blob: Blob): Promise<{ transcript: string }> => {
  const form = new FormData()
  form.append('file', blob, 'recording.webm')
  const res = await api.post('/meeting-notes/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const fetchHistory = (limit = 20) =>
  api.get(`/history?limit=${limit}`).then(r => r.data)

export const generateFastFormula = (data: object) =>
  api.post('/fast-formula/generate', data).then(r => r.data)

export const generateHDLTemplate = (data: object) =>
  api.post('/hdl/generate', data).then(r => r.data)

export const generateKBArticle = (data: object) =>
  api.post('/kb-article/generate', data).then(r => r.data)

export const generateBattleCard = (data: object) =>
  api.post('/battle-card/generate', data).then(r => r.data)

export const generatePayrollRecon = (data: object) =>
  api.post('/payroll-recon/analyze', data).then(r => r.data)

export const generateAbsencePlan = (data: object) =>
  api.post('/absence-plan/design', data).then(r => r.data)

export const generatePayrollElement = (data: object) =>
  api.post('/payroll-element/design', data).then(r => r.data)

export const generateOTLSchedule = (data: object) =>
  api.post('/otl-schedule/generate', data).then(r => r.data)

export const generateHCMWorkbook = (data: object) =>
  api.post('/hcm-workbook/generate', data).then(r => r.data)

export const generateParallelRunChecklist = (data: object) =>
  api.post('/parallel-run/generate', data).then(r => r.data)

export const generateStatusReport = (data: object) =>
  api.post('/status-report/generate', data).then(r => r.data)

export const generateSRTicket = (data: object) =>
  api.post('/sr-ticket/generate', data).then(r => r.data)

export const generateChangeRequest = (data: object) =>
  api.post('/change-request/generate', data).then(r => r.data)

export const generateSecurityRole = (data: object) =>
  api.post('/security-role/design', data).then(r => r.data)

export const generateIntegrationSpec = (data: object) =>
  api.post('/integration-spec/generate', data).then(r => r.data)

export const generateKickoffPack = (data: object) =>
  api.post('/kickoff-pack/generate', data).then(r => r.data)

export const generateBenefitsConfig = (data: object) =>
  api.post('/benefits-config/generate', data).then(r => r.data)

export const generateCompensationPlan = (data: object) =>
  api.post('/compensation-plan/design', data).then(r => r.data)

export const generateRecruitingSetup = (data: object) =>
  api.post('/recruiting-setup/generate', data).then(r => r.data)

export const generateGLDesign = (data: object) =>
  api.post('/gl-designer/design', data).then(r => r.data)

export const generateAPSetup = (data: object) =>
  api.post('/ap-setup/generate', data).then(r => r.data)

export const generateJDEMigrationMap = (data: object) =>
  api.post('/jde-migration/map', data).then(r => r.data)

export const generateHCMLearning = (data: object) =>
  api.post('/hcm-learning/generate', data).then(r => r.data)

export const generateHCMTalent = (data: object) =>
  api.post('/hcm-talent/generate', data).then(r => r.data)

export const generateHCMWorkforce = (data: object) =>
  api.post('/hcm-workforce/generate', data).then(r => r.data)

export const generateERPAR = (data: object) =>
  api.post('/erp-ar/generate', data).then(r => r.data)

export const generateERPFixedAssets = (data: object) =>
  api.post('/erp-fixed-assets/generate', data).then(r => r.data)

export const generateERPProcurement = (data: object) =>
  api.post('/erp-procurement/generate', data).then(r => r.data)

export const generateERPProjects = (data: object) =>
  api.post('/erp-projects/generate', data).then(r => r.data)

export const generateERPCash = (data: object) =>
  api.post('/erp-cash/generate', data).then(r => r.data)

export const generateJDEFinance = (data: object) =>
  api.post('/jde-finance/generate', data).then(r => r.data)

export const generateJDEDistribution = (data: object) =>
  api.post('/jde-distribution/generate', data).then(r => r.data)

export const generateJDEManufacturing = (data: object) =>
  api.post('/jde-manufacturing/generate', data).then(r => r.data)
