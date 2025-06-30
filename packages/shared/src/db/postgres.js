"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.queryAsSystem = exports.transactionWithUser = exports.queryWithUser = exports.query = exports.getClient = exports.checkDatabaseConnection = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({
    host: env_1.config.database.host,
    port: parseInt(env_1.config.database.port ?? '6543', 10),
    database: env_1.config.database.name,
    user: env_1.config.database.user,
    password: env_1.config.database.password,
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
const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as version');
        const dbTime = result.rows[0].current_time;
        const dbVersion = result.rows[0].version;
        console.log('✅ Database connection successful');
        console.log(`📅 Database time: ${dbTime}`);
        console.log(`🗄️ Database version: ${dbVersion.split(' ').slice(0, 2).join(' ')}`);
        client.release();
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
exports.checkDatabaseConnection = checkDatabaseConnection;
const getClient = async () => {
    return await pool.connect();
};
exports.getClient = getClient;
const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log('Executed query:', { text, duration, rows: res.rowCount });
    }
    return res;
};
exports.query = query;
// Function to execute queries with user context for RLS
const queryWithUser = async (auth0Id, text, params) => {
    const client = await pool.connect();
    try {
        const start = Date.now();
        // Set the current user context for RLS policies
        await client.query('SELECT set_config($1, $2, true)', ['app.current_user_auth0_id', auth0Id]);
        // Execute the actual query
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
    }
    finally {
        client.release();
    }
};
exports.queryWithUser = queryWithUser;
// Function to execute multiple queries in a transaction with user context
const transactionWithUser = async (auth0Id, callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Set the current user context for RLS policies
        await client.query('SELECT set_config($1, $2, true)', ['app.current_user_auth0_id', auth0Id]);
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.transactionWithUser = transactionWithUser;
// Function to execute queries with system privileges (bypasses RLS)
const queryAsSystem = async (text, params) => {
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
    }
    finally {
        client.release();
    }
};
exports.queryAsSystem = queryAsSystem;
const closePool = async () => {
    await pool.end();
};
exports.closePool = closePool;
exports.default = pool;
