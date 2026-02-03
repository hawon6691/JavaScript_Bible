/**
 * Todo 모델
 *
 * What: Todo 엔티티의 구조 정의
 * Why: 일관된 데이터 구조와 생성 로직 중앙화
 * How: 팩토리 함수를 통한 Todo 객체 생성
 */

const { generateUUID } = require('../utils/uuid');

/**
 * 새로운 Todo 객체 생성
 *
 * @param {Object} data - Todo 데이터
 * @param {string} data.title - Todo 제목 (필수)
 * @param {string} [data.description=''] - Todo 설명 (선택)
 * @returns {Object} 생성된 Todo 객체
 */
function createTodo(data) {
  const now = new Date().toISOString();

  return {
    id: generateUUID(),
    title: data.title.trim(),
    description: data.description?.trim() || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 기존 Todo 업데이트
 *
 * @param {Object} existingTodo - 기존 Todo 객체
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Object} 업데이트된 Todo 객체
 */
function updateTodo(existingTodo, updateData) {
  const updated = { ...existingTodo };

  if (updateData.title !== undefined) {
    updated.title = updateData.title.trim();
  }

  if (updateData.description !== undefined) {
    updated.description = updateData.description.trim();
  }

  if (updateData.completed !== undefined) {
    updated.completed = updateData.completed;
  }

  updated.updatedAt = new Date().toISOString();

  return updated;
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
    updatedAt: new Date().toISOString(),
  };
}

module.exports = {
  createTodo,
  updateTodo,
  toggleTodo,
};
