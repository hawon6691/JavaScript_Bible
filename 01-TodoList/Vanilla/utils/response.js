/**
 * Response Helper Module
 *
 * What: HTTP 응답 생성 헬퍼 함수
 * Why: 일관된 응답 형식 유지
 * How: 표준화된 JSON 응답 구조 생성
 */

/**
 * JSON 응답 전송
 * @param {Object} res - HTTP Response 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {Object} data - 응답 데이터
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(data));
}

/**
 * 성공 응답 (200 OK)
 * @param {Object} res - HTTP Response 객체
 * @param {*} data - 응답 데이터
 * @param {string} message - 응답 메시지
 * @param {Object} extra - 추가 필드 (예: count)
 */
function success(res, data, message = 'Success', extra = {}) {
  sendJson(res, 200, {
    success: true,
    data,
    message,
    ...extra
  });
}

/**
 * 생성 성공 응답 (201 Created)
 * @param {Object} res - HTTP Response 객체
 * @param {*} data - 생성된 데이터
 * @param {string} message - 응답 메시지
 */
function created(res, data, message = 'Created successfully') {
  sendJson(res, 201, {
    success: true,
    data,
    message
  });
}

/**
 * 잘못된 요청 응답 (400 Bad Request)
 * @param {Object} res - HTTP Response 객체
 * @param {string} message - 에러 메시지
 * @param {string} code - 에러 코드
 */
function badRequest(res, message = 'Bad Request', code = 'VALIDATION_ERROR') {
  sendJson(res, 400, {
    success: false,
    error: {
      code,
      message
    }
  });
}

/**
 * 리소스 없음 응답 (404 Not Found)
 * @param {Object} res - HTTP Response 객체
 * @param {string} message - 에러 메시지
 */
function notFound(res, message = 'Not Found') {
  sendJson(res, 404, {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message
    }
  });
}

/**
 * 허용되지 않은 메서드 응답 (405 Method Not Allowed)
 * @param {Object} res - HTTP Response 객체
 * @param {string} message - 에러 메시지
 */
function methodNotAllowed(res, message = 'Method Not Allowed') {
  sendJson(res, 405, {
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message
    }
  });
}

/**
 * 서버 에러 응답 (500 Internal Server Error)
 * @param {Object} res - HTTP Response 객체
 * @param {string} message - 에러 메시지 (클라이언트에 노출)
 */
function serverError(res, message = 'Internal Server Error') {
  sendJson(res, 500, {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message
    }
  });
}

module.exports = {
  sendJson,
  success,
  created,
  badRequest,
  notFound,
  methodNotAllowed,
  serverError
};
