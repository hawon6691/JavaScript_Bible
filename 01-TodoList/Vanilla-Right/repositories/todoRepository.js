/**
 * Todo Repository (MySQL Version)
 *
 * What: Todo 데이터 접근 계층
 * Why: 데이터 저장소를 추상화하여 비즈니스 로직과 분리
 * How: mysql2/promise를 사용한 CRUD 연산 구현
 */

const { pool } = require('../config/database');

/**
 * 새로운 Todo 저장
 *
 * @param {Object} todo - 저장할 Todo 객체
 * @returns {Promise<Object>} 저장된 Todo 객체
 */
async function save(todo) {
  const sql = `
    INSERT INTO todos (id, title, description, completed, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    todo.id,
    todo.title,
    todo.description,
    todo.completed,
    todo.createdAt,
    todo.updatedAt
  ];

  await pool.execute(sql, values);
  return todo;
}

/**
 * 모든 Todo 조회
 * 생성 시간 기준 최신순 정렬
 *
 * @returns {Promise<Array>} Todo 배열
 */
async function findAll() {
  const sql = `
    SELECT id, title, description, completed, createdAt, updatedAt
    FROM todos
    ORDER BY createdAt DESC
  `;

  const [rows] = await pool.execute(sql);

  // MySQL boolean을 JavaScript boolean으로 변환
  return rows.map(row => ({
    ...row,
    completed: Boolean(row.completed),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt
  }));
}

/**
 * ID로 특정 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} Todo 객체 또는 null
 */
async function findById(id) {
  const sql = `
    SELECT id, title, description, completed, createdAt, updatedAt
    FROM todos
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    ...row,
    completed: Boolean(row.completed),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt
  };
}

/**
 * Todo 업데이트
 *
 * @param {string} id - Todo ID
 * @param {Object} updatedTodo - 업데이트된 Todo 객체
 * @returns {Promise<Object|null>} 업데이트된 Todo 또는 null
 */
async function update(id, updatedTodo) {
  const sql = `
    UPDATE todos
    SET title = ?, description = ?, completed = ?, updatedAt = ?
    WHERE id = ?
  `;

  const values = [
    updatedTodo.title,
    updatedTodo.description,
    updatedTodo.completed,
    updatedTodo.updatedAt,
    id
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
 * @returns {Promise<Object|null>} 삭제된 Todo 또는 null
 */
async function remove(id) {
  // 먼저 삭제할 Todo를 조회
  const todo = await findById(id);

  if (!todo) {
    return null;
  }

  const sql = `DELETE FROM todos WHERE id = ?`;
  await pool.execute(sql, [id]);

  return todo;
}

/**
 * 전체 Todo 개수 조회
 *
 * @returns {Promise<number>} Todo 개수
 */
async function count() {
  const sql = `SELECT COUNT(*) as count FROM todos`;
  const [rows] = await pool.execute(sql);
  return rows[0].count;
}

/**
 * 모든 Todo 삭제 (테스트용)
 *
 * @returns {Promise<void>}
 */
async function clear() {
  const sql = `DELETE FROM todos`;
  await pool.execute(sql);
}

module.exports = {
  save,
  findAll,
  findById,
  update,
  remove,
  count,
  clear
};
