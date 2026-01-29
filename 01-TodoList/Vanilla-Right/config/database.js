/**
 * Database Configuration Module
 *
 * What: MySQL 데이터베이스 연결 관리
 * Why: 데이터베이스 연결을 중앙에서 관리하여 재사용
 * How: mysql2/promise를 사용한 커넥션 풀 생성
 */

const mysql = require('mysql2/promise');

// 커넥션 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * 데이터베이스 연결 테스트
 * @returns {Promise<boolean>} 연결 성공 여부
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('  Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('  Database connection failed:', error.message);
    return false;
  }
}

/**
 * todos 테이블 생성 (존재하지 않는 경우)
 * @returns {Promise<void>}
 */
async function initializeTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS todos (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(500) DEFAULT '',
      completed BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      INDEX idx_createdAt (createdAt DESC),
      INDEX idx_completed (completed)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  try {
    await pool.execute(createTableSQL);
    console.log('  Todos table ready');
  } catch (error) {
    console.error('  Failed to create todos table:', error.message);
    throw error;
  }
}

/**
 * 데이터베이스 초기화 (연결 테스트 + 테이블 생성)
 * @returns {Promise<boolean>}
 */
async function initialize() {
  const connected = await testConnection();
  if (connected) {
    await initializeTable();
  }
  return connected;
}

module.exports = {
  pool,
  testConnection,
  initializeTable,
  initialize
};
