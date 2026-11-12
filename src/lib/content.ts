// SINGLE SOURCE OF CONTENT — WHITEJACK5 portfolio ("1-BIT RENAISSANCE").
// Real name lives ONLY in invisible metadata (layout.tsx JSON-LD). Never render it.
// All figures verified against the owner's resume (2026.11) + live repo READMEs.

export const OWNER = {
  handle: "WHITEJACK5",
  tagline: "TACKLING THE STRIDE",
  email: "bharadwajareddydevireddy@gmail.com",
  role: "Applied AI engineer & full-stack builder",
  as_of: "2026.11",
  // *italic* = the ONE emphasized serif-italic word per statement
  positioning: [
    "I turn messy data into systems that are truly *measurable* — fraud risk engines scored in milliseconds, calibrated on numbers you can re-derive.",
    "I build the interfaces that make those systems actually *usable* — APIs, ledgers, dashboards, verdicts.",
    "Fraud graphs, calibrated credit risk, citation-grounded retrieval — all of it built while *tackling* the stride.",
  ],
  principles: [
    { id: "01", t: "Reproducible evaluation before optimization", d: "A number you cannot re-derive is not a result." },
    { id: "02", t: "Explainability is part of the model, not a wrapper", d: "If nobody can say why a transaction was held, the score is not usable." },
    { id: "03", t: "Document the limits", d: "A prototype that admits its failure modes is more useful than one that overstates its accuracy." },
    { id: "04", t: "Small, testable slices", d: "A change that can be reviewed can be trusted." },
  ],
  stats: [
    { v: "53", decimals: 0, unit: "MS @ 18 RPS", label: "flagship p50 · fraud scoring" },
    { v: "4", decimals: 0, unit: "TH PLACE", label: "Arohan 2.0 · national level · 2025" },
    { v: "8.8", decimals: 1, unit: "GPA / 10", label: "B.Tech CE — AI & ML · RAIT" },
  ],
  education: {
    school: "Ramrao Adik Institute of Technology (RAIT)",
    system: "D Y Patil University",
    place: "Navi Mumbai",
    course: "B.Tech Computer Engineering — Artificial Intelligence & Machine Learning",
    span: "2024.08 → 2028.08",
    gpa: "8.8 / 10.0",
    coursework: ["Machine Learning", "Deep Learning", "DSA", "DBMS", "OS", "Computer Networks"],
  },
  links: {
    github: "https://github.com/WHITEJACK5",
    linkedin: "https://www.linkedin.com/in/devireddybharadwaja",
    leetcode: "https://leetcode.com/u/devireddy5",
    instagram: "https://www.instagram.com/futurebug5",
    alt: "https://github.com/12POISON", // ArchVision lives here — easter-egg lore
  },
  hud: {
    coords: "19.03N 73.01E / NAVI MUMBAI",
    version: "V1.0",
  },
} as const;

export type CaseStudy = {
  problem: string[];
  approach: string[];
  numbers: { v: string; k: string }[];
  limits: string[];
};

// AMBITIONS — the ego file. The owner's own voice: arrogant on purpose.
export const AMBITIONS: { id: string; t: string; d: string }[] = [
  { id: "A1", t: "Be unignorable", d: "Not “a good candidate” — the name that ends the search." },
  { id: "A2", t: "Own the niche end to end", d: "Build the fraud engines, prove the numbers, ship the interfaces. The whole stack — no handoffs, no permission." },
  { id: "A3", t: "Graduate ahead of the industry", d: "By 2028 this portfolio outruns most working résumés. Current status: ahead of schedule." },
  { id: "A4", t: "Think in weapons", d: "Every skill must compound. Everything that doesn't gets deleted. Sentiment is not a roadmap input." },
  { id: "A5", t: "Don't compete for seats", d: "Seats are for people who wait. I build rooms." },
];

export type Project = {
  slug: string;
  num: string; // "01"
  name: string;
  year: string;
  stack: string;
  line: string; // one-liner for the index row
  status?: string; // live status tag, when honest
  repo: string;
  demo?: string;
  site?: string;
  caseStudy: CaseStudy;
};

export const PROJECTS: Project[] = [
  {
    slug: "tracer",
    num: "01",
    name: "TRACER",
    year: "2026",
    stack: "PYTHON · FASTAPI · XGBOOST · SHAP · NETWORKX · DOCKER · TYPESCRIPT",
    line: "Real-time mule-ring defense — graph topology over UPI identities, scored in 53 ms, every action on a hash-chained ledger.",
    status: "RAZORPAY BUILDATHON 2026",
    repo: "https://github.com/WHITEJACK5/TRACER-Real-Time-Mule-Ring-Defense",
    caseStudy: {
      problem: [
        "UPI moves billions of small payments a day; mule rings launder stolen money through webs of shell identities faster than manual review can see them.",
        "The defense gets one payment window — hesitate and the money is gone, block broadly and honest users suffer.",
      ],
      approach: [
        "Graph first — NetworkX topology over devices and payment identities flags device fan-out (≥4 identities) and same-amount repeat smurfing.",
        "Score second — XGBoost on graph + velocity features, explained with SHAP; the system lands at 83% of the Bayes-ceiling AUPRC on its synthetic benchmark.",
        "Act third — a bounded agent can only approve, challenge or hold, and every action lands in a hash-chained audit ledger.",
      ],
      numbers: [
        { v: "53", k: "ms · p50 scoring" },
        { v: "18", k: "rps sustained" },
        { v: "83%", k: "of Bayes-ceiling AUPRC" },
        { v: "156+6", k: "pytest + Playwright e2e" },
      ],
      limits: [
        "Trained on a synthetic benchmark — real-world drift is the open problem; drift monitoring is on the roadmap.",
        "Defense-only: it scores, it does not intercept rails it does not own.",
        "Graph features are tuned for mule behaviour, not for fraud typologies outside it.",
      ],
    },
  },
  {
    slug: "loan-default-risk",
    num: "02",
    name: "LOAN DEFAULT RISK",
    year: "2026",
    stack: "LIGHTGBM · FASTAPI · DOCKER · MLFLOW · SHAP",
    line: "Leakage-audited credit PD on 1.35M LendingClub rows — calibrated to profit, explained with SHAP, live on HF Spaces.",
    status: "LIVE · HF SPACES",
    repo: "https://github.com/WHITEJACK5/loan-default-risk",
    demo: "https://whitejack5-loan-default-risk.hf.space",
    caseStudy: {
      problem: [
        "LendingClub-scale credit risk: 1.35M loans. Most public models on this dataset leak future information and stop at a vague AUC.",
      ],
      approach: [
        "Leakage-audited LightGBM with isotonic calibration on temporal splits, validated on a 2017+ hold-out — ROC-AUC 0.69, PR-AUC 0.35.",
        "Profit-first thresholding: the operating point is tuned to simulated dollars (+$7.4M policy at 0.05), not to a pretty metric.",
        "SHAP reasons, PSI drift checks, MLflow tracking; FastAPI + Docker serving at p50 29 ms under 85 tests.",
      ],
      numbers: [
        { v: "1.35M", k: "loans · temporal splits" },
        { v: "0.69", k: "ROC-AUC · 2017+ hold-out" },
        { v: "+$7.4M", k: "simulated profit policy" },
        { v: "29", k: "ms · p50 serving" },
      ],
      limits: [
        "PD is estimated on one marketplace's vintage mix; naive transfer to other portfolios will misfire.",
        "The +$7.4M is simulated policy value, not audited P&L.",
        "Class imbalance is handled honestly, but recall at the operating point remains the weakest flank.",
      ],
    },
  },
  {
    slug: "archvision",
    num: "03",
    name: "ARCHVISION AI",
    year: "2026",
    stack: "NEXT.JS · REACTFLOW · PRISMA · POSTGRESQL",
    line: "Natural language and OpenAPI specs become UML diagrams with 300 ms two-way sync.",
    status: "ALT NODE · 12POISON",
    repo: "https://github.com/12POISON/ARCHvision-AI-uml",
    caseStudy: {
      problem: [
        "Teams describe architectures in prose that nobody can maintain — diagrams drift from reality within a sprint.",
      ],
      approach: [
        "Natural language, OpenAPI specs and SQL DDL become editable UML on a ReactFlow canvas.",
        "300 ms two-way sync between diagram and spec; GPT-4o / Claude copilot with per-user budgets under RBAC workspaces.",
        "125 tests plus Playwright end-to-end cover the round-trips.",
      ],
      numbers: [
        { v: "300", k: "ms · two-way sync" },
        { v: "125", k: "tests · + e2e" },
        { v: "2-WAY", k: "spec ⇄ canvas" },
        { v: "RBAC", k: "budgeted copilot access" },
      ],
      limits: [
        "Large polyglot repos exceed the copilot's per-user budget by design.",
        "UML fidelity is only as good as the spec language it reads — garbage in, arcs out.",
      ],
    },
  },
  {
    slug: "regrag",
    num: "04",
    name: "REGRAG",
    year: "2026",
    stack: "PYTHON · RETRIEVAL · EVALUATION",
    line: "Citation-grounded QA over RBI lending regulation — quotes verified by code, refuses when the corpus is silent.",
    status: "BUILDING · D2/20 · ENDS 06.12.2026",
    repo: "https://github.com/WHITEJACK5/RegRAG",
    caseStudy: {
      problem: [
        "Lending regulation (RBI Master Directions and circulars) is exactly the kind of text RAG loves to hallucinate on.",
      ],
      approach: [
        "Citation-grounded QA: every answer carries page-level citations whose verbatim quotes are verified by code.",
        "When the corpus does not support the answer, the system refuses — refusal is a feature, not a failure.",
        "Public RBI documents only; a checksummed corpus manifest plus a synthetic internal lending policy for the sandbox.",
      ],
      numbers: [
        { v: "D2/20", k: "days · build window" },
        { v: "4", k: "RBI docs verified" },
        { v: "100%", k: "quotes code-checked" },
        { v: "0", k: "uncited answers tolerated" },
      ],
      limits: [
        "Early build — full evaluation and ablation tables land at the end of the window (06.12.2026).",
        "Educational project; not legal or financial advice.",
      ],
    },
  },
  {
    slug: "white-collars",
    num: "05",
    name: "WHITE COLLARS",
    year: "2026",
    stack: "EXPRESS · TURBOREPO · POSTGRESQL · OPENAPI",
    line: "A job portal that scrapes real listings from company career pages — one-click apply, staged into Turborepo microservices.",
    status: "LIVE · VERCEL",
    repo: "https://github.com/WHITEJACK5/white-collars",
    site: "https://white-collars.vercel.app",
    caseStudy: {
      problem: [
        "Aggregators never reach the good listings — they hide on company career pages that nobody scrapes cleanly.",
      ],
      approach: [
        "Scrapes real listings from company sites; one-click apply with saved resumes and cover letters.",
        "Mandatory video-intro uploads for select roles — proof-of-work before interviews.",
        "Staged build: hardened Express + EJS monolith first, then Turborepo microservices (gateway, auth, users, jobs, applications) behind OpenAPI contracts.",
      ],
      numbers: [
        { v: "5", k: "microservices · staged" },
        { v: "LIVE", k: "white-collars.vercel.app" },
        { v: "1-CLICK", k: "apply flow" },
        { v: "OPENAPI", k: "contracts throughout" },
      ],
      limits: [
        "Scraping surfaces are fragile by nature — kept rate-limit friendly by design.",
        "Video pipelines are storage-bound on the free tier.",
      ],
    },
  },
  {
    slug: "drqr",
    num: "06",
    name: "DRQR",
    year: "2026",
    stack: "FLASK · POSTGRESQL · REDIS · NGINX",
    line: "Self-hosted dynamic QR platform — 25+ types, scan analytics, LLM review summaries, TOTP-protected.",
    repo: "https://github.com/WHITEJACK5/DYNAMIC-QR",
    caseStudy: {
      problem: [
        "Printed QR codes point wherever they were printed — retargeting after the fact needs a platform, not a pastebin.",
      ],
      approach: [
        "Self-hosted dynamic QR: 25+ types, retarget the destination after the print.",
        "Per-scan analytics with geo enrichment off the redirect path; review capture with LLM sentiment summaries.",
        "JWT rotation + TOTP 2FA on nginx/Gunicorn; 74.4% test coverage.",
      ],
      numbers: [
        { v: "25+", k: "QR types" },
        { v: "74.4%", k: "test coverage" },
        { v: "TOTP", k: "2FA + JWT rotation" },
        { v: "GEO", k: "per-scan analytics" },
      ],
      limits: [
        "Analytics are as honest as the redirect path — bot traffic is labeled, not removed.",
        "Single-node deployment; horizontal scale is future work.",
      ],
    },
  },
];

export type Folder = { name: string; core: string[]; explored?: string[] };

export const TOOLBOX: { folders: Folder[]; certs: { name: string; by: string; when: string }[]; marquee: [string[], string[]] } = {
  folders: [
    { name: "languages", core: ["Python", "SQL", "Java", "C", "C++"], explored: ["TypeScript", "JavaScript", "PHP", "PowerShell"] },
    { name: "ml", core: ["scikit-learn", "XGBoost", "LightGBM", "SHAP", "MLflow", "Evidently"], explored: ["PyTorch", "TensorFlow", "Keras", "NetworkX", "Pandas", "NumPy"] },
    { name: "backend", core: ["FastAPI", "Flask", "Node.js", "PostgreSQL", "MongoDB"], explored: ["Express", "Spring", "SQLite", "Supabase", "Firebase", "Neo4j", "Prisma", "OpenStack", "Apache Tomcat", "Apache Maven"] },
    { name: "frontend", core: ["React", "Next.js", "Tailwind CSS"], explored: ["ReactFlow", "Flutter", "Vite", "EJS"] },
    { name: "quality-devops", core: ["Docker", "GitHub Actions", "Git", "pytest", "Playwright"] },
  ],
  certs: [
    { name: "Machine Learning Specialization", by: "Stanford Online · DeepLearning.AI", when: "2026.07" },
    { name: "Generative AI with LLMs", by: "DeepLearning.AI · AWS", when: "2026.08" },
    { name: "Retrieval-Augmented Generation", by: "DeepLearning.AI", when: "2026.08" },
  ],
  marquee: [
    ["APPLIED AI", "ML SYSTEMS", "FRAUD GRAPHS", "CITATION-GROUNDED RAG", "CALIBRATION", "SHAP", "REPRODUCIBLE EVALS"],
    ["CURRENTLY: REGRAG D2/20", "B.TECH '28 IN PROGRESS", "OPEN TO INTERNSHIPS", "TACKLING THE STRIDE"],
  ],
};

export type LogEntry = { d: string; t: string; m: string };

export const LOG: LogEntry[] = [
  { d: "2024.08", t: "Enrollment — B.Tech Computer Engineering, AI & ML", m: `${OWNER.education.school} · Navi Mumbai` },
  { d: "2025", t: "Arohan 2.0 — 4th place", m: "National-level hackathon" },
  { d: "2026", t: "LabourLink built", m: "Workers' welfare platform · five role portals" },
  { d: "2026", t: "TRACER ships — Razorpay Buildathon", m: "53 ms p50 · 18 rps · hash-chained ledger" },
  { d: "2026.07", t: "Machine Learning Specialization", m: "Stanford Online · DeepLearning.AI" },
  { d: "2026.08", t: "GenAI with LLMs · RAG certificates", m: "DeepLearning.AI · AWS" },
  { d: "2026", t: "Pull Shark ×2", m: "github.com/WHITEJACK5" },
  { d: "NOW", t: "RegRAG — build window running", m: "D2/20 · ends 06.12.2026 · B.Tech '28 in progress" },
];

export const CHAPTERS: { id: string; num: string; title: string }[] = [
  { id: "hero", num: "00", title: "BOOT" },
  { id: "who", num: "01", title: "WHO" },
  { id: "work", num: "02", title: "WORK" },
  { id: "commits", num: "03", title: "COMMITS" },
  { id: "toolbox", num: "04", title: "TOOLBOX" },
  { id: "log", num: "05", title: "LOG" },
  { id: "life", num: "06", title: "LIFE" },
  { id: "signal", num: "07", title: "SIGNAL" },
];
