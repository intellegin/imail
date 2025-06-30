import { Pool, PoolClient, QueryResult } from 'pg';
declare const pool: Pool;
export declare const checkDatabaseConnection: () => Promise<boolean>;
export declare const getClient: () => Promise<PoolClient>;
export declare const query: (text: string, params?: any[]) => Promise<QueryResult>;
export declare const closePool: () => Promise<void>;
export default pool;
