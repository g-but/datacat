# CLAUDE.md - AI Assistant Context for Kivi-HR
---
created_date: 2024-07-08
last_modified_date: 2025-07-08
last_modified_summary: "Added documentation metadata block."
---

## Project Overview
Kivi-HR is an AI-ready intake system framework, starting with an HR use case. It's a modular form builder and data pipeline that will eventually integrate with LLMs for intelligent task matching, skill analysis, and hiring guidance.

## Current Status
- **Phase 1**: Frontend MVP (Next.js + Tailwind CSS)
- **Active Development**: Building beautiful, dynamic HR intake forms
- **Next Phases**: Backend integration, AI/LLM integration

## Tech Stack

### Frontend (Current Focus)
- **Framework**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4 + PostCSS
- **TypeScript**: Full TypeScript support
- **React**: Version 19.0.0
- **Fonts**: Geist Sans & Geist Mono
- **Planned**: React Hook Form/Formik, Zod/Yup validation, Framer Motion

### Future Stack (Planned)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Clerk or Supabase Auth
- **AI Integration**: OpenAI GPT-4/Gemini

## Project Structure
```
/
├── frontend/                 # Next.js application
│   ├── src/app/             # App Router pages
│   │   ├── layout.tsx       # Root layout with fonts
│   │   ├── page.tsx         # Home page (default Next.js)
│   │   └── globals.css      # Global styles
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
├── VISION.md                # Detailed project vision & roadmap
├── README.md                # Basic project info
└── CLAUDE.md                # This file
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

## Current Phase 1 Goals
- [ ] Replace default Next.js page with HR intake form
- [ ] Implement dynamic field management
- [ ] Add form validation and error handling
- [ ] Implement localStorage persistence
- [ ] Create beautiful, consumer-grade UX
- [ ] Add microinteractions and animations

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

## Resources
- **Vision Document**: See VISION.md for detailed project scope
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com/ (planned)

## Notes for AI Assistant
- Focus on Phase 1 frontend development
- Prioritize user experience over complex features
- Keep components modular and reusable
- Test thoroughly before moving to next phase
- Follow the guiding principle: "Make it beautiful. Make it obvious. Make it fast."