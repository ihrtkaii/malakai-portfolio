import type { Skill, Cert, Project, ExperienceEntry, ContactInfo } from '@/types'

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
    name: 'Microsoft Sentinel Homelab',
    status: 'live',
    description:
      'Honeypot VM (LEGACY-FILESVR-EAST-01) in Azure. Log Analytics + Sentinel, KQL log ingestion, real attack data captured.',
    tags: ['Azure', 'KQL', 'SIEM'],
    link: '#',
  },
  {
    name: 'CyberReady SaaS',
    status: 'MVP',
    description:
      'Cyber insurance readiness tool for SMBs. 20-question assessment → AI-scored risk tier + branded PDF report. $39 monetization.',
    tags: ['React', 'Node.js', 'Claude API'],
    link: '#',
  },
  {
    name: 'JobBot',
    status: 'running',
    description:
      'Automated Python job search pipeline — multi-API sourcing, semantic scoring, daily ranked email digest.',
    tags: ['Python', 'NLP', 'APIs'],
    link: '#',
  },
  {
    name: 'ResumeX',
    status: 'beta',
    description:
      'AI resume tailoring engine — JD-aware bullet rewriting with LaTeX output for clean PDFs.',
    tags: ['React/Vite', 'Claude API', 'LaTeX'],
    link: '#',
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
