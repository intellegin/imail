import dotenv from 'dotenv';
import { Pool, PoolClient, QueryResult } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '6543', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', err => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT NOW() as current_time, version() as version'
    );
    const dbTime = result.rows[0].current_time;
    const dbVersion = result.rows[0].version;

    console.log('✅ Database connection successful');
    console.log(`📅 Database time: ${dbTime}`);
    console.log(
      `🗄️ Database version: ${dbVersion.split(' ').slice(0, 2).join(' ')}`
    );

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

export const query = async (
  text: string,
  params?: any[]
): Promise<QueryResult> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log('Executed query:', { text, duration, rows: res.rowCount });
  }

  return res;
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;

