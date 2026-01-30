/**
 * Validator Module
 *
 * What: 입력값 검증 유틸리티
 * Why: 데이터 무결성 보장 및 보안 강화
 * How: 각 필드별 검증 규칙 적용
 */

/**
 * Todo 생성 시 입력값 검증
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null (유효한 경우)
 */
function validateCreateTodo(data) {
  // title 필수 체크
  if (data.title === undefined || data.title === null) {
    return 'Title is required';
  }

  // title 타입 체크
  if (typeof data.title !== 'string') {
    return 'Title must be a string';
  }

  // title 빈 문자열 체크
  if (data.title.trim().length === 0) {
    return 'Title cannot be empty';
  }

  // title 길이 체크
  if (data.title.length > 100) {
    return 'Title must be 100 characters or less';
  }

  // description 길이 체크 (선택 항목)
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      return 'Description must be a string';
    }
    if (data.description.length > 500) {
      return 'Description must be 500 characters or less';
    }
  }

  return null;
}

/**
 * Todo 전체 수정 시 입력값 검증 (PUT)
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null (유효한 경우)
 */
function validateUpdateTodo(data) {
  // title 검증
  const titleError = validateCreateTodo(data);
  if (titleError) {
    return titleError;
  }

  // completed 필수 체크
  if (data.completed === undefined || data.completed === null) {
    return 'Completed is required';
  }

  // completed 타입 체크
  if (typeof data.completed !== 'boolean') {
    return 'Completed must be a boolean';
  }

  return null;
}

/**
 * Todo 부분 수정 시 입력값 검증 (PATCH)
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null (유효한 경우)
 */
function validatePatchTodo(data) {
  // 최소 하나의 필드는 있어야 함
  if (!data || Object.keys(data).length === 0) {
    return 'At least one field is required';
  }

  // title이 있으면 검증
  if (data.title !== undefined) {
    if (data.title === null || typeof data.title !== 'string') {
      return 'Title must be a string';
    }
    if (data.title.trim().length === 0) {
      return 'Title cannot be empty';
    }
    if (data.title.length > 100) {
      return 'Title must be 100 characters or less';
    }
  }

  // description이 있으면 검증
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      return 'Description must be a string';
    }
    if (data.description.length > 500) {
      return 'Description must be 500 characters or less';
    }
  }

  // completed가 있으면 검증
  if (data.completed !== undefined && data.completed !== null) {
    if (typeof data.completed !== 'boolean') {
      return 'Completed must be a boolean';
    }
  }

  return null;
}

/**
 * UUID 형식 검증
 * @param {string} id - 검증할 ID
 * @returns {boolean} 유효 여부
 */
function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validatePatchTodo,
  isValidUUID
};
