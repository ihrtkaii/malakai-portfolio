# Phase 5 Brief

Phases 1-4 are complete and committed to GitHub. Begin Phase 5 — the SOC OS desktop.

## Design Direction
- Keep "SOC OS" branding throughout
- Visual style: Frutiger Aero meets Windows XP Luna — glossy buttons, soft gradients, slight glass/translucency on windows, aqua/blue color palette, chunky title bars, early 2000s tactile UI feel. Not full Vista Aero, not flat modern.
- Bliss-inspired wallpaper (blue sky gradient into green hills) with subtle SOC OS branding

## Desktop Structure
- 📁 Projects — Explorer-style window showing 4 projects, each opens full case study documentation window
- 📁 About Me — Notepad-style window with bio
- 📁 Certifications — window listing certs with status
- 📁 Experience — work history window
- 📁 Skills — skill bars window
- 📄 Resume.pdf — triggers download of /public/resume.pdf
- 💻 cmd.exe — interactive terminal

## Projects (inside Projects folder)
1. Microsoft Sentinel Homelab — Azure honeypot, KQL queries, real attack data
2. CyberReady SaaS — cyber insurance readiness tool, $39 PDF model
3. JobBot — automated Python job pipeline
4. ResumeX — AI resume tailoring

## Window Behavior
- Draggable windows
- Taskbar tracks open windows
- Single click selects icon, double click opens
- Click empty desktop deselects
- Close button functional, min/max cosmetic
- Z-index stacking on focus

## Terminal Commands
Standard: help, whoami, skills, projects, certs, experience, contact, ipconfig, cls
Easter eggs: matrix, coffee, hire-malakai, sudo

## Rules
- Pull all content from lib/portfolioData.ts
- No component over 200 lines
- Run npm run typecheck after each file
- Commit when phase is complete