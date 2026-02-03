/**
 * 입력값 검증 유틸리티
 *
 * What: Todo 데이터 검증
 * Why: 잘못된 데이터가 시스템에 저장되는 것을 방지
 * How: 각 필드별 검증 규칙 적용
 */

const { VALIDATION, ERROR_MESSAGES } = require('./constants');

/**
 * Todo 생성 시 검증
 *
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null (유효한 경우)
 */
function validateCreateTodo(data) {
  // title 필수 체크
  if (data.title === undefined || data.title === null) {
    return ERROR_MESSAGES.TITLE_REQUIRED;
  }

  // title 타입 체크
  if (typeof data.title !== 'string') {
    return ERROR_MESSAGES.TITLE_REQUIRED;
  }

  // title 빈 문자열 체크
  if (data.title.trim().length < VALIDATION.TITLE_MIN_LENGTH) {
    return ERROR_MESSAGES.TITLE_EMPTY;
  }

  // title 길이 체크
  if (data.title.length > VALIDATION.TITLE_MAX_LENGTH) {
    return ERROR_MESSAGES.TITLE_TOO_LONG;
  }

  // description 길이 체크 (선택 필드)
  if (data.description !== undefined && data.description !== null) {
    if (
      typeof data.description === 'string' &&
      data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH
    ) {
      return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }
  }

  return null;
}

/**
 * Todo 전체 수정 시 검증 (PUT)
 *
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null
 */
function validateUpdateTodo(data) {
  // title 검증 (필수)
  const titleError = validateCreateTodo(data);
  if (titleError) {
    return titleError;
  }

  // completed 타입 체크 (필수)
  if (data.completed === undefined || data.completed === null) {
    return ERROR_MESSAGES.COMPLETED_MUST_BE_BOOLEAN;
  }

  if (typeof data.completed !== 'boolean') {
    return ERROR_MESSAGES.COMPLETED_MUST_BE_BOOLEAN;
  }

  return null;
}

/**
 * Todo 부분 수정 시 검증 (PATCH)
 *
 * @param {Object} data - 검증할 데이터
 * @returns {string|null} 에러 메시지 또는 null
 */
function validatePatchTodo(data) {
  // title이 있으면 검증
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      return ERROR_MESSAGES.TITLE_REQUIRED;
    }

    if (data.title.trim().length < VALIDATION.TITLE_MIN_LENGTH) {
      return ERROR_MESSAGES.TITLE_EMPTY;
    }

    if (data.title.length > VALIDATION.TITLE_MAX_LENGTH) {
      return ERROR_MESSAGES.TITLE_TOO_LONG;
    }
  }

  // description이 있으면 검증
  if (data.description !== undefined && data.description !== null) {
    if (
      typeof data.description === 'string' &&
      data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH
    ) {
      return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }
  }

  // completed가 있으면 검증
  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    return ERROR_MESSAGES.COMPLETED_MUST_BE_BOOLEAN;
  }

  return null;
}

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validatePatchTodo,
};
