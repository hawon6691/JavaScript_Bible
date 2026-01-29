/**
 * Todo Controller
 *
 * What: HTTP 요청/응답 처리 계층
 * Why: HTTP 관련 로직을 비즈니스 로직과 분리
 * How: 요청 검증 → 서비스 호출 → 응답 생성
 */

const todoService = require('../services/todoService');
const response = require('../utils/response');
const { validateCreateTodo, validateUpdateTodo, validatePatchTodo } = require('../utils/validator');

/**
 * Todo 생성
 * POST /todos
 *
 * @param {Object} req - HTTP Request 객체 (req.body 포함)
 * @param {Object} res - HTTP Response 객체
 */
async function createTodo(req, res) {
  // 1. 입력값 검증
  const validationError = validateCreateTodo(req.body);
  if (validationError) {
    return response.badRequest(res, validationError);
  }

  // 2. 서비스 호출
  const todo = await todoService.create(req.body);

  // 3. 응답 전송
  return response.created(res, todo, 'Todo created successfully');
}

/**
 * 모든 Todo 조회
 * GET /todos
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function getTodos(req, res) {
  const { todos, count } = await todoService.getAll();

  const message = count > 0
    ? 'Todos retrieved successfully'
    : 'No todos found';

  return response.success(res, todos, message, { count });
}

/**
 * 특정 Todo 조회
 * GET /todos/:id
 *
 * @param {Object} req - HTTP Request 객체 (req.params.id 포함)
 * @param {Object} res - HTTP Response 객체
 */
async function getTodoById(req, res) {
  const { id } = req.params;

  const todo = await todoService.getById(id);

  if (!todo) {
    return response.notFound(res, `Todo not found with id: ${id}`);
  }

  return response.success(res, todo, 'Todo retrieved successfully');
}

/**
 * Todo 전체 수정
 * PUT /todos/:id
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function updateTodo(req, res) {
  const { id } = req.params;

  // 1. 입력값 검증
  const validationError = validateUpdateTodo(req.body);
  if (validationError) {
    return response.badRequest(res, validationError);
  }

  // 2. 서비스 호출
  const todo = await todoService.update(id, req.body);

  if (!todo) {
    return response.notFound(res, `Todo not found with id: ${id}`);
  }

  return response.success(res, todo, 'Todo updated successfully');
}

/**
 * Todo 부분 수정
 * PATCH /todos/:id
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function patchTodo(req, res) {
  const { id } = req.params;

  // 1. 입력값 검증
  const validationError = validatePatchTodo(req.body);
  if (validationError) {
    return response.badRequest(res, validationError);
  }

  // 2. 서비스 호출
  const todo = await todoService.patch(id, req.body);

  if (!todo) {
    return response.notFound(res, `Todo not found with id: ${id}`);
  }

  return response.success(res, todo, 'Todo updated successfully');
}

/**
 * Todo 삭제
 * DELETE /todos/:id
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function deleteTodo(req, res) {
  const { id } = req.params;

  const todo = await todoService.remove(id);

  if (!todo) {
    return response.notFound(res, `Todo not found with id: ${id}`);
  }

  return response.success(res, todo, 'Todo deleted successfully');
}

/**
 * Todo 완료 상태 토글
 * PATCH /todos/:id/toggle
 *
 * @param {Object} req - HTTP Request 객체
 * @param {Object} res - HTTP Response 객체
 */
async function toggleTodo(req, res) {
  const { id } = req.params;

  const todo = await todoService.toggle(id);

  if (!todo) {
    return response.notFound(res, `Todo not found with id: ${id}`);
  }

  return response.success(res, todo, 'Todo toggled successfully');
}

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  patchTodo,
  deleteTodo,
  toggleTodo
};
