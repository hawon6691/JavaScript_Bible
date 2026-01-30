/**
 * Error Handler Middleware
 *
 * What: 전역 에러 처리
 * Why: 일관된 에러 응답 형식 및 서버 안정성 보장
 * How: 에러 타입에 따른 적절한 HTTP 응답 생성
 */

const response = require('../utils/response');
const { logError } = require('./logger');

/**
 * 에러를 HTTP 응답으로 변환
 *
 * @param {Error} error - 에러 객체
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
function handleError(error, req, res) {
  // 이미 응답이 전송된 경우 무시
  if (res.headersSent) {
    return;
  }

  // 에러 로깅
  logError(error, req);

  // 에러 타입에 따른 응답
  switch (error.code) {
    case 'INVALID_JSON':
      return response.badRequest(res, 'Invalid JSON format', 'INVALID_JSON');

    case 'VALIDATION_ERROR':
      return response.badRequest(res, error.message, 'VALIDATION_ERROR');

    case 'NOT_FOUND':
      return response.notFound(res, error.message);

    default:
      // 프로덕션 환경에서는 상세 에러 메시지 숨김
      const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error.message;
      return response.serverError(res, message);
  }
}

/**
 * 커스텀 에러 생성 헬퍼
 *
 * @param {string} message - 에러 메시지
 * @param {string} code - 에러 코드
 * @returns {Error} 코드가 포함된 에러 객체
 */
function createError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

module.exports = {
  handleError,
  createError
};
