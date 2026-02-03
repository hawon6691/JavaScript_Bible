/**
 * Todo Service
 *
 * What: Todo 관련 비즈니스 로직 처리
 * Why: 비즈니스 로직을 Controller와 분리하여 재사용성 향상
 * How: Repository를 통한 데이터 접근, Model을 통한 객체 생성
 */

const todoRepository = require('../repositories');
const Todo = require('../models/Todo');

/**
 * 새 Todo 생성
 *
 * @param {Object} data - Todo 데이터
 * @returns {Object} 생성된 Todo
 */
async function createTodo(data) {
  const todo = Todo.createTodo(data);
  await todoRepository.save(todo);
  return todo;
}

/**
 * 모든 Todo 조회
 *
 * @returns {Object} todos 배열과 count
 */
async function getAllTodos() {
  const todos = await todoRepository.findAll();
  return {
    todos,
    count: todos.length,
  };
}

/**
 * ID로 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} Todo 또는 null
 */
async function getTodoById(id) {
  return await todoRepository.findById(id);
}

/**
 * Todo 전체 수정 (PUT)
 *
 * @param {string} id - Todo ID
 * @param {Object} data - 수정 데이터
 * @returns {Object|null} 수정된 Todo 또는 null
 */
async function updateTodo(id, data) {
  const existingTodo = await todoRepository.findById(id);
  if (!existingTodo) {
    return null;
  }

  const updatedTodo = Todo.updateTodo(existingTodo, data);
  return await todoRepository.update(id, updatedTodo);
}

/**
 * Todo 부분 수정 (PATCH)
 *
 * @param {string} id - Todo ID
 * @param {Object} data - 수정 데이터
 * @returns {Object|null} 수정된 Todo 또는 null
 */
async function patchTodo(id, data) {
  const existingTodo = await todoRepository.findById(id);
  if (!existingTodo) {
    return null;
  }

  const updatedTodo = Todo.updateTodo(existingTodo, data);
  return await todoRepository.update(id, updatedTodo);
}

/**
 * Todo 완료 상태 토글
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} 토글된 Todo 또는 null
 */
async function toggleTodo(id) {
  const existingTodo = await todoRepository.findById(id);
  if (!existingTodo) {
    return null;
  }

  const toggledTodo = Todo.toggleTodo(existingTodo);
  return await todoRepository.update(id, toggledTodo);
}

/**
 * Todo 삭제
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} 삭제된 Todo 또는 null
 */
async function deleteTodo(id) {
  return await todoRepository.remove(id);
}

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  patchTodo,
  toggleTodo,
  deleteTodo,
};
