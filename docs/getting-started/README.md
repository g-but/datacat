# Getting Started with Universal Form Builder

---
created_date: 2025-07-28
last_modified_date: 2025-07-28
last_modified_summary: "Initial creation of getting started guide"
---

## Overview

The Universal Form Builder is an AI-ready intake system framework designed to collect data for any domain via a beautiful, dynamic frontend and eventually feed that data to AI pipelines for downstream automation.

**Current Status**: Phase 1 (Frontend MVP) with backend integration in development.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- (Optional) Docker for database setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd formular

# Install root dependencies
npm install

# Install frontend dependencies  
cd frontend && npm install --legacy-peer-deps
cd ..
```

### 2. Start Development Servers

```bash
# Start both frontend and backend
npm run d
```

This will start:
- **Frontend** (Next.js): http://localhost:3000
- **Backend** (Express): http://localhost:5000

### 3. Access the Application

- **Form Builder**: http://localhost:3000/builder
- **Forms List**: http://localhost:3000/forms
- **API Health**: http://localhost:5000

## Project Structure

```
/
├── frontend/                 # Next.js application
│   ├── src/app/             # App Router pages and components
│   └── src/components/      # Shared components
├── backend/                 # Express.js API
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth and validation
│   ├── routes/             # API routes
│   └── db/                 # Database setup
├── docs/                   # Documentation (you are here)
├── scripts/                # Development scripts
└── CLAUDE.md               # AI assistant context
```

## Key Features

### ✅ Current Features (Phase 1)
- **Dynamic Form Builder**: Create forms with drag-and-drop interface
- **Multi-step Forms**: Support for complex, multi-page forms
- **Field Types**: Text, textarea, number, date, select, checkbox, radio
- **Template System**: Pre-built form templates
- **Rebranding System**: Configuration-driven branding for different use cases
- **Real-time Preview**: See changes immediately
- **Local Storage**: Auto-save progress

### 🚧 In Development (Phase 2)
- **Backend Integration**: Full API connectivity
- **Database Persistence**: PostgreSQL with migrations
- **User Authentication**: Secure login system
- **Form Publishing**: Share forms publicly
- **Submission Management**: View and manage form responses

### 🔮 Planned (Phase 3)
- **AI Integration**: LLM-powered form analysis and suggestions
- **Advanced Analytics**: Form performance insights
- **Collaboration**: Multi-user form editing
- **Integrations**: Connect with external services

## Next Steps

1. **Read the Architecture**: [System Architecture](../architecture/README.md)
2. **Set up Development Environment**: [Development Setup](development-setup.md)
3. **Understand the Workflow**: [Development Workflow](../development/workflow.md)
4. **Explore the Rebranding System**: [Rebranding Guide](../development/rebranding.md)

## Getting Help

- **Documentation**: Browse the `/docs` directory
- **Issues**: Check existing issues or create new ones
- **AI Assistant**: Refer to `CLAUDE.md` for AI context

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form (planned)
- **Validation**: Zod (planned)

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **ORM**: Raw SQL (migrations planned)

### Development
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Git Hooks**: Planned (Husky)
- **Testing**: Planned (Jest, React Testing Library)

---

Ready to build? Let's start with [Development Setup](development-setup.md)!