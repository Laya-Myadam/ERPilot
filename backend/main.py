from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chatbot, summarizer, release_notes, sow, meeting_notes, migration, incident, sql_gen, proposal, roi, test_scripts, training, ai_opportunity, golive, fast_formula, hdl_template, kb_article, battle_card, payroll_recon, absence_plan, payroll_element, otl_schedule, hcm_workbook, parallel_run, status_report, sr_ticket, change_request, security_role, integration_spec, kickoff_pack, benefits_config, compensation_plan, recruiting_setup, gl_designer, ap_setup, jde_migration_map, hcm_learning, hcm_talent, hcm_workforce, erp_ar, erp_fixed_assets, erp_procurement, erp_projects, erp_cash, jde_finance, jde_distribution, jde_manufacturing
from database import init_db, SessionLocal, GenerationHistory
from sqlalchemy import desc

app = FastAPI(title="Denovo AI Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cloud Run frontend URL is dynamic — restrict after deployment if needed
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(chatbot.router, prefix="/api/chatbot", tags=["ERP Chatbot"])
app.include_router(summarizer.router, prefix="/api/summarizer", tags=["Doc Summarizer"])
app.include_router(release_notes.router, prefix="/api/release-notes", tags=["Release Notes"])
app.include_router(sow.router, prefix="/api/sow", tags=["SOW Generator"])
app.include_router(meeting_notes.router, prefix="/api/meeting-notes", tags=["Meeting Notes"])
app.include_router(migration.router, prefix="/api/migration", tags=["Migration Analyzer"])
app.include_router(incident.router, prefix="/api/incident", tags=["Incident Report"])
app.include_router(sql_gen.router, prefix="/api/sql", tags=["SQL Generator"])
app.include_router(proposal.router, prefix="/api/proposal", tags=["Proposal Generator"])
app.include_router(roi.router, prefix="/api/roi", tags=["ROI Calculator"])
app.include_router(test_scripts.router, prefix="/api/test-scripts", tags=["Test Script Generator"])
app.include_router(training.router, prefix="/api/training", tags=["Training Material Generator"])
app.include_router(ai_opportunity.router, prefix="/api/ai-opportunity", tags=["Oracle AI Opportunity Finder"])
app.include_router(golive.router, prefix="/api/golive", tags=["Go-Live Checklist Generator"])
app.include_router(fast_formula.router, prefix="/api/fast-formula", tags=["Fast Formula Generator"])
app.include_router(hdl_template.router, prefix="/api/hdl", tags=["HDL Template Generator"])
app.include_router(kb_article.router, prefix="/api/kb-article", tags=["KB Article Writer"])
app.include_router(battle_card.router, prefix="/api/battle-card", tags=["Battle Card Generator"])
app.include_router(payroll_recon.router, prefix="/api/payroll-recon", tags=["Payroll Reconciliation Analyzer"])
app.include_router(absence_plan.router, prefix="/api/absence-plan", tags=["Absence Plan Designer"])
app.include_router(payroll_element.router, prefix="/api/payroll-element", tags=["Payroll Element Designer"])
app.include_router(otl_schedule.router, prefix="/api/otl-schedule", tags=["OTL Work Schedule Generator"])
app.include_router(hcm_workbook.router, prefix="/api/hcm-workbook", tags=["HCM Configuration Workbook"])
app.include_router(parallel_run.router, prefix="/api/parallel-run", tags=["Parallel Run Checklist"])
app.include_router(status_report.router, prefix="/api/status-report", tags=["Status Report Generator"])
app.include_router(sr_ticket.router, prefix="/api/sr-ticket", tags=["Oracle SR Ticket Writer"])
app.include_router(change_request.router, prefix="/api/change-request", tags=["Change Request Generator"])
app.include_router(security_role.router, prefix="/api/security-role", tags=["HCM Security Role Designer"])
app.include_router(integration_spec.router, prefix="/api/integration-spec", tags=["Integration Spec Generator"])
app.include_router(kickoff_pack.router, prefix="/api/kickoff-pack", tags=["Project Kickoff Pack"])
app.include_router(benefits_config.router, prefix="/api/benefits-config", tags=["Benefits Config Generator"])
app.include_router(compensation_plan.router, prefix="/api/compensation-plan", tags=["Compensation Plan Designer"])
app.include_router(recruiting_setup.router, prefix="/api/recruiting-setup", tags=["Recruiting Setup Guide"])
app.include_router(gl_designer.router, prefix="/api/gl-designer", tags=["GL Chart of Accounts Designer"])
app.include_router(ap_setup.router, prefix="/api/ap-setup", tags=["AP Setup Generator"])
app.include_router(jde_migration_map.router, prefix="/api/jde-migration", tags=["JDE Migration Mapper"])
app.include_router(hcm_learning.router, prefix="/api/hcm-learning", tags=["HCM Learning"])
app.include_router(hcm_talent.router, prefix="/api/hcm-talent", tags=["HCM Talent"])
app.include_router(hcm_workforce.router, prefix="/api/hcm-workforce", tags=["HCM Workforce"])
app.include_router(erp_ar.router, prefix="/api/erp-ar", tags=["ERP Accounts Receivable"])
app.include_router(erp_fixed_assets.router, prefix="/api/erp-fixed-assets", tags=["ERP Fixed Assets"])
app.include_router(erp_procurement.router, prefix="/api/erp-procurement", tags=["ERP Procurement"])
app.include_router(erp_projects.router, prefix="/api/erp-projects", tags=["ERP Projects"])
app.include_router(erp_cash.router, prefix="/api/erp-cash", tags=["ERP Cash Management"])
app.include_router(jde_finance.router, prefix="/api/jde-finance", tags=["JDE Finance"])
app.include_router(jde_distribution.router, prefix="/api/jde-distribution", tags=["JDE Distribution"])
app.include_router(jde_manufacturing.router, prefix="/api/jde-manufacturing", tags=["JDE Manufacturing"])

@app.get("/api/health")
def health():
    return {"status": "ok", "platform": "Denovo AI"}

@app.get("/api/dashboard/stats")
def dashboard_stats():
    return {
        "consultants": 312,
        "hours_saved_monthly": 4800,
        "tickets_deflected": 1240,
        "ai_queries_today": 847,
        "documents_processed": 3621,
        "cost_saved_monthly": 127000,
        "monthly_queries": [
            {"month": "Nov", "queries": 1340},
            {"month": "Dec", "queries": 1580},
            {"month": "Jan", "queries": 2100},
            {"month": "Feb", "queries": 2890},
            {"month": "Mar", "queries": 3720},
            {"month": "Apr", "queries": 4510},
        ],
        "feature_usage": [
            {"feature": "ERP Chatbot", "usage": 98},
            {"feature": "Doc Summarizer", "usage": 87},
            {"feature": "SQL Generator", "usage": 74},
            {"feature": "SOW Generator", "usage": 61},
            {"feature": "Meeting Notes", "usage": 53},
            {"feature": "Migration", "usage": 42},
            {"feature": "ROI Calc", "usage": 31},
        ],
    }

@app.get("/api/history")
def get_history(limit: int = 20):
    db = SessionLocal()
    try:
        records = db.query(GenerationHistory).order_by(desc(GenerationHistory.created_at)).limit(limit).all()
        return [
            {
                "id": r.id,
                "feature": r.feature,
                "input_summary": r.input_summary,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ]
    finally:
        db.close()
