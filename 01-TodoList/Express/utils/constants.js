/**
 * 상수 정의
 *
 * What: 애플리케이션 전역에서 사용되는 상수
 * Why: 매직 넘버/스트링 제거, 유지보수성 향상
 * How: 객체로 그룹화하여 export
 */

// 검증 관련 상수
const VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

// HTTP 상태 코드
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

// 에러 코드
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_JSON: 'INVALID_JSON',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

// 성공 메시지
const SUCCESS_MESSAGES = {
  TODO_CREATED: 'Todo created successfully',
  TODO_RETRIEVED: 'Todo retrieved successfully',
  TODOS_RETRIEVED: 'Todos retrieved successfully',
  NO_TODOS_FOUND: 'No todos found',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
  TODO_TOGGLED: 'Todo toggled successfully',
};

// 에러 메시지
const ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Title is required',
  TITLE_EMPTY: 'Title cannot be empty',
  TITLE_TOO_LONG: `Title must be ${VALIDATION.TITLE_MAX_LENGTH} characters or less`,
  DESCRIPTION_TOO_LONG: `Description must be ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters or less`,
  COMPLETED_MUST_BE_BOOLEAN: 'Completed must be a boolean',
  TODO_NOT_FOUND: (id) => `Todo not found with id: ${id}`,
  INVALID_JSON: 'Invalid JSON format',
  INTERNAL_ERROR: 'Internal server error',
};

module.exports = {
  VALIDATION,
  HTTP_STATUS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};
