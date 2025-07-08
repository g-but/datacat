# Gemini Project: Kivi-HR
---
created_date: 2024-07-08
last_modified_date: 2025-07-08
last_modified_summary: "Added documentation metadata block."
---

This document provides the essential context for the Kivi-HR project.

## 1. Mission

Build a beautiful, modular, and schema-driven intake form builder, starting with an HR use case. The system must be designed from day one to be consumed by AI. The primary goal for the initial phase is a standalone frontend MVP that users love.

## 2. Guiding Principles

- **UX-First**: The user experience must be polished, intuitive, and fast. Aim for the quality of Stripe, Notion, or iOS.
- **Modular & Schema-Driven**: No hardcoded form logic. Every field, label, type, and validation rule must be defined by metadata.
- **AI-Ready**: Design data structures and APIs with future AI integration in mind.
- **Clean Code**: Follow official style guides. Comments should explain **why**, not **what**.
- **Fail Fast**: Crash early, log clearly, recover gracefully.

## 3. Tech Stack (Phase 1: Frontend MVP)

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Form Logic**: React Hook Form or Formik
- **Validation**: Zod or Yup
- **UI Polish**: Framer Motion for micro-interactions

## 4. Key Commands

This section will be updated as the project is set up.
- **Install Dependencies**: `npm install`
- **Run Development Server**: `npm run dev`
- **Run Tests**: `npm test`
- **Lint & Format**: `npm run lint`

## 5. Development Roadmap

- **✅ Phase 1 (Current Focus):** Build a standalone Frontend MVP with a mock API.
- **⏭️ Phase 2:** Implement the Node.js/Express backend and connect to a PostgreSQL database.
- **⏭️ Phase 3:** Integrate with an LLM for AI-powered suggestions.

For more detailed project information, see `VISION.md`.