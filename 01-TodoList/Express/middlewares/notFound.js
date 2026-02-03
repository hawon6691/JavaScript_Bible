/**
 * 404 Not Found 미들웨어
 *
 * What: 존재하지 않는 라우트 처리
 * Why: 명확한 404 응답 제공
 * How: 모든 라우트 매칭 실패 시 실행
 */

const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');

/**
 * 404 핸들러
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 */
function notFound(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = notFound;
