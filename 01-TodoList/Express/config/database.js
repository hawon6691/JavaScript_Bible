/**
 * MySQL 데이터베이스 설정
 *
 * What: MySQL 연결 풀 생성 및 관리
 * Why: 효율적인 DB 연결 관리, 연결 재사용
 * How: mysql2/promise를 사용한 커넥션 풀
 */

const mysql = require('mysql2/promise');

// 연결 풀 (싱글톤)
let pool = null;

/**
 * 데이터베이스 설정
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'todolist',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

/**
 * 연결 풀 가져오기 (싱글톤)
 *
 * @returns {Pool} MySQL 연결 풀
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * 데이터베이스 연결 테스트
 */
async function testConnection() {
  const connection = await getPool().getConnection();
  try {
    await connection.ping();
    console.log('  Database connected successfully');
    return true;
  } finally {
    connection.release();
  }
}

/**
 * todos 테이블 생성 (없으면)
 */
async function initializeTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS todos (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(500) DEFAULT '',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      INDEX idx_createdAt (createdAt DESC),
      INDEX idx_completed (completed)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  const pool = getPool();
  await pool.execute(createTableSQL);
  console.log('  Todos table initialized');
}

/**
 * 데이터베이스 초기화
 */
async function initialize() {
  await testConnection();
  await initializeTable();
}

/**
 * 연결 풀 종료
 */
async function close() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('  Database connection closed');
  }
}

module.exports = {
  getPool,
  testConnection,
  initializeTable,
  initialize,
  close,
};
