/**
 * Todo Router
 *
 * What: URL 패턴과 HTTP 메서드를 Controller에 매핑
 * Why: 요청 라우팅 로직을 분리하여 관리 용이
 * How: URL 패턴 매칭으로 적절한 핸들러 호출, UUID 검증 포함
 */

const todoController = require('../controllers/todoController');
const response = require('../utils/response');
const { parseJson } = require('../middlewares/jsonParser');
const { logRequest, logResponse } = require('../middlewares/logger');
const { handleError } = require('../middlewares/errorHandler');
const { isValidUUID } = require('../utils/validator');
const config = require('../config/config');

/**
 * URL에서 Todo ID 추출 및 UUID 검증
 * /todos/550e8400-e29b-41d4-a716-446655440000 -> 550e8400-e29b-41d4-a716-446655440000
 *
 * @param {string} url - 요청 URL
 * @returns {string|null} 유효한 UUID인 경우 ID, 아니면 null
 */
function extractTodoId(url) {
  const match = url.match(/^\/todos\/([^\/]+)$/);
  if (!match) return null;

  const id = match[1];
  return isValidUUID(id) ? id : null;
}

/**
 * Toggle 엔드포인트 URL 확인 및 UUID 검증
 * /todos/:id/toggle 패턴 매칭
 *
 * @param {string} url - 요청 URL
 * @returns {{id: string}|null} 유효한 UUID인 경우 ID 객체, 아니면 null
 */
function extractToggleId(url) {
  const match = url.match(/^\/todos\/([^\/]+)\/toggle$/);
  if (!match) return null;

  const id = match[1];
  return isValidUUID(id) ? { id } : null;
}

/**
 * CORS 헤더 설정
 *
 * @param {Object} res - HTTP Response 객체
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', config.cors.origin);
  res.setHeader('Access-Control-Allow-Methods', config.cors.methods);
  res.setHeader('Access-Control-Allow-Headers', config.cors.headers);
}

/**
 * 메인 라우터 함수
 * 모든 HTTP 요청을 처리하고 적절한 핸들러로 라우팅
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function router(req, res) {
  const startTime = Date.now();
  const { method, url } = req;

  // 요청 로깅
  logRequest(req);

  try {
    // JSON 파싱 (POST, PUT, PATCH 요청)
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      req.body = await parseJson(req);
    }

    // CORS 프리플라이트 요청 처리
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': config.cors.origin,
        'Access-Control-Allow-Methods': config.cors.methods,
        'Access-Control-Allow-Headers': config.cors.headers
      });
      res.end();
      logResponse(req, 204, startTime);
      return;
    }

    // CORS 헤더 설정
    setCorsHeaders(res);

    // 라우팅
    // POST /todos - Todo 생성
    if (method === 'POST' && url === '/todos') {
      await todoController.createTodo(req, res);
      logResponse(req, res.statusCode, startTime);
      return;
    }

    // GET /todos - Todo 목록 조회
    if (method === 'GET' && url === '/todos') {
      await todoController.getTodos(req, res);
      logResponse(req, res.statusCode, startTime);
      return;
    }

    // PATCH /todos/:id/toggle - Todo 완료 상태 토글
    const toggleMatch = extractToggleId(url);
    if (method === 'PATCH' && toggleMatch) {
      req.params = { id: toggleMatch.id };
      await todoController.toggleTodo(req, res);
      logResponse(req, res.statusCode, startTime);
      return;
    }

    // /todos/:id 엔드포인트
    const todoId = extractTodoId(url);
    if (todoId) {
      req.params = { id: todoId };

      // GET /todos/:id - 특정 Todo 조회
      if (method === 'GET') {
        await todoController.getTodoById(req, res);
        logResponse(req, res.statusCode, startTime);
        return;
      }

      // PUT /todos/:id - Todo 전체 수정
      if (method === 'PUT') {
        await todoController.updateTodo(req, res);
        logResponse(req, res.statusCode, startTime);
        return;
      }

      // PATCH /todos/:id - Todo 부분 수정
      if (method === 'PATCH') {
        await todoController.patchTodo(req, res);
        logResponse(req, res.statusCode, startTime);
        return;
      }

      // DELETE /todos/:id - Todo 삭제
      if (method === 'DELETE') {
        await todoController.deleteTodo(req, res);
        logResponse(req, res.statusCode, startTime);
        return;
      }

      // 해당 ID에 대해 허용되지 않은 메서드
      response.methodNotAllowed(res, `Method ${method} not allowed for /todos/:id`);
      logResponse(req, 405, startTime);
      return;
    }

    // /todos/:id 형식이지만 유효하지 않은 UUID
    if (url.match(/^\/todos\/[^\/]+$/)) {
      response.badRequest(res, 'Invalid todo ID format');
      logResponse(req, 400, startTime);
      return;
    }

    // /todos/:id/toggle 형식이지만 유효하지 않은 UUID
    if (url.match(/^\/todos\/[^\/]+\/toggle$/)) {
      response.badRequest(res, 'Invalid todo ID format');
      logResponse(req, 400, startTime);
      return;
    }

    // /todos 엔드포인트에 허용되지 않은 메서드
    if (url === '/todos') {
      response.methodNotAllowed(res, `Method ${method} not allowed for /todos`);
      logResponse(req, 405, startTime);
      return;
    }

    // 404 Not Found
    response.notFound(res, `Route ${method} ${url} not found`);
    logResponse(req, 404, startTime);

  } catch (error) {
    handleError(error, req, res);
    logResponse(req, res.statusCode || 500, startTime);
  }
}

module.exports = router;
