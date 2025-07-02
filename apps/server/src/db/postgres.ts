import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]): Promise<any> {
  const res = await pool.query(text, params);
  return res;
}

export async function queryWithUser(
  auth0_id: string,
  text: string,
  params?: any[]
): Promise<any> {
  const client = await pool.connect();
  try {
    await client.query('SET row_security = on');
    await client.query("SET session_replication_role = 'origin'");
    await client.query('SET ROLE postgres');
    await client.query(`SET request.jwt.claim.sub = '${auth0_id}'`);
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function queryAsSystem(
  text: string,
  params?: any[]
): Promise<any> {
  const client = await pool.connect();
  try {
    await client.query('SET row_security = off');
    await client.query("SET session_replication_role = 'origin'");
    await client.query('SET ROLE postgres');
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}
