const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client } = require('pg');

async function createDatabaseIfNotExists(client, dbName) {
  const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created`);
  } else {
    console.log(`Database "${dbName}" already exists`);
  }
}

async function applySchema(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
  console.log('Schema applied from', filePath);
}

async function main() {
  const DB_USER = process.env.DB_USER || 'postgres';
  const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT || 5432;
  const DB_NAME = process.env.DB_NAME || 'aquila_db';

  // connect to default postgres DB to create the project DB if needed
  const adminClient = new Client({ user: DB_USER, host: DB_HOST, database: 'postgres', password: DB_PASSWORD, port: DB_PORT });
  await adminClient.connect();
  try {
    await createDatabaseIfNotExists(adminClient, DB_NAME);
  } finally {
    await adminClient.end();
  }

  // connect to project DB and apply schema
  const projectClient = new Client({ user: DB_USER, host: DB_HOST, database: DB_NAME, password: DB_PASSWORD, port: DB_PORT });
  await projectClient.connect();
  try {
    const initPath = path.join(__dirname, '..', 'init_db.sql');
    await applySchema(projectClient, initPath);
  } finally {
    await projectClient.end();
  }

  console.log('Database ready');
}

main().catch(err => {
  console.error('Init DB error:', err);
  process.exit(1);
});
