# Denovo AI Platform

> AI-powered consulting intelligence suite for Oracle JD Edwards & Oracle Cloud — built for Denovo's 300+ ERP consultants.

Built on **Groq + LLaMA 3.3 70B** with real-time streaming, RAG-powered knowledge base, voice transcription, document Q&A, and a SQLite history store.

---

## The Problem

Oracle ERP consultants spend enormous time on repetitive knowledge work:

- Writing SOWs, proposals, and training guides from scratch every engagement
- Manually building go-live checklists and test scripts
- Turning meeting recordings into structured action items
- Writing Oracle SQL for business users who can't do it themselves
- Configuring HCM modules (payroll elements, absence plans, fast formulas) without AI assistance
- Mapping JDE modules to Oracle Cloud equivalents during migrations

**Denovo AI eliminates all of this.**

---

## Features — 48 AI Tools

### Consultant Delivery
| Tool | What it does |
|------|-------------|
| **ERP Chatbot** | Conversational Q&A on JDE & Oracle Cloud with streaming responses and RAG-powered knowledge base |
| **Document Chatbot** | Upload PDF, DOCX, or TXT → instant plain-English summary → unlimited Q&A grounded in the document |
| **Doc Summarizer** | Paste any SOW, RFP, or manual — get a structured executive summary |
| **SQL Generator** | Describe data needs in plain English, get production-ready Oracle SQL with table hints |
| **Incident Report** | Input error logs and severity — draft a professional incident report in 30 seconds |
| **Meeting Notes + Voice** | Record audio or paste transcript — AI extracts action items, decisions, owners, and blockers |
| **Release Notes Analyzer** | Paste Oracle release notes, select client modules — get prioritized impact analysis |
| **KB Article Writer** | Turn known issues or workarounds into formatted Oracle knowledge base articles |
| **SR Ticket Writer** | Draft a structured Oracle Support SR with correct severity, impact, and reproduction steps |
| **Status Report Generator** | Project data → weekly/monthly executive status report with RAG/RAID |
| **Change Request Generator** | Impact analysis + approvals → formatted change request document |

### Pre-Sales & Sales
| Tool | What it does |
|------|-------------|
| **Proposal Generator** | Client name, industry, pain points → full tailored Oracle ERP sales proposal |
| **ROI Calculator** | Input project parameters → executive ROI narrative with financial projections |
| **Oracle AI Finder** | Map client pain points to Oracle AI Cloud products (FAW, ODA, AI for Finance, OCI AI) |
| **SOW Generator** | Project details + modules → complete Statement of Work with phases, deliverables, and pricing |
| **Battle Card Generator** | Competitive positioning cards — Denovo vs. competitors by module and vertical |
| **Kickoff Pack Generator** | Project kickoff package — agenda, RACI, norms, risk register, and communication plan |

### Project Execution
| Tool | What it does |
|------|-------------|
| **Migration Analyzer** | Current/target system + customizations → readiness score, risk assessment, and migration roadmap |
| **Test Script Generator** | Module + scenario → full UAT/regression test scripts with steps, expected results, and sign-off table |
| **Go-Live Checklist** | Project details + go-live date → complete cutover runbook with T-2 week tasks, night-of schedule, and rollback plan |
| **Integration Spec Generator** | Source/target system details → full integration specification document with field mappings |

### Oracle Cloud HCM
| Tool | What it does |
|------|-------------|
| **Fast Formula Generator** | Business rule description → Oracle HCM Fast Formula with syntax and test cases |
| **HDL Template Generator** | HCM data load templates with field mapping, validation rules, and load sequence |
| **Payroll Element Designer** | Configure Oracle payroll elements — classifications, input values, formulas, and balance feeds |
| **Payroll Reconciliation Analyzer** | Analyze payroll variance reports and generate reconciliation action plans |
| **Absence Plan Designer** | Design Oracle Absence Management plans — accrual rules, eligibility, and carryover policies |
| **OTL Schedule Generator** | Build Oracle Time & Labor work schedules, shift patterns, and overtime rules |
| **HCM Config Workbook** | Generate structured configuration workbooks for HCM module setup |
| **Parallel Run Checklist** | Payroll parallel run plan — comparison methodology, variance thresholds, and sign-off criteria |
| **Security Role Designer** | Design Oracle HCM security roles — data roles, job roles, and abstract role assignments |
| **Benefits Config Generator** | Configure Oracle Benefits — plan types, eligibility, life events, and enrollment rules |
| **Compensation Plan Designer** | Design compensation plans — salary grades, merit matrices, and bonus plan rules |
| **Recruiting Setup Guide** | Configure Oracle Recruiting — requisition templates, offer approvals, and candidate workflows |
| **HCM Learning** | Course catalog setup, learning path design, compliance training config, and certification programs |
| **HCM Talent Management** | Performance review templates, goal-setting frameworks, succession planning, and talent profiles |
| **HCM Workforce Management** | Scheduling rules, labor demand forecasting, WFM compliance, and shift pattern generation |

### Oracle Cloud ERP / Finance
| Tool | What it does |
|------|-------------|
| **GL Chart of Accounts Designer** | Design Oracle Cloud COA — segments, value sets, account hierarchies, and cross-validation rules |
| **AP Setup Generator** | Configure Oracle AP — payment terms, invoice approval, supplier setup, and payment formats |
| **Accounts Receivable** | AR process setup, customer credit policy, collections workflow, and revenue recognition |
| **Fixed Assets** | Asset category setup, depreciation rules, asset migration mapping, and retirement workflows |
| **Procurement** | Procurement policy design, approval hierarchies, supplier qualification, and contract setup |
| **Project Costing** | Project types, cost collection rules, billing setup, and budget configuration |
| **Cash Management** | Bank reconciliation config, cash forecasting, bank account setup, and intercompany netting |

### JD Edwards EnterpriseOne
| Tool | What it does |
|------|-------------|
| **JDE Migration Mapper** | HR/Payroll (07) field-by-field mapping from JDE to Oracle Cloud HCM |
| **JDE Finance (09)** | GL migration mapping, COA rationalization, period close comparison, and BU → Legal Entity mapping |
| **JDE Distribution (41–43)** | Item master migration, supplier/customer cleansing, open order migration, and branch/plant mapping |
| **JDE Manufacturing (30–40)** | BOM/routing migration, work order migration, JDE → Oracle SCM mapping, shop floor control migration |

### Knowledge & Training
| Tool | What it does |
|------|-------------|
| **Training Generator** | Module + user role → complete end-user training guide with menu paths, procedures, and exercises |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Engine** | Groq API — LLaMA 3.3 70B Versatile (multi-key rotation supported) |
| **Voice Transcription** | Groq Whisper Large v3 |
| **Backend** | Python 3.13 · FastAPI · Uvicorn |
| **Document Parsing** | pdfplumber (PDF) · python-docx (DOCX) · plain decode (TXT) |
| **Database** | SQLite via SQLAlchemy — auto-created, stores all generation history |
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP** | Axios · Fetch (streaming) |

---

## Project Structure

```
denovo-ai/
├── backend/
│   ├── main.py                      # FastAPI app, all router registrations
│   ├── database.py                  # SQLite setup, history model
│   ├── requirements.txt
│   ├── .env                         # GROQ_API_KEY
│   ├── services/
│   │   ├── groq_client.py           # Groq client, multi-key rotation, chat/stream/whisper
│   │   └── rag_service.py           # RAG knowledge base
│   ├── data/
│   │   └── knowledge_base.py        # Oracle ERP knowledge
│   └── routers/
│       ├── chatbot.py
│       ├── doc_chat.py              # Document upload + Q&A (PDF/DOCX/TXT)
│       ├── summarizer.py
│       ├── release_notes.py
│       ├── sow.py
│       ├── meeting_notes.py         # + voice transcription endpoint
│       ├── migration.py
│       ├── incident.py
│       ├── sql_gen.py
│       ├── proposal.py
│       ├── roi.py
│       ├── test_scripts.py
│       ├── training.py
│       ├── ai_opportunity.py
│       ├── golive.py
│       ├── fast_formula.py
│       ├── hdl_template.py
│       ├── kb_article.py
│       ├── battle_card.py
│       ├── payroll_recon.py
│       ├── absence_plan.py
│       ├── payroll_element.py
│       ├── otl_schedule.py
│       ├── hcm_workbook.py
│       ├── parallel_run.py
│       ├── status_report.py
│       ├── sr_ticket.py
│       ├── change_request.py
│       ├── security_role.py
│       ├── integration_spec.py
│       ├── kickoff_pack.py
│       ├── benefits_config.py
│       ├── compensation_plan.py
│       ├── recruiting_setup.py
│       ├── gl_designer.py
│       ├── ap_setup.py
│       ├── jde_migration_map.py
│       ├── hcm_learning.py
│       ├── hcm_talent.py
│       ├── hcm_workforce.py
│       ├── erp_ar.py
│       ├── erp_fixed_assets.py
│       ├── erp_procurement.py
│       ├── erp_projects.py
│       ├── erp_cash.py
│       ├── jde_finance.py
│       ├── jde_distribution.py
│       └── jde_manufacturing.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Router + layout
│   │   ├── index.css                # Dark theme (Obsidian)
│   │   ├── api/
│   │   │   └── client.ts            # All API calls
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── CommandPalette.tsx   # Ctrl+K search
│   │   │   └── ui/
│   │   │       ├── OutputPanel.tsx
│   │   │       └── Spinner.tsx
│   │   └── pages/
│   │       ├── Dashboard.tsx
│   │       ├── ERPChatbot.tsx
│   │       ├── DocumentChatbot.tsx  # Upload PDF/DOCX/TXT → summary + Q&A
│   │       ├── DocSummarizer.tsx
│   │       ├── ReleaseNotes.tsx
│   │       ├── SOWGenerator.tsx
│   │       ├── MeetingNotes.tsx
│   │       ├── MigrationAnalyzer.tsx
│   │       ├── IncidentReport.tsx
│   │       ├── SQLGenerator.tsx
│   │       ├── ProposalGenerator.tsx
│   │       ├── ROICalculator.tsx
│   │       ├── TestScriptGenerator.tsx
│   │       ├── TrainingGenerator.tsx
│   │       ├── AIOpportunityFinder.tsx
│   │       ├── GoLiveChecklist.tsx
│   │       ├── FastFormulaGenerator.tsx
│   │       ├── HDLTemplateGenerator.tsx
│   │       ├── KBArticleWriter.tsx
│   │       ├── BattleCardGenerator.tsx
│   │       ├── PayrollReconciliation.tsx
│   │       ├── AbsencePlanDesigner.tsx
│   │       ├── PayrollElementDesigner.tsx
│   │       ├── OTLScheduleGenerator.tsx
│   │       ├── HCMConfigWorkbook.tsx
│   │       ├── ParallelRunChecklist.tsx
│   │       ├── StatusReportGenerator.tsx
│   │       ├── SRTicketWriter.tsx
│   │       ├── ChangeRequestGenerator.tsx
│   │       ├── SecurityRoleDesigner.tsx
│   │       ├── IntegrationSpecGenerator.tsx
│   │       ├── KickoffPackGenerator.tsx
│   │       ├── BenefitsConfigGenerator.tsx
│   │       ├── CompensationPlanDesigner.tsx
│   │       ├── RecruitingSetupGuide.tsx
│   │       ├── GLChartDesigner.tsx
│   │       ├── APSetupGenerator.tsx
│   │       ├── JDEMigrationMapper.tsx
│   │       ├── OracleHCMHub.tsx     # HCM module hub (10 tabs)
│   │       ├── OracleERPHub.tsx     # ERP/Finance hub (7 tabs)
│   │       ├── JDEdwardsHub.tsx     # JDE hub (4 tabs)
│   │       └── tabs/                # Hub sub-tab components
│   │           ├── HCMLearningTab.tsx
│   │           ├── HCMTalentTab.tsx
│   │           ├── HCMWorkforceTab.tsx
│   │           ├── ERPARTab.tsx
│   │           ├── ERPFixedAssetsTab.tsx
│   │           ├── ERPProcurementTab.tsx
│   │           ├── ERPProjectsTab.tsx
│   │           ├── ERPCashTab.tsx
│   │           ├── JDEFinanceTab.tsx
│   │           ├── JDEDistributionTab.tsx
│   │           └── JDEManufacturingTab.tsx
│   ├── tailwind.config.js
│   └── vite.config.ts
├── PITCH.html                       # Single-page pitch diagram (open in browser)
└── README.md
```

---

## Setup

### Prerequisites
- Python 3.13
- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Backend

```bash
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Add your Groq API key
echo GROQ_API_KEY=your_key_here > .env

# (Optional) Add a second key to double effective rate limit
echo GROQ_API_KEY_2=your_second_key_here >> .env

# Start the server
uvicorn main:app --reload --port 8000
```

The SQLite database (`denovo_ai.db`) is created automatically on first startup.

#### Groq rate limits

The free tier allows ~6,000 tokens/minute. Heavy tools (Go-Live Checklist, SOW, Test Scripts) consume 2,000–4,000 tokens per request. To increase throughput, set multiple keys — `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, etc. The backend rotates across all configured keys automatically on every request.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/stats` | Platform metrics |
| GET | `/api/history` | Recent generation history |
| POST | `/api/chatbot/chat` | Streaming ERP Q&A |
| POST | `/api/doc-chat/upload` | Upload PDF/DOCX/TXT — returns session_id + char count |
| POST | `/api/doc-chat/chat` | Streaming Q&A grounded in uploaded document |
| DELETE | `/api/doc-chat/session/{id}` | Release document session from memory |
| POST | `/api/summarizer/summarize` | Document summarization |
| POST | `/api/release-notes/analyze` | Release notes analysis |
| POST | `/api/sow/generate` | SOW generation |
| POST | `/api/meeting-notes/extract` | Meeting notes extraction |
| POST | `/api/meeting-notes/transcribe` | Voice → text (Whisper) |
| POST | `/api/migration/analyze` | Migration readiness |
| POST | `/api/incident/draft` | Incident report |
| POST | `/api/sql/generate` | SQL generation |
| POST | `/api/proposal/generate` | Sales proposal |
| POST | `/api/roi/calculate` | ROI calculation |
| POST | `/api/test-scripts/generate` | Test script generation |
| POST | `/api/training/generate` | Training material |
| POST | `/api/ai-opportunity/analyze` | Oracle AI opportunity mapping |
| POST | `/api/golive/generate` | Go-live checklist |
| POST | `/api/fast-formula/generate` | Fast Formula generation |
| POST | `/api/hdl/generate` | HDL template generation |
| POST | `/api/kb-article/generate` | KB article writing |
| POST | `/api/battle-card/generate` | Battle card generation |
| POST | `/api/payroll-recon/analyze` | Payroll reconciliation analysis |
| POST | `/api/absence-plan/design` | Absence plan design |
| POST | `/api/payroll-element/design` | Payroll element design |
| POST | `/api/otl-schedule/generate` | OTL work schedule generation |
| POST | `/api/hcm-workbook/generate` | HCM config workbook |
| POST | `/api/parallel-run/generate` | Parallel run checklist |
| POST | `/api/status-report/generate` | Status report generation |
| POST | `/api/sr-ticket/generate` | Oracle SR ticket writing |
| POST | `/api/change-request/generate` | Change request generation |
| POST | `/api/security-role/design` | Security role design |
| POST | `/api/integration-spec/generate` | Integration spec generation |
| POST | `/api/kickoff-pack/generate` | Project kickoff pack |
| POST | `/api/benefits-config/generate` | Benefits configuration |
| POST | `/api/compensation-plan/design` | Compensation plan design |
| POST | `/api/recruiting-setup/generate` | Recruiting setup guide |
| POST | `/api/gl-designer/design` | GL chart of accounts design |
| POST | `/api/ap-setup/generate` | AP setup generation |
| POST | `/api/jde-migration/map` | JDE HR/Payroll migration mapping |
| POST | `/api/hcm-learning/generate` | HCM Learning configuration |
| POST | `/api/hcm-talent/generate` | HCM Talent Management configuration |
| POST | `/api/hcm-workforce/generate` | HCM Workforce Management configuration |
| POST | `/api/erp-ar/generate` | AR setup generation |
| POST | `/api/erp-fixed-assets/generate` | Fixed Assets configuration |
| POST | `/api/erp-procurement/generate` | Procurement setup generation |
| POST | `/api/erp-projects/generate` | Project Costing configuration |
| POST | `/api/erp-cash/generate` | Cash Management configuration |
| POST | `/api/jde-finance/generate` | JDE Finance (09) migration tools |
| POST | `/api/jde-distribution/generate` | JDE Distribution (41–43) migration tools |
| POST | `/api/jde-manufacturing/generate` | JDE Manufacturing (30–40) migration tools |

---

## UI Features

- **Dark Obsidian theme** — zinc/charcoal backgrounds, teal + violet accents
- **Command palette** — `Ctrl+K` / `⌘K` to search and navigate all tools
- **Streaming responses** — real-time token-by-token output on chatbot and document Q&A
- **Document Chatbot** — drag-and-drop upload (PDF/DOCX/TXT), auto plain-English summary, then unlimited Q&A grounded in the document (up to 60k characters)
- **Voice recording** — browser MediaRecorder → Groq Whisper transcription
- **Hub pages** — Oracle HCM, Oracle ERP, and JD Edwards hubs with tabbed navigation
- **Pre-filled defaults** — every tool ships with realistic sample data for instant demos
- **Copy to clipboard** — one-click copy on all AI outputs
- **Generation history** — every output auto-saved to SQLite

---

## Key Demo Scenarios

### For a sales/pitch demo (no backend needed)
1. Open dashboard — loads with full mock metrics and charts
2. Press `Ctrl+K` — shows command palette with all tools
3. Navigate to any hub to show the multi-tab UI

### For a live demo (backend running)
1. **Document Chatbot** → upload `sample_document.txt` (included in repo) → auto summary → ask "what are the top risks?" or "when is go-live?"
2. **Oracle AI Finder** → Load Sample → Generate → shows Oracle AI product recommendations
3. **Go-Live Checklist** → Load Sample → Generate → shows full cutover runbook
4. **JDE Finance (09)** → GL Migration → Generate → shows JDE → Oracle Cloud GL field mapping
5. **HCM Fast Formula** → Load Sample → Generate → shows Oracle HCM formula with test cases
6. **Meeting Notes** → Load Sample → Extract → shows action items table

---

## Oracle AI Cloud Alignment

The **Oracle AI Finder** tool specifically supports Denovo's Oracle AI Cloud practice by:

- Mapping client pain points to specific Oracle AI products (FAW, ODA, OCI AI Services, AI for Finance, Supply Chain AI)
- Generating prioritized opportunity assessments with implementation effort and revenue estimates
- Identifying quick wins (demonstrable in 30 days)
- Producing demo scenario recommendations tailored to the client's industry and ERP setup
