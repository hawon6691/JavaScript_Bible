/**
 * Todo Service
 *
 * What: Todo 비즈니스 로직 계층
 * Why: 비즈니스 로직을 Controller와 Repository로부터 분리
 * How: Repository를 통한 데이터 접근 및 비즈니스 규칙 적용
 */

const todoRepository = require('../repositories/todoRepository');
const { createTodo, updateTodo, toggleTodo } = require('../models/Todo');

/**
 * 새로운 Todo 생성
 *
 * @param {Object} data - Todo 데이터 (title, description)
 * @returns {Promise<Object>} 생성된 Todo 객체
 */
async function create(data) {
  const todo = createTodo(data);
  await todoRepository.save(todo);
  return todo;
}

/**
 * 모든 Todo 조회
 *
 * @returns {Promise<{todos: Array, count: number}>} Todo 목록과 개수
 */
async function getAll() {
  const todos = await todoRepository.findAll();
  return {
    todos,
    count: todos.length
  };
}

/**
 * ID로 특정 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} Todo 객체 또는 null
 */
async function getById(id) {
  return await todoRepository.findById(id);
}

/**
 * Todo 전체 수정 (PUT)
 *
 * @param {string} id - Todo ID
 * @param {Object} data - 수정할 데이터 (title, description, completed)
 * @returns {Promise<Object|null>} 수정된 Todo 또는 null (존재하지 않는 경우)
 */
async function update(id, data) {
  const existingTodo = await todoRepository.findById(id);

  if (!existingTodo) {
    return null;
  }

  const updatedTodo = updateTodo(existingTodo, data);
  return await todoRepository.update(id, updatedTodo);
}

/**
 * Todo 부분 수정 (PATCH)
 *
 * @param {string} id - Todo ID
 * @param {Object} data - 수정할 데이터 (일부 필드만 포함 가능)
 * @returns {Promise<Object|null>} 수정된 Todo 또는 null
 */
async function patch(id, data) {
  const existingTodo = await todoRepository.findById(id);

  if (!existingTodo) {
    return null;
  }

  const patchedTodo = updateTodo(existingTodo, data);
  return await todoRepository.update(id, patchedTodo);
}

/**
 * Todo 삭제
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} 삭제된 Todo 또는 null
 */
async function remove(id) {
  return await todoRepository.remove(id);
}

/**
 * Todo 완료 상태 토글
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} 토글된 Todo 또는 null
 */
async function toggle(id) {
  const existingTodo = await todoRepository.findById(id);

  if (!existingTodo) {
    return null;
  }

  const toggledTodo = toggleTodo(existingTodo);
  return await todoRepository.update(id, toggledTodo);
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  patch,
  remove,
  toggle
};
