# 🚂 Railway Deployment Guide

This guide walks you through deploying the iMail backend (server + packages) to Railway.

## Prerequisites

- [Railway account](https://railway.app) (free tier available)
- GitHub repository with your code
- Auth0 application configured

## Step-by-Step Deployment

### 1. Connect to Railway

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your iMail repository
4. Railway will automatically detect the configuration

### 2. Configure Environment Variables

In your Railway project dashboard, add these environment variables:

#### Required Variables
```bash
# Database (Railway PostgreSQL)
DATABASE_URL=<automatically_set_by_railway_postgres_service>

# Auth0 Configuration
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# Session Security
SESSION_SECRET=generate_a_long_random_string_here

# CORS & Frontend URLs
CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 3. Add PostgreSQL Service

1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway automatically provisions database and sets `DATABASE_URL`
3. The database includes all necessary extensions (like pgvector if needed)

### 4. Run Database Migrations

#### Option A: Manual Migration (Recommended for first deployment)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Connect to project: `railway link`
4. Run migrations: `railway run pnpm run db:migrate`

#### Option B: Auto-migration on Deploy
Add this to your `railway.json` deploy section:
```json
{
  "deploy": {
    "preDeployCommand": ["pnpm run db:migrate"],
    "startCommand": "cd apps/server && node dist/index.js"
  }
}
```

### 5. Update Auth0 Configuration

In your Auth0 dashboard:
1. Add Railway domain to **Allowed Callback URLs**:
   ```
   https://your-app-name.railway.app/callback
   ```
2. Add to **Allowed Logout URLs**:
   ```
   https://your-app-name.railway.app/logout
   ```
3. Update **Allowed Web Origins** and **Allowed Origins (CORS)**

### 6. Deploy & Monitor

1. Push changes to GitHub - Railway auto-deploys
2. Check deployment logs in Railway dashboard
3. Test health endpoint: `https://your-app.railway.app/api/health`
4. Monitor with Railway's built-in metrics

## Configuration Files

### `railway.json`
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install --frozen-lockfile && pnpm turbo build --filter=server",
    "watchPatterns": ["apps/server/**", "packages/shared/**", "packages/db/**"]
  },
  "deploy": {
    "startCommand": "cd apps/server && node dist/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_18", "pnpm"]

[phases.install]
cmd = "pnpm install --frozen-lockfile"

[phases.build]
cmd = "pnpm turbo build --filter=server"

[start]
cmd = "cd apps/server && node dist/index.js"

[variables]
NODE_ENV = "production"
PORT = "3000"
```

## Troubleshooting

### Build Failures
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify turbo build works locally: `pnpm turbo build`

### Database Connection Issues
- Verify `DATABASE_URL` is set by PostgreSQL service
- Check database service is running in Railway dashboard
- Test connection with Railway CLI: `railway run psql`

### Auth0 Issues
- Verify callback URLs match Railway domain
- Check environment variables are set correctly
- Test Auth0 configuration in development first

### Health Check Failures
- Ensure `/api/health` endpoint returns 200 status
- Check server starts without errors
- Verify port configuration (Railway sets `PORT` automatically)

## Cost Optimization

### Free Tier Limits
- $5 credit per month
- 500 hours of usage
- 1GB outbound data transfer

### Optimize Usage
- Use Railway's PostgreSQL service (included in compute time)
- Monitor resource usage in dashboard
- Consider hibernation for non-production environments

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run successfully  
- [ ] Auth0 URLs updated with Railway domain
- [ ] Health check endpoint responding
- [ ] SSL certificate (automatic with Railway)
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy for database

## Support

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app)

## Next Steps

After successful deployment:
1. Set up monitoring and logging
2. Configure custom domain (optional)
3. Set up CI/CD workflows
4. Consider staging environment
5. Plan backup and disaster recovery 