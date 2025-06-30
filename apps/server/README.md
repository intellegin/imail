# Server API

Node.js Express API with TypeScript, Auth0 authentication, and Supabase user management.

## Features

- **Express.js** with TypeScript
- **Auth0** OIDC authentication
- **Supabase** database integration for user management
- **Automatic user upsert** on login
- **User status tracking** (active/inactive)
- **RESTful API** endpoints
- **Swagger documentation**
- **CORS** support

## Authentication Flow

### User Login Process

When a user logs in through Auth0:

1. User authenticates via Auth0
2. Call `POST /api/auth/login` endpoint
3. Server extracts user data from Auth0 token
4. Server upserts user in Supabase with `is_active = true`
5. Returns user data from database

### User Logout Process

When a user logs out:

1. Call `POST /api/auth/logout` endpoint
2. Server updates user's `is_active` status to `false`
3. User session is terminated

### Example Usage

```javascript
// Login (after Auth0 authentication)
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Include cookies for session
});

const { user } = await loginResponse.json();
console.log('User logged in:', user);

// Logout
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

console.log('User logged out');
```

## User Schema (Supabase)

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  picture_url TEXT,
  role TEXT DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  user_metadata JSONB,
  app_metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Auth0 Configuration
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
SESSION_SECRET=your-super-long-session-secret

# Server Configuration
PORT=3000
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication

- `GET /api/auth/check-auth` - Check authentication status
- `POST /api/auth/login` - Handle user login and upsert
- `POST /api/auth/logout` - Handle user logout and update status
- `GET /api/auth/profile` - Get user profile from database
- `GET /api/auth/verify` - Verify authentication and get user data

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/auth0/:auth0_id` - Get user by Auth0 ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. Set up your Supabase table using the schema above

4. Start development server:

   ```bash
   pnpm dev
   ```

5. View API documentation at `http://localhost:3000/api-docs`

## User Management Features

- **Automatic Upsert**: Users are automatically created or updated when they log in
- **Status Tracking**: `is_active` field tracks whether user is currently logged in
- **Metadata Storage**: Store Auth0 user and app metadata
- **Email Verification**: Track email verification status from Auth0
- **Role Management**: Assign roles to users (defaults to 'user')

The system seamlessly handles user data synchronization between Auth0 and your Supabase database, ensuring you always have up-to-date user information while tracking login/logout activity.
