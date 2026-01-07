# DataCat - Universal AI-Powered Data Capture System
---
created_date: 2024-07-08
last_modified_date: 2025-08-12
last_modified_summary: "Updated to reflect DataCat rebranding and current production deployment status."
---

## 🎯 What is DataCat?

**DataCat** is the **most perfect, universally customizable data ingestion platform** designed to be perfectly tailored for any client, any domain, any use case.

### The Universal Pipeline:

**📥 Data Ingestion → 🤖 AI Analysis → 🚀 Information/Action Delivery**

#### 📥 **Infinite Data Ingestion**
- **Custom Forms**: Perfectly designed for your domain - medical, legal, research, business
- **Multi-Modal Capture**: Photos, documents, audio, video, IoT sensors, real-time streams
- **API Integration**: Connect to any existing system or data source
- **Custom Interfaces**: Built specifically for your workflow and requirements

#### 🤖 **Domain-Specific AI Analysis**  
Each client gets a **custom AI engine** trained for their specific needs:
- **Custom LLM pipelines** adapted to your domain language and logic
- **Multi-modal processing** handling any data type you need
- **Real-time analysis** with your specific business rules
- **Quality validation** based on your industry standards

#### 🚀 **Action-Oriented Delivery**
**Human Recipients**: Get dashboards, reports, alerts, and recommendations in your preferred format
**Machine Action**: **Robots, automation systems, and IoT devices** receive direct commands and control signals
**System Integration**: Direct integration with your existing infrastructure and workflows

### Perfect Customization Examples:
- **🏥 Hospital**: Patient intake → AI diagnosis support → **Robotic surgery guidance**
- **⚖️ Law Firm**: Case data → Legal analysis → **Automated document generation**
- **🏭 Manufacturing**: Quality data → Defect detection → **Robotic sorting and quality control**
- **🔬 Research Lab**: Sample data → AI analysis → **Automated lab equipment control**
- **🌾 Agriculture**: Sensor data → Crop analysis → **Automated irrigation and harvesting robots**

**DataCat becomes your perfect data ingestion platform - custom-built for exactly what you need.**

## Development Workflow

To start both the frontend and backend development servers at once, run:

```
npm run dev
```

This will:
- Start the **frontend** (Next.js) on [http://localhost:3000](http://localhost:3000)
- Start the **backend** (Express) on [http://localhost:5001](http://localhost:5001)

You can then visit these URLs in your browser to access the running applications.

## Rebranding System

DataCat includes a **configuration-driven branding system** that makes it easy to rebrand the entire application for different markets or clients.

### Quick Rebranding

Apply predefined branding presets:

```bash
# DataCat (Default)
./scripts/dev/rebrand.sh datacat

# HR/Talent Management
./scripts/dev/rebrand.sh hr

# Medical/Healthcare
./scripts/dev/rebrand.sh medical

# Legal Services
./scripts/dev/rebrand.sh legal

# Government/Public Sector
./scripts/dev/rebrand.sh government

# Generic/White Label
./scripts/dev/rebrand.sh generic
```

### Custom Branding

Create custom branding with your own brand name and use case:

```bash
./scripts/dev/rebrand.sh custom "MyApp" "Data Capture"
```

### How It Works

- **Environment-based**: Branding is controlled through environment variables
- **Preset system**: Predefined configurations for common use cases
- **React hooks**: Easy access to branding values throughout the application
- **Zero code changes**: Rebrand without touching component code

For detailed documentation, see [docs/development/rebranding.md](docs/development/rebranding.md).

## ✨ Architecture

### **Frontend**
- **Next.js 15.3.5** with App Router
- **React 19.0.0** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management

### **Backend**
- **Node.js** with Express.js
- **Prisma ORM** with PostgreSQL
- **tRPC** for type-safe APIs
- **Multi-LLM Integration** (OpenAI, Claude, custom models)

### **Database**
- **PostgreSQL** with JSONB support
- **Redis** for caching and job queues
- **Prisma Migrations** for schema management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- (Optional) Docker for database setup

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd datacat

# Install dependencies
npm install
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development servers
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Form Builder**: http://localhost:3000/builder

## 📊 Business Model

### **Free Tier: DataCat Basic**
- 5 active forms, 100 responses/month
- Basic LLM analysis
- Community support

### **Pro Tier: DataCat Professional** ($29/month)
- Unlimited forms and responses
- Advanced LLM analysis
- Export and collaboration features

### **Enterprise Tier: DataCat Enterprise** ($99/month)
- Premium LLM models
- Advanced analytics and API access
- Priority support and SSO

## 🛠️ Development

### **Current Status**
- ✅ **Phase 1**: Frontend MVP with form builder
- 🚧 **Phase 2**: Backend integration and authentication
- 🔮 **Phase 3**: AI integration and advanced features

### **Getting Started**
- [Development Setup](docs/getting-started/development-setup.md)
- [Architecture Overview](docs/architecture/README.md)
- [API Documentation](docs/api/README.md)

### **Contributing**
- [Contributing Guidelines](docs/contributing/README.md)
- [Code Standards](docs/development/coding-standards.md)
- [Testing Strategy](docs/development/testing.md)

## 📄 Documentation

- [Getting Started](docs/getting-started/README.md)
- [Business Case](docs/business/README.md)
- [Use Cases](docs/business/use-cases.md)
- [Architecture](docs/architecture/README.md)
- [API Reference](docs/api/README.md)
- [User Guides](docs/user-guides/README.md)

## 🤝 Community

- **Issues**: [GitHub Issues](https://github.com/your-org/datacat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/datacat/discussions)
- **Documentation**: [docs/](docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Roadmap

### **Q1 2025**
- Complete backend integration
- User authentication and form libraries
- Basic LLM analysis features

### **Q2 2025**
- Advanced context management
- Multi-LLM provider support
- Template library expansion

### **Q3 2025**
- Third-party integrations
- Advanced analytics dashboard
- Enterprise features

### **Q4 2025**
- White-label solutions
- API marketplace
- International expansion

---

**Transform your data capture into intelligence. Start building with DataCat today.**

🚀 **Now deployed on Vercel with automated CI/CD from GitHub!**
