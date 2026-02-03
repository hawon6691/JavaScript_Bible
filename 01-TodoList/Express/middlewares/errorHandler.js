/**
 * 에러 핸들러 미들웨어
 *
 * What: 전역 에러 처리
 * Why: 일관된 에러 응답 형식 보장, 에러 로깅
 * How: Express의 4개 인자 미들웨어 (에러 핸들러)
 */

const { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } = require('../utils/constants');

/**
 * 전역 에러 핸들러
 *
 * @param {Error} err - 에러 객체
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - 다음 미들웨어
 */
function errorHandler(err, req, res, next) {
  // 에러 로깅 (서버 콘솔에만)
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // JSON 파싱 에러
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_JSON,
        message: ERROR_MESSAGES.INVALID_JSON,
      },
    });
  }

  // 기타 에러
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    },
  });
}

module.exports = errorHandler;
