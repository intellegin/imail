# Database Package (@imail/db)

This package manages database migrations for the imail project using `node-pg-migrate` with PostgreSQL databases.

## Configuration

### For Hosted PostgreSQL

1. Set up your PostgreSQL database and get your connection string
2. Add the following environment variable:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@host:port/database
   ```

### For Local PostgreSQL

1. Use the existing `DATABASE_URL` from your local setup
2. Start the local database: `pnpm db:start`

## Usage

### Running Migrations on Production

```bash
# Run all pending migrations
pnpm migrate

# Rollback the last migration
pnpm migrate:down

# Rollback multiple migrations
pnpm migrate:down --count 2

# Rollback to a specific migration
pnpm migrate:down --to 001
```

### Creating New Migrations

```bash
# Create a new migration file
pnpm migrate:create my_migration_name
```

### Local Development

```bash
# Start local PostgreSQL
pnpm db:start

# Run migrations locally
pnpm migrate

# Stop local PostgreSQL
pnpm db:stop

# Reset local database (removes all data)
pnpm db:reset
```

## Migration Files

Migration files are located in `./migrations/` and follow the naming convention:

- `001_create_users_table.sql`
- `002_add_indexes.sql`
- etc.

## Initial Setup

The `init.sql` file contains:

- Required PostgreSQL extensions (uuid-ossp)
- Utility functions for migrations (e.g., `update_updated_at_column()`)

This file is automatically executed when using Docker Compose for local development.

## Rollback Capabilities

All migrations include rollback functionality using the `-- Down` comment syntax:

```sql
-- Up migration content here
CREATE TABLE example (...);

-- Down
DROP TABLE IF EXISTS example;
```

**Important Notes:**

- Rollbacks drop resources in reverse dependency order
- Always test rollbacks on local environment first
- Take database backups before production rollbacks

## Best Practices

1. **Test locally first**: Always test your migrations on local PostgreSQL before running on production
2. **Backup before migrating**: Take a backup of your production database before running migrations
3. **Use transactions**: Most migrations should be wrapped in transactions for safety
4. **Keep migrations small**: Create focused migrations that do one thing well
5. **Test rollbacks**: Verify rollback functionality in development before deploying

## Structure

```
packages/db/
├── data/              # PostgreSQL data volume (gitignored)
├── migrations/        # Database migration files
├── init.sql          # Database initialization script
├── pg-migrate.config.json  # Migration tool configuration
└── docker-compose.yml      # Database service configuration
```

## Environment Variables

Make sure these are set in your root `.env` file:

- `DB_NAME`
