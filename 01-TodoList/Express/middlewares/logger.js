/**
 * 요청 로깅 미들웨어
 *
 * What: 모든 HTTP 요청을 로깅
 * Why: 디버깅 및 모니터링 용이
 * How: Express 미들웨어로 요청 정보 출력
 */

/**
 * 요청 로깅 미들웨어
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - 다음 미들웨어
 */
function logger(req, res, next) {
  const startTime = Date.now();

  // 응답 완료 시 로깅
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}

module.exports = logger;
