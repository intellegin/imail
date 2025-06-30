# imail

A modern email management application built with React, TypeScript, and Node.js.

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   pnpm run env:setup
   # Edit .env with your actual values
   ```

4. Start development servers:
   ```bash
   pnpm run dev
   ```

## Environment Variables

All environment variables are now consolidated in a single `.env` file at the root level. The file contains:

- **Server variables**: Database, Auth0, Supabase, CORS settings
- **Web variables**: API URLs (with VITE_ prefix for Vite)

Run `pnpm run env:setup` to copy `.env.example` to `.env`, then fill in your actual values.

## Development

- `pnpm run dev` - Start all development servers
- `pnpm run build` - Build all packages  
- `pnpm run lint` - Lint all packages
- `pnpm run check-types` - Type check all packages

## 🏗️ Architecture

This project is structured as a monorepo containing:

- **`server/`** - Node.js Express API with TypeScript and PostgreSQL
- **`web/`** - React frontend application with Vite and TypeScript

## 📋 Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code in all packages |
| `pnpm format:check` | Check code formatting |
| `pnpm test` | Run tests in all packages |
| `pnpm clean` | Clean build artifacts |
| `pnpm migrate` | Run database migrations |
| `pnpm start` | Start production servers |

### Package-Specific Commands

Run commands in specific packages:

```bash
# Server commands
pnpm --filter server dev
pnpm --filter server build
pnpm --filter server migrate

# Web commands  
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview
```

## 🏠 Project Structure

```
imail/
├── server/                 # Backend API
│   ├── src/
│   │   ├── api/           # API routes and controllers
│   │   ├── db/            # Database configuration and migrations
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic services
│   │   └── types/         # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
├── web/                   # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── features/      # Feature-based modules
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── router/        # Application routing
│   ├── package.json
│   └── vite.config.ts
├── package.json           # Root package.json
├── turbo.json            # Turborepo configuration
└── pnpm-workspace.yaml   # pnpm workspace configuration
```

## 🔧 Technology Stack

### Backend (`/server`)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with node-pg-migrate
- **Authentication**: Auth0 with express-openid-connect
- **Development**: nodemon, ts-node
- **Code Quality**: ESLint, Prettier

### Frontend (`/web`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Code Quality**: ESLint, Prettier

### Monorepo Tools
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo
- **Development**: Concurrent development servers

## 🔐 Authentication

The application uses Auth0 for authentication with server-side session management:

1. **Login Flow**: User → Auth0 → Server callback → Frontend redirect
2. **Session Management**: HTTP-only cookies managed by the server
3. **API Security**: All API requests authenticated via session cookies

### Auth0 Configuration

Required Auth0 Dashboard settings:
- **Allowed Callback URLs**: `http://localhost:3000/callback`
- **Allowed Logout URLs**: `http://localhost:5173/login`
- **Allowed Web Origins**: `http://localhost:5173`

## 🚀 Deployment

### Production Build
```bash
pnpm build
```

### Start Production Servers
```bash
pnpm start
```

## 🧪 Development

### Adding New Dependencies

For server:
```bash
pnpm --filter server add <package-name>
```

For web:
```bash
pnpm --filter web add <package-name>
```

### Best Practices
- Use TypeScript strict mode
- Follow REST API conventions
- Implement proper error handling
- Write clean, readable code
- Use meaningful variable names
- Keep functions focused and small

## 🚂 Railway Deployment

Deploy the backend to Railway with ease:

### Prerequisites
- Railway account ([sign up here](https://railway.app))
- GitHub repository connected to Railway

### Quick Deploy
1. **Connect Repository**: Link your GitHub repository to Railway
2. **Add Environment Variables**: Set required environment variables in Railway dashboard
3. **Deploy**: Railway will automatically build and deploy using the included configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Auth0
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# Session & Security
SESSION_SECRET=your_super_secret_session_key

# CORS & URLs
CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
BASE_URL=https://your-api-domain.railway.app
```

### Railway PostgreSQL Service
Railway provides managed PostgreSQL. To use it:
1. Add a PostgreSQL service to your Railway project
2. Railway automatically sets `DATABASE_URL` environment variable
3. No additional database configuration needed

### Deployment Configuration
- **Build**: Uses Turbo to build the server and shared packages
- **Health Check**: Endpoint at `/api/health` for deployment monitoring
- **Auto Restart**: Configured to restart on failure with retry limits
- **Watch Patterns**: Monitors changes in server, shared, and db packages

### Custom Configuration
The project includes both `railway.json` and `nixpacks.toml` for deployment configuration. Railway will automatically detect and use these files.
