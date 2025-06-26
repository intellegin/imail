# imail Server

A simple Node.js Express API with TypeScript and PostgreSQL.

## Features

- Express.js with TypeScript
- PostgreSQL database with migrations
- CORS enabled
- Environment-based logging (Morgan)
- Swagger API documentation (dev only)
- User CRUD operations

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations:**
   ```bash
   pnpm run migrate
   ```

5. **Start development server:**
   ```bash
   pnpm run dev
   ```

The API will be available at `http://localhost:3001`

## API Documentation

When running in development mode, Swagger documentation is available at:
`http://localhost:3001/api-docs`

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Testing Examples

**Create a user:**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User", "username": "testuser"}'
```

**Get all users:**
```bash
curl http://localhost:3001/api/users
```

**Get user by ID:**
```bash
curl http://localhost:3001/api/users/USER_ID
```

**Update user:**
```bash
curl -X PUT http://localhost:3001/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

**Delete user:**
```bash
curl -X DELETE http://localhost:3001/api/users/USER_ID
```

## Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run migrate` - Run database migrations
- `pnpm run migrate:down` - Rollback migrations
- `pnpm run migrate:create` - Create new migration
- `pnpm run lint` - Lint code
- `pnpm run format` - Format code

## Environment Variables

Copy `env.example` to `.env` and configure:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Allowed CORS origin

## Logging

- **Development**: Uses Morgan 'dev' format (colorized, short)
- **Production**: Uses Morgan 'combined' format (detailed, standard)

## Database

The project uses PostgreSQL with node-pg-migrate for schema management. Database tables:

- `users` - User information (id, email, username, name, timestamps) 