# imail

A modern email management application built with React, TypeScript, and Node.js in a monorepo architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+

### Installation & Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd imail
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   pnpm run env:setup
   # Edit .env with your actual values
   ```

3. Run database migrations:
   ```bash
   pnpm migrate
   ```

4. Start development servers:
   ```bash
   pnpm dev
   ```

## 🏗️ Architecture

### Monorepo Structure
```
imail/
├── apps/
│   ├── server/              # Express.js API with TypeScript
│   └── web/                 # React frontend with Vite
├── packages/
│   ├── shared/              # Shared utilities and types
│   └── db/                  # Database migrations
├── package.json             # Root configuration
├── turbo.json              # Turborepo settings
└── pnpm-workspace.yaml     # Workspace configuration
```

### Technology Stack

**Backend (apps/server)**
- Node.js + TypeScript
- Express.js with middleware
- PostgreSQL with node-pg-migrate
- Auth0 authentication
- Row Level Security (RLS)

**Frontend (apps/web)**
- React 19 + TypeScript
- Vite build tool
- React Router v7
- Tailwind CSS v4
- Radix UI components
- React Hook Form + Zod

**Shared Packages**
- TypeScript type definitions
- Database connection utilities
- Common constants and helpers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd imail
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Copy environment files and configure:
   ```bash
   cp server/env.example server/.env
   cp web/env.example web/.env
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   pnpm migrate
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

This will start both the server (port 3000) and web app (port 5173) concurrently.

## 📋 Available Scripts

### Development
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code |
| `pnpm clean` | Clean build artifacts |

### Database
| Command | Description |
|---------|-------------|
| `pnpm migrate` | Run database migrations |
| `pnpm migrate:rollback` | Rollback migrations |
| `pnpm migrate:create <name>` | Create new migration |

### Production
| Command | Description |
|---------|-------------|
| `pnpm start` | Start production servers |
| `pnpm build` | Build for production |

### Package-Specific Commands
```bash
# Server commands
pnpm --filter server dev
pnpm --filter server build

# Web commands  
pnpm --filter web dev
pnpm --filter web build
```

## 🔐 Authentication Flow

The application uses Auth0 with server-side session management:

1. **Login**: User → Auth0 → Server callback → Frontend redirect
2. **Session**: HTTP-only cookies managed by server
3. **API Security**: All requests authenticated via session cookies
4. **Database Security**: Row Level Security (RLS) for data isolation

### Auth0 Configuration
Required settings in Auth0 Dashboard:
- **Callback URLs**: `http://localhost:3000/callback`
- **Logout URLs**: `http://localhost:5173/login` 
- **Web Origins**: `http://localhost:5173`

## 🗄️ Database

### PostgreSQL Setup
- Uses Supabase-hosted PostgreSQL
- Migrations managed with node-pg-migrate
- Row Level Security enabled for multi-tenant data isolation
- Automatic user context switching for security

### Key Tables
- **users**: User profiles with Auth0 integration
- **pgmigrations**: Migration tracking

### Security Features
- RLS policies for authenticated users only
- System bypass for authentication operations
- User context passed to all database operations

## 🚀 Deployment

### Environment Variables
All variables are in a single `.env` file:
- Database connection (`DATABASE_URL`)
- Auth0 configuration
- CORS and API settings
- Vite-prefixed frontend variables

### Production Build
```bash
pnpm build
pnpm start
```

## 🧪 Development Guidelines

### Adding Dependencies
```bash
# Server dependencies
pnpm --filter server add <package>

# Web dependencies  
pnpm --filter web add <package>

# Shared dependencies
pnpm --filter shared add <package>
```

### Code Organization
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and database operations  
- **Types**: Shared TypeScript definitions
- **Constants**: API endpoints and configuration
- **Hooks**: Reusable React logic

### Best Practices
- Use TypeScript strict mode
- Follow REST API conventions
- Implement proper error handling
- Write clean, readable code
- Use meaningful variable names
- Keep functions focused and small
