/**
 * Logger Middleware
 *
 * What: HTTP 요청/응답 로깅
 * Why: 디버깅 및 모니터링을 위한 요청 기록
 * How: 요청 시작/종료 시점에 로그 출력
 */

/**
 * 현재 시간을 ISO 형식으로 반환
 * @returns {string} ISO 형식 시간 문자열
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * 요청 로깅
 *
 * @param {Object} req - HTTP Request 객체
 */
function logRequest(req) {
  const timestamp = getTimestamp();
  const { method, url } = req;
  console.log(`[${timestamp}] --> ${method} ${url}`);
}

/**
 * 응답 로깅
 *
 * @param {Object} req - HTTP Request 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {number} startTime - 요청 시작 시간 (ms)
 */
function logResponse(req, statusCode, startTime) {
  const timestamp = getTimestamp();
  const { method, url } = req;
  const duration = Date.now() - startTime;
  console.log(`[${timestamp}] <-- ${method} ${url} ${statusCode} ${duration}ms`);
}

/**
 * 에러 로깅
 *
 * @param {Error} error - 에러 객체
 * @param {Object} req - HTTP Request 객체
 */
function logError(error, req) {
  const timestamp = getTimestamp();
  const { method, url } = req;
  console.error(`[${timestamp}] ERROR ${method} ${url}`);
  console.error(`  Message: ${error.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(`  Stack: ${error.stack}`);
  }
}

module.exports = {
  logRequest,
  logResponse,
  logError
};
