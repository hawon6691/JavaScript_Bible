/**
 * Todo Repository - MySQL 버전
 *
 * What: Todo 데이터의 저장, 조회, 수정, 삭제 (MySQL)
 * Why: 데이터 영속성 보장, 확장성 있는 저장소
 * How: mysql2/promise를 사용한 CRUD 구현
 */

const { getPool } = require('../config/database');

/**
 * 새 Todo 저장
 *
 * @param {Object} todo - 저장할 Todo 객체
 * @returns {Object} 저장된 Todo
 */
async function save(todo) {
  const pool = getPool();

  const sql = `
    INSERT INTO todos (id, title, description, completed, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    todo.id,
    todo.title,
    todo.description,
    todo.completed,
    new Date(todo.createdAt),
    new Date(todo.updatedAt),
  ];

  await pool.execute(sql, values);
  return todo;
}

/**
 * 모든 Todo 조회 (최신순 정렬)
 *
 * @returns {Array} Todo 배열
 */
async function findAll() {
  const pool = getPool();

  const sql = `
    SELECT id, title, description, completed, createdAt, updatedAt
    FROM todos
    ORDER BY createdAt DESC
  `;

  const [rows] = await pool.execute(sql);

  // MySQL datetime을 ISO string으로 변환
  return rows.map(formatTodo);
}

/**
 * ID로 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} Todo 또는 null
 */
async function findById(id) {
  const pool = getPool();

  const sql = `
    SELECT id, title, description, completed, createdAt, updatedAt
    FROM todos
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return formatTodo(rows[0]);
}

/**
 * Todo 업데이트
 *
 * @param {string} id - Todo ID
 * @param {Object} updatedTodo - 업데이트된 Todo 객체
 * @returns {Object|null} 업데이트된 Todo 또는 null
 */
async function update(id, updatedTodo) {
  const pool = getPool();

  const sql = `
    UPDATE todos
    SET title = ?, description = ?, completed = ?, updatedAt = ?
    WHERE id = ?
  `;

  const values = [
    updatedTodo.title,
    updatedTodo.description,
    updatedTodo.completed,
    new Date(updatedTodo.updatedAt),
    id,
  ];

  const [result] = await pool.execute(sql, values);

  if (result.affectedRows === 0) {
    return null;
  }

  return updatedTodo;
}

/**
 * Todo 삭제
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} 삭제된 Todo 또는 null
 */
async function remove(id) {
  const pool = getPool();

  // 먼저 삭제할 Todo 조회
  const todo = await findById(id);
  if (!todo) {
    return null;
  }

  const sql = 'DELETE FROM todos WHERE id = ?';
  await pool.execute(sql, [id]);

  return todo;
}

/**
 * 전체 개수 조회
 *
 * @returns {number} Todo 개수
 */
async function count() {
  const pool = getPool();

  const sql = 'SELECT COUNT(*) as count FROM todos';
  const [rows] = await pool.execute(sql);

  return rows[0].count;
}

/**
 * MySQL 결과를 API 형식으로 변환
 *
 * @param {Object} row - MySQL row
 * @returns {Object} 포맷된 Todo
 */
function formatTodo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    completed: Boolean(row.completed),
    createdAt: row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : row.createdAt,
    updatedAt: row.updatedAt instanceof Date
      ? row.updatedAt.toISOString()
      : row.updatedAt,
  };
}

// 메모리 버전과의 호환성을 위한 더미 함수
async function load() {
  const cnt = await count();
  console.log(`  Loaded ${cnt} todos from MySQL`);
}

async function backup() {
  console.log('  MySQL: No backup needed (data persisted in database)');
}

module.exports = {
  save,
  findAll,
  findById,
  update,
  remove,
  count,
  load,
  backup,
};
