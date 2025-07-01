# 🐳 Docker Deployment Guide

This guide walks you through building and deploying the iMail server using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (optional)
- Docker Hub account (for publishing)

## Quick Start

### 1. Build the Docker Image

```bash
./scripts/build-docker.sh
```

This builds and tags the image as `dndventuress/imail-server:latest`.

### 2. Push to Docker Hub

```bash
./scripts/push-docker.sh
```

Or manually:
```bash
docker login
docker push dndventuress/imail-server:latest
```

### 3. Use Published Image

Pull and run the published image:
```bash
docker pull dndventuress/imail-server:latest
docker run -d \
  --name imail-server \
  -p 3000:3000 \
  --env-file .env \
  dndventuress/imail-server:latest
```

### 4. Environment Variables

Create a `.env` file in the project root with:

```env
DATABASE_URL=postgresql://username:password@host:port/database
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
SESSION_SECRET=your_32_character_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=production
```

**Note**: `BASE_URL` is optional. If not provided, the server will auto-detect the URL from incoming requests. This is perfect for Docker deployments where the final URL is unknown.

## Production Deployment

### Flexible URL Configuration

The server supports three URL configuration modes:

1. **Static URL** (traditional):
   ```env
   BASE_URL=https://api.yourdomain.com
   ```

2. **Dynamic Detection** (recommended for Docker):
   ```env
   # BASE_URL not set - auto-detects from requests
   ```

3. **Runtime Override**:
   ```bash
   docker run -e BASE_URL=https://api.yourdomain.com dndventuress/imail-server:latest
   ```

### Using Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  server:
    image: dndventuress/imail-server:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
      - AUTH0_ISSUER_BASE_URL=${AUTH0_ISSUER_BASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
      # BASE_URL is optional - will auto-detect if not set
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Examples

#### AWS ECS/Fargate
```bash
# Using published image
aws ecs create-service \
  --cluster my-cluster \
  --service-name imail-server \
  --task-definition imail-task \
  --desired-count 1
```

#### Google Cloud Run
```bash
gcloud run deploy imail-server \
  --image=dndventuress/imail-server:latest \
  --set-env-vars="DATABASE_URL=$DATABASE_URL" \
  --allow-unauthenticated \
  --port=3000
```

#### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: imail-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: imail-server
  template:
    metadata:
      labels:
        app: imail-server
    spec:
      containers:
      - name: imail-server
        image: dndventuress/imail-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: "postgresql://..."
        - name: AUTH0_CLIENT_ID
          value: "your_client_id"
```

#### Railway
```bash
railway login
railway new
railway add --image dndventuress/imail-server:latest
```

### Database Migrations

Run migrations before starting the server:

```bash
pnpm run db:migrate
```

### Auth0 Configuration

The server auto-detects its URL, but you still need to configure Auth0:

1. **Allowed Callback URLs**:
   ```
   https://your-domain.com/callback
   ```

2. **Allowed Logout URLs**:
   ```
   https://your-domain.com/logout
   ```

3. **Development URLs** (if testing locally):
   ```
   http://localhost:3000/callback
   http://localhost:3000/logout
   ```

## Docker Hub Repository

The image is published to: https://hub.docker.com/r/dndventuress/imail-server

**Available tags:**
- `latest` - Latest stable release
- Semantic versions (e.g., `1.0.0`, `1.1.0`)

## URL Detection

The server detects URLs using:

1. `X-Forwarded-Proto` header (HTTPS/HTTP)
2. `X-Forwarded-Host` header (domain)
3. Falls back to `Host` header and `req.protocol`

This works automatically with:
- Load balancers (ALB, nginx)
- Reverse proxies
- Cloud platforms (Heroku, Cloud Run, etc.)
- Container orchestration (Docker Swarm, Kubernetes)

## Monitoring

Check container status:
```bash
docker logs imail-server
```

Health endpoint:
```bash
curl https://your-domain.com/api/health
```

## Troubleshooting

### Build Issues

Ensure all dependencies are properly installed:
```bash
pnpm install
pnpm build
```

### URL Detection Issues

If auto-detection fails, manually set BASE_URL:
```bash
docker run -e BASE_URL=https://your-domain.com dndventuress/imail-server:latest
```

### Behind Proxy/Load Balancer

Ensure your proxy sets these headers:
```
X-Forwarded-Proto: https
X-Forwarded-Host: your-domain.com
```

### Port Issues

Ensure port 3000 is not in use and properly exposed in your deployment environment.

## Security Considerations

- Use strong session secrets (32+ characters)
- Enable SSL/TLS in production
- Use secure database connections
- Regularly update Docker base images
- Scan images for vulnerabilities
- Ensure proxy headers are from trusted sources

## Multi-Stage Build

The Dockerfile uses multi-stage builds for:
- Reduced image size
- Better security (production image doesn't include dev dependencies)
- Faster deployments 