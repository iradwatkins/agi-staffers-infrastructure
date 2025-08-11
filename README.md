# AGI Staffers Infrastructure

Comprehensive VPS management system for AGI Staffers multi-tenant hosting platform.

[![CI/CD Pipeline](https://github.com/iradwatkins/agi-staffers-infrastructure/actions/workflows/main-cicd.yml/badge.svg)](https://github.com/iradwatkins/agi-staffers-infrastructure/actions/workflows/main-cicd.yml)

## 🚀 Overview

This repository contains the complete infrastructure setup for AGI Staffers, including:
- Multi-tenant website hosting
- PWA admin dashboard
- Automated backup systems
- CI/CD pipelines
- Docker containerized services
- SSL/TLS secured endpoints

## 📦 Services

- **Main Website**: [stepperslife.com](https://stepperslife.com)
- **Admin Dashboard**: [admin.agistaffers.com](https://admin.agistaffers.com)
- **Database Management**: [pgadmin.agistaffers.com](https://pgadmin.agistaffers.com)
- **Workflow Automation**: [n8n.agistaffers.com](https://n8n.agistaffers.com)
- **AI Services**: Multiple AI-powered endpoints

## 🛠️ Technology Stack

- **Frontend**: Next.js PWA with Shadcn/ui
- **Backend**: Node.js microservices
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Reverse Proxy**: Caddy with automatic SSL
- **CI/CD**: GitHub Actions

## 📂 Project Structure

```
.
├── admin-dashboard-local/    # PWA admin dashboard
├── push-notification-api/    # Push notification service
├── backup-system/           # Automated backup scripts
├── .github/workflows/       # CI/CD pipelines
└── docker-compose.yml       # Service orchestration
```

## 🚀 Deployment

This project uses GitHub Actions for automated deployments. Push to `main` branch triggers automatic deployment to production.

## 🔒 Security

- All endpoints secured with SSL/TLS
- Automated security scanning in CI/CD
- Regular automated backups
- Container isolation for services

## 📝 License

© 2025 AGI Staffers. All rights reserved.
