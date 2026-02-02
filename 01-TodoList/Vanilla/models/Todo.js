/**
 * Todo Model
 *
 * What: Todo 엔티티의 데이터 구조 정의
 * Why: 일관된 데이터 구조와 생성 로직을 보장
 * How: Factory 함수를 통한 Todo 객체 생성
 */

const { generateUUID } = require('../utils/uuid');

/**
 * 새로운 Todo 객체 생성
 *
 * @param {Object} data - Todo 데이터
 * @param {string} data.title - 할 일 제목 (필수, 1-100자)
 * @param {string} [data.description] - 할 일 설명 (선택, 최대 500자)
 * @returns {Object} 생성된 Todo 객체
 */
function createTodo(data) {
  const now = new Date().toISOString();

  return {
    id: generateUUID(),
    title: data.title,
    description: data.description || '',
    completed: false,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Todo 객체 업데이트
 *
 * @param {Object} todo - 기존 Todo 객체
 * @param {Object} data - 업데이트할 데이터
 * @returns {Object} 업데이트된 Todo 객체
 */
function updateTodo(todo, data) {
  return {
    ...todo,
    title: data.title !== undefined ? data.title : todo.title,
    description: data.description !== undefined ? data.description : todo.description,
    completed: data.completed !== undefined ? data.completed : todo.completed,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Todo 완료 상태 토글
 *
 * @param {Object} todo - 기존 Todo 객체
 * @returns {Object} 토글된 Todo 객체
 */
function toggleTodo(todo) {
  return {
    ...todo,
    completed: !todo.completed,
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  createTodo,
  updateTodo,
  toggleTodo
};
