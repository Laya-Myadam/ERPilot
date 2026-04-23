ERP_KNOWLEDGE = [
    {
        "id": "jde_overview",
        "title": "JD Edwards EnterpriseOne Overview",
        "content": "JD Edwards EnterpriseOne is an integrated ERP suite by Oracle combining business value, standards-based technology, and deep industry functionality. It includes financial management, supply chain, manufacturing, project management, asset lifecycle, and human capital management modules. It runs on various databases including Oracle, SQL Server, and IBM DB2.",
        "category": "overview",
        "tags": ["JDE", "EnterpriseOne", "ERP", "Oracle"]
    },
    {
        "id": "jde_financial",
        "title": "JDE Financial Management Modules",
        "content": "JD Edwards Financial modules include General Ledger (GL), Accounts Payable (AP), Accounts Receivable (AR), Fixed Assets, Advanced Cost Accounting, Budgeting, Currency Management, and Financial Reporting. The GL business unit structure allows multi-company, multi-currency operations. AAIs (Automatic Accounting Instructions) control how transactions post to the GL.",
        "category": "financial",
        "tags": ["GL", "AP", "AR", "financial", "AAI", "accounting"]
    },
    {
        "id": "jde_supply_chain",
        "title": "JDE Supply Chain Management",
        "content": "JD Edwards Supply Chain includes Procurement, Inventory Management, Sales Order Management, Demand Forecasting, and Transportation Management. Key processes: Purchase Orders (P4310), Sales Orders (P4210), Inventory Adjustments (P4114). Lot tracking and serial number management are available for regulated industries.",
        "category": "supply_chain",
        "tags": ["supply chain", "procurement", "inventory", "sales order", "PO"]
    },
    {
        "id": "jde_manufacturing",
        "title": "JDE Manufacturing Modules",
        "content": "JDE Manufacturing covers Work Orders (P48013), Bills of Material (P3002), Routings (P3003), Shop Floor Control, MRP (Material Requirements Planning), and Capacity Planning. Manufacturing accounting tracks labor, material, and overhead costs. Configurator module handles complex made-to-order products.",
        "category": "manufacturing",
        "tags": ["manufacturing", "work order", "BOM", "MRP", "shop floor"]
    },
    {
        "id": "oracle_cloud_overview",
        "title": "Oracle Cloud ERP Overview",
        "content": "Oracle Cloud ERP (also called Oracle Fusion Cloud) is a SaaS-based ERP suite hosted on Oracle Cloud Infrastructure. It includes Financials, Procurement, Project Management, Risk Management, and EPM. It uses OTBI (Oracle Transactional Business Intelligence) for reporting and supports REST APIs for integration.",
        "category": "oracle_cloud",
        "tags": ["Oracle Cloud", "Fusion", "SaaS", "OTBI", "cloud ERP"]
    },
    {
        "id": "oracle_cloud_financials",
        "title": "Oracle Cloud Financials",
        "content": "Oracle Cloud Financials includes General Ledger, Payables, Receivables, Cash Management, Fixed Assets, Tax, and Expenses. The Chart of Accounts uses a flexible segment structure. Smart View integrates with Excel for financial reporting. Subledger Accounting (SLA) provides configurable accounting rules.",
        "category": "oracle_cloud",
        "tags": ["Oracle Financials", "GL", "payables", "SLA", "Smart View"]
    },
    {
        "id": "migration_jde_to_cloud",
        "title": "Migrating from JDE to Oracle Cloud",
        "content": "Migration from JD Edwards to Oracle Cloud involves data migration, business process re-engineering, integration redesign, and user training. Key phases: Assessment, Data Cleansing, Configuration, Testing (SIT/UAT), Cutover. Common challenges: custom modifications in JDE may not have Cloud equivalents, data quality issues, integration complexity. EXPRESSLAUNCH methodology accelerates migration using pre-built configurations.",
        "category": "migration",
        "tags": ["migration", "JDE to Cloud", "EXPRESSLAUNCH", "cutover", "UAT"]
    },
    {
        "id": "jde_orchestrator",
        "title": "JDE Orchestrator Framework",
        "content": "JDE Orchestrator Framework enables no-code automation of business processes. Orchestrations chain together service calls, transformations, and notifications. The Orchestrator Studio provides a visual drag-and-drop interface. Common uses: automated approvals, IoT data ingestion, cross-system integrations without custom code.",
        "category": "integration",
        "tags": ["Orchestrator", "no-code", "automation", "integration", "Orchestrator Studio"]
    },
    {
        "id": "jde_security",
        "title": "JDE Security and User Management",
        "content": "JDE security operates at application, action, row, and column levels. Security Workbench (P00950) manages application security. Role-based security groups are recommended over individual user security. Solution Explorer organizes menus by role. Segregation of Duties (SOD) is enforced through security design. Audit records can be enabled per table.",
        "category": "security",
        "tags": ["security", "roles", "SOD", "audit", "user management", "P00950"]
    },
    {
        "id": "jde_reporting",
        "title": "JDE Reporting and Analytics",
        "content": "JDE reporting tools include Report Design Aid (RDA) for batch reports, EnterpriseOne Pages for dashboards, One View Reporting (OVR) for interactive reports with charts, and BI Publisher integration. UBEs (Universal Batch Engines) process large data sets. Orchestrations can export data to external analytics platforms.",
        "category": "reporting",
        "tags": ["reporting", "RDA", "OVR", "BI Publisher", "dashboards", "UBE"]
    },
    {
        "id": "oracle_cloud_integration",
        "title": "Oracle Cloud Integration Patterns",
        "content": "Oracle Cloud integrations use Oracle Integration Cloud (OIC), REST APIs, SOAP web services, and File-Based Data Import (FBDI). FBDI is the primary method for bulk data loads. OTBI provides real-time reporting. BI Cloud Connector exports data to external systems. HDL (HCM Data Loader) handles HR data. The Open Interfaces framework connects legacy systems.",
        "category": "integration",
        "tags": ["OIC", "REST API", "FBDI", "integration", "OTBI", "HDL"]
    },
    {
        "id": "erp_common_errors",
        "title": "Common ERP Error Codes and Resolutions",
        "content": "Common JDE errors: E0000001 (system error - check JDE logs), 0000023B (invalid date format), BSFN errors (check business function parameters). Oracle Cloud common issues: GL posting failures (check period open/closed), payables holds (check approval hierarchy), FBDI import errors (validate template mapping). Always check UBE job status and system logs first.",
        "category": "troubleshooting",
        "tags": ["errors", "troubleshooting", "BSFN", "GL posting", "FBDI errors"]
    },
    {
        "id": "erp_best_practices",
        "title": "ERP Implementation Best Practices",
        "content": "Key ERP best practices: 1) Minimize customizations - use standard functionality where possible. 2) Clean data before migration - garbage in, garbage out. 3) Involve end users early in UAT. 4) Document business processes before and after. 5) Plan for change management. 6) Test integrations thoroughly. 7) Have rollback plan for go-live. 8) Monitor system performance post go-live.",
        "category": "best_practices",
        "tags": ["best practices", "implementation", "UAT", "go-live", "change management"]
    },
    {
        "id": "oracle_release_cadence",
        "title": "Oracle Cloud Update Cadence",
        "content": "Oracle Cloud releases quarterly updates (approximately January, April, July, October). Each release includes new features, bug fixes, and security patches. Customers get 2 preview environments (Sandbox) before the update hits production. Release readiness documentation is available 30 days before go-live. Critical patch updates (CPUs) are released separately for security vulnerabilities.",
        "category": "oracle_cloud",
        "tags": ["release", "quarterly update", "patch", "sandbox", "release readiness"]
    },
    {
        "id": "denovo_services",
        "title": "Denovo Consulting Services",
        "content": "Denovo (part of Argano) specializes in Oracle JD Edwards and Oracle Cloud consulting. Services include ERP implementations, cloud migrations, managed services, and AI-enhanced consulting. EXPRESSLAUNCH methodology for rapid JDE implementations. EXPRESSPATH for cloud migrations. Managed services cover 24/7 monitoring, incident management, and continuous improvement.",
        "category": "denovo",
        "tags": ["Denovo", "Argano", "EXPRESSLAUNCH", "EXPRESSPATH", "managed services"]
    }
]
