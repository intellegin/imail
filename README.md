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
- **Web variables**: API URLs (with VITE\_ prefix for Vite)

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

### Development

| Command         | Description                   |
| --------------- | ----------------------------- |
| `pnpm dev`      | Start all development servers |
| `pnpm build`    | Build all packages            |
| `pnpm lint`     | Lint all packages             |
| `pnpm lint:fix` | Fix linting issues            |
| `pnpm format`   | Format code                   |
| `pnpm clean`    | Clean build artifacts         |

### Database

| Command                      | Description             |
| ---------------------------- | ----------------------- |
| `pnpm migrate`               | Run database migrations |
| `pnpm migrate:rollback`      | Rollback migrations     |
| `pnpm migrate:create <name>` | Create new migration    |

### Production

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm start` | Start production servers |
| `pnpm build` | Build for production     |

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
