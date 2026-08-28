import mysql from 'mysql2/promise';

// MySQL/MariaDB connection pool configured for Layerbase
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'ocean_lighting',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.MYSQL_HOST?.includes('layerbase') || process.env.MYSQL_HOST?.includes('psdb.cloud') ? {
    rejectUnauthorized: false
  } : undefined,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('MySQL query error:', error);
    throw error;
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export default pool;
