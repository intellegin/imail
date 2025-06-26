# iMail 

## 🏗️ Architecture

This project is structured as a monorepo containing:

- **`server/`** - Node.js Express API with TypeScript and PostgreSQL
- **`web/`** - React frontend application with Vite and TypeScript

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

### Running Individual Tasks
```bash
# Build only server
turbo build --filter=server

# Lint only web
turbo lint --filter=web

# Run with dependencies
turbo build --filter=web...
```

## 📈 Turborepo Features

- **Fast Builds**: Intelligent caching and parallelization
- **Remote Caching**: Share build cache across team (configurable)
- **Dependency Graphs**: Automatic task orchestration
- **Hot Reloading**: Efficient development experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `pnpm lint && pnpm build`
5. Submit a pull request
