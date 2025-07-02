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

pool.on('error', err => {
  console.error('Database error:', err);
  process.exit(-1);
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');

    console.log('✅ Database connected');

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
  const res = await pool.query(text, params);
  return res;
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;

