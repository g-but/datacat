# Kivi-HR.md
---
created_date: 2024-07-08
last_modified_date: 2025-07-08
last_modified_summary: "Added documentation metadata block."
---

##  Project: Kivi-HR – AI-Ready Intake System (Stage 1: HR Use Case)

Kivi-HR is the **intake engine** framework for all future Botsmann solutions. The **first implementation** is an AI-powered HR module — a system that collects employee data through a beautiful, dynamic frontend and eventually feeds that data to an AI for task matching, development suggestions, and hiring guidance.

This document outlines:
- The **vision**, **success metrics**, and **risks**
- The **architecture**
- The **development milestones**

---

##  Big Picture: What Is Kivi-HR?
Kivi-HR is a modular, **intake form builder** and data pipeline that:
1. Starts with an ultra-modern, consumer-grade frontend for data entry
2. Stores form data in a scalable, well-structured backend
3. Makes the data accessible to LLMs for downstream tasks

This system is the foundation for:
-  HR & Talent Management (current use case)
-  Medical intake (patients)
- ⚖️ Legal intake (clients)
-  Public sector onboarding (citizens)

---

##  Current Scope: AI-Powered HR Intake Form

We're starting with a fully dynamic HR intake form where:
- HR can enter new employee data
- Fields can be added/removed per person
- Data syncs to a database in real-time
- This data will **later** be used by LLMs to analyze strengths, recommend tasks, and build hiring plans

---

##  Success Metrics

### Phase 1 (Frontend MVP)
- **Qualitative:** Overwhelmingly positive feedback from 5 internal testers on ease of use and aesthetics
- **Quantitative:** Average time to complete a new employee profile is under 3 minutes

### Phase 2 (Backend Integration)
- **Quantitative:** 100% data fidelity between frontend and database, API responses under 200ms

### Phase 3 (AI Integration)
- **Business Impact:** 15% reduction in HR time spent on initial skill-gap analysis

---

##  Tech Architecture (High-Level)

###  Frontend (Focus of Stage 1)
- **Framework:** Next.js + Tailwind CSS
- **Form logic:** React Hook Form or Formik
- **Validation:** Zod or Yup
- **UX polish:** Framer Motion for microinteractions
- **Field types:** Text, Text Area, Number, Date, Select, Checkbox
- **UX goal:** As intuitive as Stripe, Notion, or iOS

###  Backend (Stage 2)
- **API:** Node.js + Express
- **Auth:** Clerk or Supabase Auth

###  Database (Stage 2-3)
- **PostgreSQL** (via Supabase or hosted on Vercel/AWS)
- Dynamically structured per form
- Field-level metadata for AI parsing

###  LLM Integration (Stage 3+)
- **LLM:** OpenAI GPT-4 / Gemini / local model
- **Tasks:** Task matching, skill gap analysis, hiring suggestions, personal growth plans

---

##  Milestones & Phases

### ✅ Phase 1: Build Frontend MVP
**Goal:** Deliver a beautiful, standalone form interface that users love.

**User Stories:**
- [ ] As an HR Manager, I want to create a new employee form using a "New Hire" template
- [ ] I want to add custom fields (e.g., "T-Shirt Size") as needed
- [ ] I want to remove irrelevant fields per hire
- [ ] I want my changes saved automatically as I go
- [ ] I want my progress to persist in localStorage even after refresh
- [ ] I want a mock API to simulate backend behavior

### ⏭️ Phase 2: Real Backend & Database
- [ ] Build Node.js API endpoints
- [ ] Set up PostgreSQL (Supabase)
- [ ] Connect frontend to live database
- [ ] Add backend validation + real-time autosave
- [ ] Introduce authentication

### ⏭️ Phase 3: AI Integration (LLM)
- [ ] Build secure pipeline from DB to LLM
- [ ] Develop "AI Suggestions" panel in UI
- [ ] Show insights like skill analysis & growth plans

---

## ⚠️ Risks & Challenges

- **Dynamic form complexity → scope creep**
  - Mitigation: Limit field types early, focus on stable UX

- **Schema flexibility vs. AI-usable structure**
  - Mitigation: Dedicate R&D in Phase 2 to metadata design

- **Overdone animations reduce performance**
  - Mitigation: Prioritize clarity and feedback over decoration

---

##  Guiding Principles
- Start **UX-first**: users should *love* filling out these forms
- Keep it **modular** and **schema-driven** from day one
- Design everything as if AI will plug in later — because it will
- No hardcoded logic: every field, label, type, validation should be defined by metadata

---

##  Notes
- Kivi-HR is the flagship for our intake system architecture
- Every future intake app will follow this pattern: `form → database → LLM`
- Start small, ship fast, polish relentlessly

---

Let's begin with the frontend. Make it beautiful. Make it obvious. Make it fast.

---

**Last updated:** July 7, 2025