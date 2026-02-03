/**
 * 응답 헬퍼 유틸리티
 *
 * What: 일관된 API 응답 형식 생성
 * Why: 모든 응답이 동일한 구조를 가지도록 보장
 * How: Express의 res.json()을 래핑하여 표준 형식 제공
 */

const { HTTP_STATUS, ERROR_CODES } = require('./constants');

/**
 * 성공 응답 생성
 *
 * @param {Object} res - Express response 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {Object|Array} data - 응답 데이터
 * @param {string} message - 응답 메시지
 * @param {Object} [extra={}] - 추가 필드 (count 등)
 */
function success(res, statusCode, data, message, extra = {}) {
  res.status(statusCode).json({
    success: true,
    data,
    message,
    ...extra,
  });
}

/**
 * 에러 응답 생성
 *
 * @param {Object} res - Express response 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {string} code - 에러 코드
 * @param {string} message - 에러 메시지
 */
function error(res, statusCode, code, message) {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

// 편의 메서드들

function ok(res, data, message, extra = {}) {
  success(res, HTTP_STATUS.OK, data, message, extra);
}

function created(res, data, message) {
  success(res, HTTP_STATUS.CREATED, data, message);
}

function badRequest(res, message) {
  error(res, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, message);
}

function notFound(res, message) {
  error(res, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, message);
}

function serverError(res, message = 'Internal server error') {
  error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR, message);
}

module.exports = {
  success,
  error,
  ok,
  created,
  badRequest,
  notFound,
  serverError,
};
