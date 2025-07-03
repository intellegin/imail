import { Pool, PoolClient, QueryResult } from 'pg';

import { config } from '../config/env';

const pool = new Pool({
  host: config.database.host,
  port: parseInt(config.database.port ?? '6543', 10),
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    const dbTime = result.rows[0].current_time;
    const dbVersion = result.rows[0].version;

    console.log('✅ Database connection successful');
    console.log(`📅 Database time: ${dbTime}`);
    console.log(`🗄️ ` + `Database version: ${dbVersion.split(' ').slice(0, 2).join(' ')}`);

    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log('Executed query:', { text, duration, rows: res.rowCount });
  }

  return res;
};

export const queryWithUser = async (auth0Id: string, text: string, params?: any[]): Promise<QueryResult> => {
  const client = await pool.connect();

  try {
    const start = Date.now();

    // Set the current user context for RLS policies
    await client.query('SELECT set_config($1, $2, true)', ['app.current_user_auth0_id', auth0Id]);

    const res = await client.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query with user context:', {
        auth0Id,
        text,
        duration,
        rows: res.rowCount,
      });
    }

    return res;
  } finally {
    client.release();
  }
};

// Function to execute multiple queries in a transaction with user context
export const transactionWithUser = async (auth0Id: string, callback: (client: PoolClient) => Promise<any>): Promise<any> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Set the current user context for RLS policies
    await client.query('SELECT set_config($1, $2, true)', ['app.current_user_auth0_id', auth0Id]);

    const result = await callback(client);
    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Function to execute queries with system privileges (bypasses RLS)
export const queryAsSystem = async (text: string, params?: any[]): Promise<QueryResult> => {
  const client = await pool.connect();

  try {
    const start = Date.now();

    // Set system context to bypass RLS policies
    await client.query('SELECT set_config($1, $2, true)', ['app.system_context', 'true']);

    // Execute the actual query
    const res = await client.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed system query:', {
        text,
        duration,
        rows: res.rowCount,
      });
    }

    return res;
  } finally {
    client.release();
  }
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;
