# Gemini Project: Erfassung Platform (Universal Form Builder)
---
created_date: 2024-07-08
last_modified_date: 2025-08-07
last_modified_summary: "Updated with deployment status and available MCP servers documentation."
---

This document provides the essential context for the Erfassung Platform (Universal Form Builder) project.

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

## 5. Development Roadmap & Current Status

- **✅ Phase 1:** Frontend MVP with Next.js + Tailwind CSS - Complete
- **🚀 Deployment:** Auto-deployed to Vercel from GitHub main branch at https://formular-erfassung-orangecat.vercel.app
- **⏭️ Phase 2:** Implement tRPC backend with Prisma ORM and PostgreSQL database
- **⏭️ Phase 3:** Integrate with AI for response analysis and form optimization

## 6. Available MCP Servers & Development Tools

This project has access to powerful MCP (Model Context Protocol) servers for enhanced development capabilities:

### Documentation & Learning
- **Context7**: Get up-to-date documentation for any library (Next.js, React, Tailwind, Prisma, etc.)
- Usage: Ask for "latest Next.js documentation" or "React Hook Form examples"

### Testing & Quality Assurance
- **Playwright**: Full browser automation, E2E testing, form interaction, screenshots
- **Puppeteer**: Browser automation alternative with navigation and JavaScript evaluation
- **Browser Tools**: Console logs, network monitoring, accessibility/performance/SEO audits

### Deployment & Infrastructure
- **GitHub**: Repository management, PR reviews, issue tracking, workflow automation
- **Vercel**: Deployment monitoring, environment configuration, performance metrics
- **Docker**: Container management for development and production environments

### Development Workflow
1. **Documentation**: Use Context7 for latest library documentation
2. **Testing**: Use Playwright for comprehensive E2E testing
3. **Debugging**: Use Browser Tools for performance and accessibility analysis
4. **Deployment**: Use Vercel tools for monitoring and configuration
5. **Project Management**: Use GitHub for issues and code reviews

### Best Practices
- Always check latest documentation via Context7 before implementation
- Run accessibility and performance audits via Browser Tools
- Use Playwright for automated testing of form workflows
- Monitor deployments and performance via Vercel integration

For more detailed project information, see `VISION.md` and `CLAUDE.md`.