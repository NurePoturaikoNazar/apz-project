const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL; // Render дає цей рядок

const pool = new Pool({
  connectionString: isProduction ? connectionString : undefined,
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'aquila_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false // <--- ЦЕ КРИТИЧНО ДЛЯ NEON
});


pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
