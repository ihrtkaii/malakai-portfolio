import type {
  Skill,
  Cert,
  Project,
  ExperienceEntry,
  ContactInfo,
  PlaybookSection,
} from '@/types'

export const profile = {
  name: 'Malakai',
  title: 'SOC Analyst in training',
  location: 'Kissimmee, FL',
  age: 18,
  tagline: 'Help Desk / CRT Tech building toward cybersecurity',
}

export const about = `Malakai — SOC Analyst in training. Help Desk / CRT Technician @ Micro Key Solutions. CompTIA Security+ & Network+ certified before age 18.

Building toward a cybersecurity career — UCF IT (Cybersecurity focus), Fall 2026, expected May 2028.

Nearly 1 year hands-on production IT: AWS EC2, ransomware incident response, Windows Server, SQL Anywhere, TCP/IP troubleshooting, SOC fundamentals.`

export const skills: Skill[] = [
  { name: 'Network security', level: 85 },
  { name: 'Windows Server', level: 80 },
  { name: 'Incident response', level: 75 },
  { name: 'Python', level: 72 },
  { name: 'AWS EC2', level: 70 },
  { name: 'SQL / Database', level: 65 },
  { name: 'Sentinel / KQL', level: 60 },
  { name: 'Splunk', level: 50 },
]

export const certs: Cert[] = [
  { name: 'CompTIA Security+', code: 'SY0-701', status: 'active', note: 'earned before age 18' },
  { name: 'CompTIA Network+', code: 'N10-008', status: 'active' },
  { name: 'CompTIA CySA+', status: 'in-progress', note: 'target Q2 2026' },
  { name: 'Splunk Core User', status: 'planned', note: 'TryHackMe path active' },
]

export const projects: Project[] = [
  {
    id: 'sentinel',
    name: 'Microsoft Sentinel Homelab',
    status: 'live',
    description:
      'Honeypot VM (LEGACY-FILESVR-EAST-01) in Azure. Log Analytics + Sentinel, KQL log ingestion, real attack data captured.',
    tags: ['Azure', 'KQL', 'SIEM'],
    link: '#',
    caseStudy: {
      objective:
        'Stand up a publicly reachable honeypot in Azure, ship its security logs into Microsoft Sentinel, and use KQL to identify, classify, and triage real-world attacker behavior in near real-time.',
      tools: [
        'Microsoft Azure (VM, NSG, Public IP)',
        'Log Analytics Workspace',
        'Microsoft Sentinel',
        'KQL (Kusto Query Language)',
        'Windows Security Event log',
        'Azure Monitor Agent (AMA)',
      ],
      methodology: [
        'Provisioned an intentionally exposed Windows VM named LEGACY-FILESVR-EAST-01 with RDP open to the public internet.',
        'Connected the host to a Log Analytics workspace and onboarded it to Microsoft Sentinel.',
        'Forwarded Windows Security events (4624 / 4625 / 4634) and authentication telemetry into the workspace.',
        'Authored KQL queries to bucket failed logons by source IP, country, and username — and to surface successful intrusions for investigation.',
        'Built a workbook with attack volume, top source countries, and brute-force username lists.',
      ],
      findings: [
        'Within 24 hours the honeypot was receiving 4625 failed-logon events from dozens of countries.',
        'Top attempted usernames were Administrator, admin, user, and a long tail of localized spellings.',
        'Source IPs clustered around known scanner ASNs and several residential proxy ranges.',
        'A small number of successful logons against weak seeded credentials demonstrated full credential-stuffing chain end-to-end.',
      ],
      lessons: [
        'KQL is the single most leveraged skill in a Sentinel-shop SOC — fluency matters more than fancy tooling.',
        'Geographic and ASN enrichment turns a noisy log stream into something an analyst can actually triage.',
        'Even an "uninteresting" exposed RDP host is hit within hours — exposure surface is the variable that matters.',
        'Workbook-first thinking forces you to design queries that aggregate cleanly, not just queries that return rows.',
      ],
      screenshots: ['/screenshots/sentinel-workbook.png', '/screenshots/sentinel-kql.png'],
    },
  },
  {
    id: 'cyberready',
    name: 'CyberReady SaaS',
    status: 'MVP',
    description:
      'Cyber insurance readiness tool for SMBs. 20-question assessment → AI-scored risk tier + branded PDF report. $39 monetization.',
    tags: ['React', 'Node.js', 'Claude API'],
    link: '#',
    caseStudy: {
      objective:
        'Build a self-serve readiness assessment that helps small businesses understand whether they qualify for cyber insurance and what controls they are missing — productized as a $39 PDF report.',
      tools: [
        'React + Vite frontend',
        'Node.js / Express backend',
        'Claude API for narrative scoring',
        'PDFKit for branded report generation',
        'Stripe Checkout',
      ],
      methodology: [
        'Mapped 20 yes/no/maybe questions to control categories used by major cyber insurers (MFA, EDR, backups, IR plan, training, patching).',
        'Scored answers into a weighted readiness tier (Red / Yellow / Green) with subscores per category.',
        'Used Claude to produce a plain-English narrative explaining each weak area in business terms — not jargon.',
        'Rendered the result as a branded PDF including findings, prioritized remediation, and an attestation page.',
        'Wired Stripe Checkout for the $39 unlock; report is gated until payment.',
      ],
      findings: [
        'Three sample reports already shipped (Micro Key Solutions, Greg’s Feet Pics, Yaretzy’s Networking Firm).',
        'Most SMBs fail on backup verification and IR runbook existence, not on EDR.',
        'Pricing experiments suggest $39 is the ceiling for self-serve; higher tiers need a sales motion.',
      ],
      lessons: [
        'AI narrative is most valuable when it translates control gaps into renewal/quote impact.',
        'A two-page PDF beats a 20-page PDF — buyers skim, then forward.',
        'The pre-underwriting space is real but the buyer is the broker, not the SMB directly.',
      ],
      screenshots: ['/screenshots/cyberready-report.png'],
    },
  },
  {
    id: 'jobbot',
    name: 'JobBot',
    status: 'running',
    description:
      'Automated Python job search pipeline — multi-API sourcing, semantic scoring, daily ranked email digest.',
    tags: ['Python', 'NLP', 'APIs'],
    link: '#',
    caseStudy: {
      objective:
        'Stop manually scrolling job boards. Build an automated pipeline that pulls SOC / IT roles from multiple sources, scores them against my actual resume, and emails me a ranked shortlist every morning.',
      tools: [
        'Python 3.11',
        'requests / httpx for source APIs',
        'sentence-transformers for semantic similarity',
        'SQLite for de-duplication and history',
        'SMTP / Gmail for daily digest delivery',
        'cron for scheduling',
      ],
      methodology: [
        'Built source adapters for several public job APIs and RSS feeds, each normalizing to a common Job schema.',
        'Embedded my resume once at startup; embedded each new job posting at ingestion time.',
        'Computed cosine similarity between resume and posting; combined with keyword filters (Security+, Tier 1, SOC).',
        'Stored seen postings in SQLite to avoid duplicate alerts day-over-day.',
        'Rendered the top-N ranked postings into a clean HTML digest and emailed it daily at 7am.',
      ],
      findings: [
        'Semantic scoring catches roles that keyword filters miss — e.g. "blue team analyst" still ranks high vs a SOC-tagged resume.',
        'Most boards repeat the same 30% of postings; dedup is essential.',
        'A daily 7am digest converted to ~3 actual applications a week without me opening a job board.',
      ],
      lessons: [
        'Embeddings are cheap and useful far outside chatbots — ranking is the boring killer app.',
        'Ship the email side first; ranking quality matters less than reliability of delivery.',
        'Dedup + history beats fancy scoring for day-2 usefulness.',
      ],
      screenshots: ['/screenshots/jobbot-digest.png'],
    },
  },
  {
    id: 'resumex',
    name: 'ResumeX',
    status: 'beta',
    description:
      'AI resume tailoring engine — JD-aware bullet rewriting with LaTeX output for clean PDFs.',
    tags: ['React/Vite', 'Claude API', 'LaTeX'],
    link: '#',
    caseStudy: {
      objective:
        'Take a generic resume and a job description and produce a tailored, ATS-friendly resume PDF — without hand-rewriting bullets every time.',
      tools: [
        'React + Vite frontend',
        'Claude API for bullet rewriting',
        'LaTeX (Tectonic) for PDF rendering',
        'Node.js orchestration layer',
      ],
      methodology: [
        'Parse the source resume into structured sections (header, experience bullets, skills, education).',
        'For each role, rewrite bullets against the target JD using Claude — preserving facts, swapping verbs and emphasis.',
        'Re-rank skills section so JD-relevant skills surface first.',
        'Render the structured output through a LaTeX template that ATS parsers handle cleanly.',
        'Show side-by-side diff before final PDF download so the user can sanity-check changes.',
      ],
      findings: [
        'Bullet rewriting is most useful when bounded — fact-preserving, no fabrication.',
        'LaTeX templates outperform Word/HTML-to-PDF for ATS parsing consistency.',
        'A diff view is the trust unlock — without it users rewrite by hand anyway.',
      ],
      lessons: [
        'Constrained AI rewriting beats freeform — give the model the source bullet AND the JD AND a verb whitelist.',
        'PDF generation is a real engineering problem; LaTeX skips most of it.',
        'Trust UX > model quality for tools that touch a user’s identity (resume, bio, etc.).',
      ],
      screenshots: ['/screenshots/resumex-diff.png'],
    },
  },
]

export const experience: ExperienceEntry[] = [
  {
    company: 'Micro Key Solutions',
    role: 'Help Desk / CRT Technician',
    period: 'Apr 2025 – present',
    bullets: [
      'Tier 1-2 support across alarm/monitoring stack',
      'AWS EC2 setup, security groups, monitoring',
      'Ransomware incident response',
      'SQL Anywhere troubleshooting + queries',
      'End-to-end ticket ownership w/ direct customer comms',
    ],
  },
]

// PICERL incident-response playbook. Preparation contains a deliberate
// (subtle) hint at the admin easter-egg password: the line about default
// administrator credentials.
export const playbook: PlaybookSection[] = [
  {
    title: 'Preparation',
    summary:
      'Stand up the people, process, and tooling needed to detect and respond before the page actually goes off.',
    items: [
      'Maintain a current incident-response runbook with on-call rotations and escalation paths.',
      'Default administrator credentials should always be changed after initial setup.',
      'Baseline endpoint, network, and identity logging into the SIEM (Sentinel / Splunk).',
      'Pre-stage forensic acquisition tools (KAPE, Velociraptor) on a known-good jump host.',
      'Run quarterly tabletop exercises with the SOC, IT, and at least one business stakeholder.',
    ],
  },
  {
    title: 'Identification',
    summary:
      'Detect a candidate event, confirm it is an incident, classify severity, and define scope.',
    items: [
      'Triage the alert against high-fidelity detections first (impossible-travel, sequential 4625→4624 from the same source IP).',
      'Pivot in KQL to surface adjacent host, identity, and process telemetry.',
      'Determine blast radius: which accounts, which hosts, which data classes.',
      'Open the incident ticket, assign severity, notify the on-call IR lead.',
    ],
  },
  {
    title: 'Containment',
    summary:
      'Slow or stop the spread without destroying the evidence you still need.',
    items: [
      'Network-isolate suspect hosts via NAC / EDR isolation rather than yanking the cable.',
      'Disable or rotate compromised credentials; revoke active sessions and refresh tokens.',
      'Block known-bad C2 domains and IPs at the egress proxy / firewall.',
      'Capture volatile data (memory, network state) before pivoting to long-term containment.',
    ],
  },
  {
    title: 'Eradication',
    summary:
      'Remove the foothold and the conditions that allowed it. Cleanup is not eradication.',
    items: [
      'Identify and remove every persistence mechanism, not just the obvious one.',
      'Patch the exploited CVE or misconfiguration; verify with a re-scan.',
      'Rotate any secrets the attacker may have accessed, including service accounts.',
      'Document the root cause in plain language — engineering, not just IOCs.',
    ],
  },
  {
    title: 'Recovery',
    summary:
      'Bring systems back online with confidence and additional monitoring.',
    items: [
      'Restore from a known-clean backup or rebuild from gold image; never trust the compromised host.',
      'Stage elevated monitoring for the recovered systems for at least two weeks.',
      'Validate business functionality with the application owner before declaring recovery complete.',
      'Communicate restored status to stakeholders with a written all-clear.',
    ],
  },
  {
    title: 'Lessons Learned',
    summary:
      'The point of the incident is the next one — capture and apply what you learned.',
    items: [
      'Hold the post-incident review within five business days while details are fresh.',
      'Convert findings into concrete tickets: detections, hardening, training, runbook edits.',
      'Update the runbook in version control with the new playbook patterns observed.',
      'Share a sanitized writeup internally — defenders learn the most from each other.',
    ],
  },
]

// Notes file content — the explicit hint for the admin easter egg.
export const notes = {
  title: 'notes.txt',
  body: `administrator password: admin
don't forget!!`,
}

// Secret bio surfaced only via the admin easter egg. Looser, more personal
// voice than the public About window — it's the payoff for finding the
// backdoor.
export const secret = {
  heading: 'you found the backdoor.',
  subheading: "here's the real Malakai.",
  bio: [
    "Eighteen years old, Kissimmee Florida, working a Help Desk / CRT Tech job at Micro Key Solutions while studying for my next cert at 1am with a mug going cold next to me.",
    "I built this whole portfolio because every cybersecurity job posting wants 'demonstrated passion' and 'proof you can build things' and a static resume PDF wasn't going to cut it. So I made you boot into a fake operating system.",
    "I'm headed to UCF Fall 2026 for IT with a cybersecurity concentration. Until then I'm grinding tickets, breaking my homelab, writing KQL, and trying to actually be useful to a SOC team that hasn't hired me yet.",
  ],
  funFacts: [
    'Got Security+ and Network+ before I was old enough to vote.',
    'Run a Microsoft Sentinel honeypot in Azure that gets attacked by real people every single day.',
    'Built a Python job-search bot because I was tired of refreshing LinkedIn.',
    'Have opinions about mechanical keyboards. Strong ones.',
    'My favorite log line is a 4625 followed by a 4624 from the same IP. You know what I mean.',
    'This entire site is rendered in Three.js. Every CRT bezel is a real 3D mesh. The desk reflects.',
  ],
  signoff: 'now go hire me.',
}

export const contact: ContactInfo = {
  location: 'Kissimmee, FL',
  target: 'SOC analyst, IT security, Tier 2 helpdesk',
  remote: 'yes — or Orlando area',
  ucf: 'Fall 2026 IT/Cyber',
  status: 'available immediately',
  email: 'YOUR_EMAIL_HERE',
  linkedin: 'YOUR_LINKEDIN_URL_HERE',
  github: 'YOUR_GITHUB_URL_HERE',
}
