# CLAUDE.md - AI Assistant Context for DataCat Platform
---
created_date: 2024-07-08
last_modified_date: 2025-08-12
last_modified_summary: "Updated to reflect DataCat rebranding and current project state with production deployments."
---

## Project Overview
**DataCat** is the **most perfect, universally customizable data ingestion platform** built for any client, any domain, any use case. The core workflow is:

**Data Ingestion → AI Analysis → Information/Action Delivery**

### 1. **Universal Data Ingestion** (Infinitely customizable)
   - **Form-based**: Custom forms for any domain - medical, legal, scientific, business, government
   - **Visual capture**: Photos, documents, scans, video analysis
   - **Direct upload**: Files, APIs, real-time data streams
   - **IoT integration**: Sensors, devices, automated data feeds
   - **Custom interfaces**: Tailored for each client's specific workflow

### 2. **AI Analysis Engine** (Domain-specific intelligence)
   - **Custom LLM pipelines** trained for client's specific domain
   - **Multi-modal processing**: Text, images, audio, structured data
   - **Real-time analysis** with configurable processing rules
   - **Pattern recognition** adapted to client's business logic
   - **Validation and quality control** based on domain requirements

### 3. **Action-Oriented Delivery** (Human + Machine clients)
   - **Human recipients**: Professionals receive dashboards, reports, alerts, recommendations
   - **Machine action**: Robots, automation systems, IoT devices receive commands
   - **System integration**: Direct API calls to client's existing infrastructure
   - **Automated workflows**: Trigger actions based on analyzed data
   - **Custom outputs**: Any format the client needs - JSON, XML, database writes, physical actions

### Complete Customization for Every Client
DataCat is designed to be **perfectly customized** for each client's unique requirements. Whether you're:
- A hospital needing patient data → diagnosis support → robotic surgery guidance
- A law firm processing cases → legal analysis → automated document generation
- A manufacturer capturing quality data → defect detection → robotic sorting
- A research lab collecting samples → AI analysis → automated lab equipment control

**DataCat adapts to become your perfect data ingestion and action platform.**

## Current Status
- **Phase 1**: Frontend MVP (Next.js + Tailwind CSS) - ✅ Complete
- **Phase 2**: Production backend architecture planning
- **Active Development**: Form sharing system and LLM response analysis
- **Deployment**: Auto-deployed to Vercel from GitHub main branch at https://datacat-platform.vercel.app
- **Next Phases**: Multi-user collaboration, real-time form responses, AI-powered insights

## Tech Stack

### Frontend (Current Focus)
- **Framework**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4 + PostCSS
- **TypeScript**: Full TypeScript support
- **React**: Version 19.0.0
- **Fonts**: Geist Sans & Geist Mono
- **Planned**: React Hook Form/Formik, Zod/Yup validation, Framer Motion

### Production Stack (In Development)
- **Backend**: tRPC + Prisma ORM
- **Database**: PostgreSQL with connection pooling
- **Auth**: NextAuth.js v5 with multiple providers
- **Real-time**: WebSockets for live collaboration
- **Queue System**: Background job processing
- **AI Integration**: OpenAI GPT-4/Gemini for response analysis
- **Form Sharing**: Public/private links with access controls
- **Response Collection**: Multi-user submission handling

## Project Structure
```
/
├── frontend/                 # Next.js application (DataCat UI)
│   ├── src/app/             # App Router pages
│   │   ├── builder/         # Form builder interface
│   │   ├── erfassung/       # Product capture workflows
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services and integrations
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Production backend (tRPC + Prisma)
│   ├── controllers/         # Route handlers
│   ├── services/            # Business logic services
│   ├── trpc/               # tRPC routers and procedures
│   ├── prisma/             # Database schema and migrations
│   └── package.json         # Backend dependencies
├── docs/                    # Documentation
│   ├── architecture/        # Technical architecture docs
│   ├── business/           # Business requirements and use cases
│   ├── deployment/         # Deployment guides
│   └── getting-started/    # Development setup guides
├── tests/                   # E2E tests (Playwright)
├── docker-compose.yml       # Development environment
├── VISION.md               # Detailed project vision & roadmap
├── README.md               # Basic project info
└── CLAUDE.md               # This file
```

## Key Commands

### Development
```bash
cd frontend
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Formatting**: Follow existing code style

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement responsive design (mobile-first)
- Use semantic HTML and accessible components

### Form Development Priorities
1. **UX-First**: Forms should be intuitive and beautiful
2. **Dynamic Fields**: Support adding/removing fields per form
3. **Real-time Validation**: Immediate feedback
4. **Auto-save**: Preserve progress in localStorage
5. **Accessibility**: WCAG 2.1 AA compliance

### AI Integration Preparation
- Design components to be schema-driven
- Avoid hardcoded logic
- Store field metadata for future AI parsing
- Structure data for LLM consumption

## Current Development Goals
- [x] Complete modern form builder with drag-drop interface
- [x] Implement multi-step form creation and management
- [x] Add comprehensive template library system
- [x] Create product capture workflow (Erfassung)
- [x] Build responsive UI with consumer-grade UX
- [ ] Implement real-time collaboration features
- [ ] Add AI-powered response analysis
- [ ] Build advanced export and integration capabilities

## Testing Strategy
- Manual testing for UX/UI during Phase 1
- Unit tests for form logic
- Integration tests for API calls (Phase 2)
- End-to-end tests for complete workflows

## Performance Targets
- Form completion time: < 3 minutes
- API responses: < 200ms (Phase 2)
- Mobile-responsive on all devices
- Lighthouse score: > 90

## Security Considerations
- Input validation on both client and server
- XSS prevention
- CSRF protection (Phase 2)
- Secure authentication implementation (Phase 2)

## Future Considerations
- Multi-tenant architecture for different organizations
- Custom field types and validation rules
- Export capabilities (PDF, CSV, etc.)
- Integration with existing HR systems
- AI-powered form optimization

## Available MCP Servers & Tools

This project has access to several MCP (Model Context Protocol) servers that provide powerful development and deployment capabilities:

### Documentation & Learning
- **Context7** (`context7`): Access up-to-date documentation and code examples for any library or framework. Use this to get the latest docs for Next.js, React, Tailwind, tRPC, Prisma, etc.

### Browser Automation & Testing
- **Playwright** (`playwright`): Full browser automation including navigation, screenshots, form interaction, file uploads, and HTTP requests
- **Puppeteer** (`puppeteer`): Alternative browser automation with navigation, screenshots, clicking, and JavaScript evaluation
- **Browser Tools** (`browser-tools`): Console logs, network errors, accessibility audits, performance audits, SEO audits, and debugging tools

### Development & Infrastructure
- **GitHub** (`github`): Complete GitHub integration for repositories, issues, pull requests, workflows, and project management
- **Vercel** (`vercel`): Deployment management, project configuration, environment variables, and production monitoring
- **Docker** (`docker`): Container management, image building, network configuration, and volume management

### Usage Examples
```bash
# Get latest Next.js documentation
context7: "Next.js app router documentation"

# Run E2E tests
playwright: navigate → fill forms → screenshot → assert

# Check deployment status
vercel: get deployment logs and status

# Review PRs and manage issues
github: list issues, create PRs, review code

# Debug frontend issues
browser-tools: check console errors, run accessibility audit
```

### Best Practices
- Use Context7 for any library documentation needs
- Use Playwright for comprehensive E2E testing
- Use GitHub tools for issue management and code reviews
- Use Vercel tools for deployment monitoring and configuration
- Use Browser Tools for debugging and optimization

## Resources
- **Vision Document**: See VISION.md for detailed project scope
- **Next.js Docs**: https://nextjs.org/docs (or use Context7 for latest)
- **Tailwind CSS**: https://tailwindcss.com/docs (or use Context7 for latest)
- **React Hook Form**: https://react-hook-form.com/ (planned)
- **MCP Documentation**: https://modelcontextprotocol.io/

## Notes for AI Assistant
- Focus on Phase 1 frontend development
- Prioritize user experience over complex features
- Keep components modular and reusable
- Test thoroughly before moving to next phase
- Follow the guiding principle: "Make it beautiful. Make it obvious. Make it fast."